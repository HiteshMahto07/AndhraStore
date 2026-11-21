/**
 * lib/orders.js  —  SERVER-SIDE ONLY (import from pages/api/* or getServerSideProps)
 *
 * Persists orders to Supabase (table `orders`, see supabase/orders.sql) through
 * its REST API, so no extra npm dependency is needed.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   SUPABASE_URL               e.g. https://abcd1234.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  the secret / service_role key (never NEXT_PUBLIC_)
 *
 * Saving is best-effort: if the env vars are missing or Supabase is down, the
 * callers log the error and the customer's checkout continues normally.
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isOrdersDbConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function supabase(path, { method = 'GET', body, prefer } = {}) {
  if (!isOrdersDbConfigured()) throw new Error('Orders DB not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');

  const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
  // Legacy JWT keys (eyJ…) also go in Authorization; new sb_secret_… keys must not.
  if (SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Supabase ${method} ${path.split('?')[0]} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Input cleaning ───────────────────────────────────────────────────────────

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Validates + trims the customer/address object sent by the checkout page.
 * Returns { customer } or { error }.
 */
export function cleanCustomer(raw) {
  if (!raw || typeof raw !== 'object') return { error: 'Missing customer details' };
  const c = {
    name    : str(raw.name, 100),
    phone   : str(raw.phone, 10),
    email   : str(raw.email, 120),
    address1: str(raw.address1),
    address2: str(raw.address2),
    city    : str(raw.city, 80),
    state   : str(raw.state, 80),
    pincode : str(raw.pincode, 6),
  };
  if (!c.name || !/^\d{10}$/.test(c.phone) || !c.address1 || !c.city || !c.state || !/^\d{6}$/.test(c.pincode)) {
    return { error: 'Incomplete customer details' };
  }
  return { customer: c };
}

/** Reads the last-touch attribution cookie set by middleware.js / lib/attribution.js. */
export function attributionFromCookies(cookies = {}) {
  const raw = cookies.as_attr_lt || cookies.as_attr_ft;
  if (!raw) return {};
  for (const candidate of [raw, (() => { try { return decodeURIComponent(raw); } catch { return raw; } })()]) {
    try {
      const a = JSON.parse(candidate);
      return { source: str(a.source, 100) || null, medium: str(a.medium, 100) || null, campaign: str(a.campaign, 150) || null };
    } catch { /* try next */ }
  }
  return {};
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Inserts an order row. `ignoreDuplicates` makes a retried insert with the same
 * id a no-op instead of an error.
 */
export async function insertOrder({ id, paymentMethod, paymentStatus, customer, totals, codCharge = 0, attribution = {} }) {
  return supabase('orders?on_conflict=id', {
    method: 'POST',
    prefer: 'return=minimal,resolution=ignore-duplicates',
    body  : {
      id,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      customer_name : customer.name,
      phone         : customer.phone,
      email         : customer.email || null,
      address1      : customer.address1,
      address2      : customer.address2 || null,
      city          : customer.city,
      state         : customer.state,
      pincode       : customer.pincode,
      items         : totals.lines,
      subtotal      : totals.subtotal,
      delivery      : totals.delivery,
      cod_charge    : codCharge,
      total         : totals.total + codCharge,
      source        : attribution.source || null,
      medium        : attribution.medium || null,
      campaign      : attribution.campaign || null,
    },
  });
}

export async function markOrderPaid(orderId, paymentId) {
  return supabase(`orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body  : { payment_status: 'paid', razorpay_payment_id: paymentId, paid_at: new Date().toISOString() },
  });
}

// ─── Reads (admin) ────────────────────────────────────────────────────────────

export async function listOrders({ limit = 300 } = {}) {
  return supabase(`orders?select=*&order=created_at.desc&limit=${limit}`);
}
