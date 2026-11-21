# Orders admin panel: setup

`/admin` lists every order (COD and paid online), with customer, address, items and totals. It's protected by one password.

## One-time setup (about 10 minutes)

1. **Create a Supabase project**: supabase.com → New project (free plan, region Mumbai `ap-south-1`).
2. **Create the table**: Supabase → SQL Editor → New query → paste `supabase/orders.sql` → Run.
3. **Copy the keys**: Supabase → Project Settings → API:
   - Project URL → `SUPABASE_URL`
   - `service_role` key (or the new **secret** key `sb_secret_…`) → `SUPABASE_SERVICE_ROLE_KEY`
   - Do **not** use the `anon` / publishable key, and never prefix these with `NEXT_PUBLIC_`.
4. **Pick an admin password**: long and random (16+ characters) → `ADMIN_PASSWORD`.
5. **Vercel** → Project → Settings → Environment Variables (Production): add the three variables above, then **redeploy**.
6. Open `https://andhrastore.com/admin` and log in.

Until step 5 is done, checkout works exactly as before. Orders just aren't saved.

## New-order email alerts (optional, free)

Every new COD order and every verified online payment sends an email with the items, total, customer, phone/WhatsApp link, address and a link to `/admin`.

1. Sign up at resend.com **with the email address that should receive the alerts** (free plan: 3,000 emails/month).
2. Resend → API Keys → Create → copy `re_…`.
3. Vercel env vars: `RESEND_API_KEY` = that key, `ORDER_ALERT_EMAIL` = the same email address. Redeploy.

Without a verified domain, Resend's test sender (`onboarding@resend.dev`) can only deliver to the email the Resend account was created with. To send to other or multiple addresses (comma-separated in `ORDER_ALERT_EMAIL`), verify `andhrastore.com` in Resend → Domains (add the DNS records it shows) and set `ORDER_ALERT_FROM`, e.g. `Andhra Store <orders@andhrastore.com>`.

- Alerts are best-effort: if Resend fails, the order is still saved and checkout is unaffected (the error is logged in Vercel).
- One email per order: a retried request doesn't send a duplicate.
- COD alerts work even before Supabase is set up. Paid-order alerts need Supabase, because the customer details come from the saved order.

## How orders get saved

| Flow | When it's saved | Status shown |
|---|---|---|
| Cash on Delivery | When the customer clicks *Confirm COD Order* (in parallel with opening WhatsApp) | **COD** |
| Online (Razorpay) | When the payment window opens → `pending`; after the signature check passes → `paid` | **Paid online** |
| Online, abandoned or failed | Stays `pending` | Hidden by default ("Show unpaid online attempts") |

- Prices and totals are recalculated on the server from the product catalog. Browser prices are ignored.
- Saving never blocks checkout. If Supabase is down, the order still goes through (WhatsApp / Razorpay) and the error is logged in Vercel.
- The COD WhatsApp message now includes the order ID, so a WhatsApp chat can be matched to its row in `/admin`.
- Source / medium / campaign come from the site's attribution cookie (UTM links, gclid, fbclid).

## Security notes

- The `orders` table has Row Level Security on with no policies, so only the server key can read or write it.
- Session cookie: HttpOnly, Secure, SameSite=Strict, 30 days. Changing `ADMIN_PASSWORD` logs everyone out.
- `/admin` is `noindex`, blocked in robots.txt, excluded from the sitemap, and doesn't load GTM (no GA4/Meta/Clarity hits from staff).
