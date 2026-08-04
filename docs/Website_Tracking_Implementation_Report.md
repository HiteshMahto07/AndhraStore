# Website Tracking Implementation Report

**Project:** Andhra Store (Next.js, Pages Router)
**Branch:** `fix/website-tracking-cleanup` (off `origin/master`)
**Commit:** `0bf303c`
**Scope:** Website-side dataLayer implementation only. No changes to Google Tag Manager, GA4 property configuration, Meta Pixel, or Microsoft Clarity.

---

## 1. Executive Summary

The website's dataLayer implementation was audited and rebuilt to be the single, accurate source of truth for every GA4-recommended ecommerce event. Before this change, 6 of 10 recommended ecommerce events never fired anywhere in the code (`view_item`, `view_item_list`, `select_item`, `remove_from_cart`, `view_cart`, `add_shipping_info`), `item_category` was hardcoded incorrectly for 3 of the site's 4 product lines, and Cash-on-Delivery orders were recorded as a confirmed `purchase` the instant a button was clicked — before any confirmation existed. All of this has been fixed at the website layer only; GTM, GA4, Meta Pixel, and Microsoft Clarity were not touched, per explicit instruction.

All ecommerce dataLayer pushes now flow through one module, `lib/analytics.js`. Every event fires from exactly one call site per user action, uses one consistent item schema, and includes an accurate product category rather than a hardcoded one.

---

## 2. Files Changed

| File | Type of Change |
|---|---|
| `lib/analytics.js` | Rewritten — single source of truth for all ecommerce dataLayer pushes |
| `context/CartContext.jsx` | `remove_from_cart` wired into `removeFromCart()` |
| `components/CartDrawer.jsx` | `view_cart` wired into the cart-open transition effect |
| `components/ProductCard.jsx` | `select_item` wired into all click targets; `category` fixed on quick-add |
| `pages/pickles/[slug].js` | `view_item` on mount; `category` added to `add_to_cart` |
| `pages/podi/[slug].js` | `view_item` on mount (no cart feature on this page) |
| `pages/snacks/[slug].js` | `view_item` on mount; `category` added to `add_to_cart` |
| `pages/sweets/[slug].js` | `view_item` on mount; `category` added to `add_to_cart` |
| `pages/pickles/index.js` | `view_item_list` + `select_item`; `category` fixed |
| `pages/pickles/veg.js` | `view_item_list` + `select_item`; `category` fixed |
| `pages/pickles/non-veg.js` | `view_item_list` + `select_item`; `category` fixed |
| `pages/podi/index.js` | `view_item_list` + `select_item` (no cart feature on this page) |
| `pages/snacks/index.js` | `view_item_list` + `select_item`; `category` added to `add_to_cart` |
| `pages/sweets/index.js` | `view_item_list` + `select_item`; `category` added to `add_to_cart` |
| `pages/checkout/index.js` | `add_shipping_info` added; COD's `purchase` replaced with `order_placed_unconfirmed` |
| `pages/contact/index.js` | `generate_lead('contact_form')` added |
| `components/Header.jsx` | `generate_lead('whatsapp_cta')` added to the WhatsApp CTA |

**17 files changed, 390 insertions(+), 58 deletions(-)**

No files were deleted. `lib/dataLayer.js` — an unfinished, abandoned second dataLayer implementation from an earlier migration attempt — was never committed to any shared branch (it exists only in a stash on a different branch), so there was nothing to remove here.

---

## 3. Why Each Change Was Required

### `item_category` was hardcoded and wrong
The previous `lib/analytics.js` set `item_category: 'Andhra Pickle'` for **every** product pushed, including snacks, podi, and sweets. This corrupted any GA4 category-level report. Fixed by threading a real `category` value ("Pickles" | "Podi" | "Snacks" | "Sweets") through every call site — each page already knows its own category contextually, so no product-data files needed to change.

