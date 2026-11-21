/**
 * /admin — orders list (password protected, see lib/adminAuth.js).
 *
 * Data is loaded server-side from Supabase on every visit (refresh = reload).
 * Shows COD orders and paid online orders. Online attempts that never got
 * paid ("pending") are hidden unless "Show unpaid attempts" is ticked.
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { isAdminRequest, isAdminConfigured } from '@/lib/adminAuth';
import { listOrders, isOrdersDbConfigured } from '@/lib/orders';

const LIMIT = 300;

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : null;

export async function getServerSideProps({ req, res }) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'private, no-store');

  if (!isAdminConfigured()) return { props: { setupError: 'ADMIN_PASSWORD is not set in the environment variables.' } };
  if (!isAdminRequest(req))  return { redirect: { destination: '/admin/login', permanent: false } };
  if (!isOrdersDbConfigured()) {
    return { props: { setupError: 'Orders database is not connected. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy.' } };
  }

  try {
    const rows = await listOrders({ limit: LIMIT });
    const orders = rows.map((o) => ({
      ...o,
      createdLabel: fmtDate(o.created_at),
      paidLabel   : fmtDate(o.paid_at),
    }));
    return { props: { orders, limit: LIMIT } };
  } catch (err) {
    console.error('[admin] load orders failed', err.message);
    return { props: { loadError: 'Could not load orders from the database. Check the Supabase keys and that supabase/orders.sql was run.' } };
  }
}

const STATUS = {
  paid   : { label: 'Paid online',  cls: 'bg-green-100 text-green-800' },
  cod    : { label: 'COD',          cls: 'bg-amber-100 text-amber-800' },
  pending: { label: 'Unpaid attempt', cls: 'bg-gray-100 text-gray-600' },
};

function Badge({ status }) {
  const s = STATUS[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

function Row({ label, children }) {
  if (children === null || children === undefined || children === '') return null;
  return (
    <div className="flex gap-3 py-1 text-sm">
      <dt className="w-28 shrink-0 text-gray-500">{label}</dt>
      <dd className="min-w-0 break-words text-gray-900">{children}</dd>
    </div>
  );
}

function OrderCard({ o }) {
  const itemCount = (o.items || []).reduce((n, i) => n + (i.qty || 0), 0);
  return (
    <details className="group rounded-xl border border-gray-200 bg-white shadow-sm open:ring-1 open:ring-orange-200">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-900">{o.customer_name}</span>
            <Badge status={o.payment_status} />
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            {o.createdLabel} · {o.city}, {o.state} · {itemCount} item{itemCount === 1 ? '' : 's'}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-900">₹{o.total}</div>
          <div className="text-xs text-gray-400 group-open:hidden">Details ▾</div>
        </div>
      </summary>

      <div className="border-t border-gray-100 px-4 py-3">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Items</h3>
        <ul className="mb-3 divide-y divide-gray-100 text-sm">
          {(o.items || []).map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3 py-1.5">
              <span className="text-gray-900">
                {i.name} <span className="text-gray-500">({i.weightLabel || i.weight}{i.packaging ? ` · ${i.packaging}` : ''})</span> × {i.qty}
              </span>
              <span className="shrink-0 text-gray-700">₹{i.lineTotal}</span>
            </li>
          ))}
        </ul>
        <dl className="mb-3 border-t border-gray-100 pt-2">
          <Row label="Subtotal">₹{o.subtotal}</Row>
          <Row label="Delivery">{o.delivery ? `₹${o.delivery}` : 'Free'}</Row>
          {o.cod_charge > 0 && <Row label="COD charge">₹{o.cod_charge}</Row>}
          <Row label="Total"><strong>₹{o.total}</strong></Row>
        </dl>

        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</h3>
        <dl className="mb-3">
          <Row label="Name">{o.customer_name}</Row>
          <Row label="Phone">
            <a href={`tel:+91${o.phone}`} className="text-orange-600 underline">+91 {o.phone}</a>
            {' · '}
            <a href={`https://wa.me/91${o.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">WhatsApp</a>
          </Row>
          <Row label="Email">{o.email}</Row>
          <Row label="Address">
            {[o.address1, o.address2, `${o.city}, ${o.state} - ${o.pincode}`].filter(Boolean).join(', ')}
          </Row>
        </dl>

        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Order</h3>
        <dl>
          <Row label="Order ID"><code className="text-xs">{o.id}</code></Row>
          <Row label="Payment">{o.payment_method === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</Row>
          <Row label="Payment ID">{o.razorpay_payment_id && <code className="text-xs">{o.razorpay_payment_id}</code>}</Row>
          <Row label="Paid at">{o.paidLabel}</Row>
          <Row label="Source">{o.source && [o.source, o.medium, o.campaign].filter(Boolean).join(' / ')}</Row>
        </dl>
      </div>
    </details>
  );
}

export default function AdminOrders({ orders = [], limit, setupError, loadError }) {
  const router = useRouter();
  const [showPending, setShowPending] = useState(false);

  async function logout() {
    await fetch('/api/admin/login?logout=1', { method: 'POST' }).catch(() => {});
    router.replace('/admin/login');
  }

  const visible  = showPending ? orders : orders.filter((o) => o.payment_status !== 'pending');
  const pending  = orders.length - orders.filter((o) => o.payment_status !== 'pending').length;
  const real     = orders.filter((o) => o.payment_status !== 'pending');
  const revenue  = real.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <Head>
        <title>Orders | Andhra Store admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900">Orders</h1>
            {!setupError && (
              <div className="flex gap-2">
                <button onClick={() => router.replace(router.asPath)} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">Refresh</button>
                <button onClick={logout} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">Log out</button>
              </div>
            )}
          </header>

          {(setupError || loadError) && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{setupError || loadError}</div>
          )}

          {!setupError && !loadError && (
            <>
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <div className="text-xs text-gray-500">Orders</div>
                  <div className="text-lg font-bold text-gray-900">{real.length}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <div className="text-xs text-gray-500">COD / Paid</div>
                  <div className="text-lg font-bold text-gray-900">
                    {real.filter((o) => o.payment_status === 'cod').length} / {real.filter((o) => o.payment_status === 'paid').length}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <div className="text-xs text-gray-500">Order value</div>
                  <div className="text-lg font-bold text-gray-900">₹{revenue.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <label className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={showPending} onChange={(e) => setShowPending(e.target.checked)} />
                Show unpaid online attempts ({pending})
              </label>

              {visible.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {visible.map((o) => <OrderCard key={o.id} o={o} />)}
                </div>
              )}

              {orders.length >= limit && (
                <p className="mt-4 text-center text-xs text-gray-400">Showing the latest {limit} records.</p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
