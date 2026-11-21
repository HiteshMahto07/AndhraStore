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