### Missing product-discovery events
`view_item`, `view_item_list`, and `select_item` did not exist anywhere in the code, despite GTM already having tags configured for several of them. This meant GA4's standard funnel exploration (View Item → Add to Cart → Begin Checkout → Purchase) had no top-of-funnel data at all. All three are now implemented across all four product-detail templates and all six category-listing pages.

### Missing cart-visibility and cart-edit events
`view_cart` and `remove_from_cart` never fired. `view_cart` now fires from a single place — `CartDrawer`'s own open-transition `useEffect` — so it fires exactly once per drawer-open regardless of which UI action opened it (header icon or the auto-open after adding an item). `remove_from_cart` now fires from `CartContext.removeFromCart`, reading the item's data **before** dispatching the removal (the data is gone from state immediately after).

### Missing shipping-info event
`add_shipping_info` never fired. It now fires once, in the checkout form's submit handler, immediately after the delivery address passes validation — the earliest point in this flow where a real shipping cost is known (there is no separate carrier/method-selection step to hook into instead).

### `add_payment_info` had a payload accuracy problem, not a timing problem
The event already fired at a reasonable point (after server-side order creation, before the Razorpay modal opens). Its *payload* was fixed (category, brand, tax). Its firing point was **not** changed, because Razorpay's client SDK exposes no earlier reliable hook — `payment.failed`, `modal.ondismiss`, and the success `handler` are all post-interaction callbacks only.

### Purchase timing — the most significant fix
- **Razorpay:** `pushPurchase()` already only fired inside the `handler` callback, after `/api/verify-payment` cryptographically confirms the payment signature server-side. This was already correct and was left unchanged.
- **Cash on Delivery:** had no equivalent confirmation step anywhere in the architecture — no webhook, no admin order-status flow. The old code fired `purchase` with a synthetic `orderId` the instant the button was clicked, before the WhatsApp message was even sent. This has been replaced with a distinctly-named `order_placed_unconfirmed` event carrying the same rich payload, so no existing (or future) trigger matching the literal event name `purchase` can accidentally count an unconfirmed COD order as a conversion. Whether and how to treat `order_placed_unconfirmed` as a soft/assisted conversion is a **GTM/reporting decision**, intentionally left for separate follow-up rather than decided unilaterally here.

### No lead tracking on WhatsApp/contact touchpoints
The contact form calls `e.preventDefault()` and redirects to a WhatsApp deep link, so GTM's built-in form-submission auto-listener can never observe it — this event was structurally dead no matter how GTM was configured. `generate_lead('contact_form')` and `generate_lead('whatsapp_cta')` (on the header's WhatsApp button) now cover this from the website side, since it's the only place this signal can originate.

---

## 4. Event Flow — Before vs After

### Before

```
Homepage / Category / Product pages   → (nothing fires)
Add to Cart                           → add_to_cart (wrong item_category on 3 of 4 product lines)
Cart Drawer opens                     → (nothing fires)
Remove item from cart                 → (nothing fires)
Begin Checkout                        → begin_checkout (wrong item_category)
Checkout form submitted               → (no shipping event)
Payment method chosen                 → add_payment_info (wrong item_category)
Razorpay payment verified server-side → purchase (correctly gated, wrong item_category)
COD "Confirm Order" clicked           → purchase  ⚠ fires before any confirmation exists
Contact form submitted                → (nothing fires)
WhatsApp CTA clicked                  → (nothing fires)
```

### After

```
Category page loads        → view_item_list   (correct category, full list, fires once)
Product card clicked       → select_item      (correct category, correct list name)
Product detail page loads  → view_item        (correct category)
Add to Cart                → add_to_cart      (correct category + brand)
Cart Drawer opens          → view_cart        (fires exactly once per open, any entry point)
Item removed from cart     → remove_from_cart (correct category, captured before removal)
"Proceed to Checkout"      → begin_checkout   (correct category)
Checkout form validated    → add_shipping_info  (new)
Payment method submitted   → add_payment_info (correct category + tax field)
Razorpay payment verified  → purchase         (timing unchanged — was already correct)
COD order confirmed by user → order_placed_unconfirmed  (NOT purchase — honestly named)
Contact form submitted     → generate_lead('contact_form')
WhatsApp CTA clicked       → generate_lead('whatsapp_cta')
```

---

## 5. Validation Results

| Check | Result |
|---|---|
| ESLint (all 17 changed files) | **0 errors**, 1 warning (documented, intentional — see below) |
| Duplicate dataLayer pushes | **None found** — verified by grepping every `push*()` call site; each event has exactly one call site per distinct user action (mutually exclusive branches like Razorpay-vs-COD or contact-form-vs-WhatsApp-CTA are two different actions, not duplicate firing of the same one) |
| Event payload consistency | Every event routes through the same `toGTMItem()` helper in `lib/analytics.js` — one item shape used everywhere |
| Production build | Reached "Checking validity of types ... ✓" with zero type errors, then failed at the webpack bundling stage with `Module not found: private-next-pages/_app.js` / `next-route-loader`. This is a **pre-existing environment limitation**, not a regression: this sandbox's webpack cannot resolve modules over the `\\wsl.localhost\...` UNC-mounted path it runs on. The identical failure signature occurs on completely unmodified code in this environment — confirmed independently earlier in this project's history. |
| TypeScript | Not applicable — this is a plain JavaScript/JSX codebase (no `tsconfig.json`, no `.ts`/`.tsx` files) |

**ESLint warning detail:** `components/CartDrawer.jsx` — `useEffect` has a missing dependency (`cartItems`, `cartTotal`) in the `view_cart` firing effect. This is intentional: the effect's dependency array is deliberately `[isCartOpen]` only, so it fires exactly once per open-transition rather than re-firing on every cart-content change while already open. Documented inline in the code.

---

## 6. Remaining GTM Work (Explicitly Out of Scope Here)

The following require changes inside Google Tag Manager itself and were **not** performed as part of this task:

1. **New triggers/tags needed** for the events introduced or newly reliable in this change: `view_item`, `view_item_list`, `select_item`, `remove_from_cart`, `view_cart`, `add_shipping_info`, `generate_lead`, `order_placed_unconfirmed`.
2. **Decide how `order_placed_unconfirmed` should be treated.** As implemented, no existing GTM trigger matches this event name, so COD orders will not appear as a GA4/Ads/Meta conversion anywhere until this is explicitly configured — a deliberate choice to avoid silently deciding a business/reporting question.
3. Any container-level issues identified in the earlier tracking audit (duplicate GA4 properties, duplicate Meta Pixel IDs, missing tag-level consent gating, the unrelated WooCommerce-targeted Custom HTML tag, duplicated Microsoft Clarity installs) are unaffected by this change and remain open GTM-side work.

---

## 7. Recommendations

- Prioritize wiring GTM triggers for `view_item_list` / `select_item` / `view_item` first — this closes the single largest visibility gap (the entire top of the funnel was previously untracked).
- Treat the `order_placed_unconfirmed` naming decision as a cross-functional call (marketing + finance), not a pure engineering one — it directly affects reported revenue and ROAS.
- Once GTM triggers exist for the new events, validate end-to-end in GTM Preview mode against a real cart/checkout run before considering this work complete on the GTM side.
- Consider whether COD orders eventually warrant a real server-side confirmation step (e.g., an admin action or webhook) if accurate COD conversion tracking becomes a priority — that would allow a genuine `purchase` event for COD instead of the current honestly-unconfirmed placeholder. This is a backend/product scope decision, not implied or started by this change.

---

## 8. Final Summary

All requested website-side tracking events are implemented, payloads are accurate and consistent, no duplicate pushes exist, and ESLint passes cleanly. GTM, GA4, Meta Pixel, and Microsoft Clarity configurations were not touched. The one meaningful business-logic judgment call made in this implementation — not counting unconfirmed COD orders as `purchase` — was made conservatively (favoring data accuracy over inflated conversion counts) and is clearly flagged as a follow-up decision for GTM/reporting configuration, not silently resolved.
