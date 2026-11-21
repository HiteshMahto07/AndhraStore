/**
 * lib/orderAlert.js  —  SERVER-SIDE ONLY
 *
 * Emails the store about every new order (COD placed / online payment
 * verified) through Resend's REST API (no extra npm dependency).
 *
 * Env:
 *   RESEND_API_KEY      re_… from resend.com → API Keys
 *   ORDER_ALERT_EMAIL   where alerts go; comma-separate for several addresses
 *   ORDER_ALERT_FROM    optional, e.g. "Andhra Store <orders@andhrastore.com>"
 *                       (needs the domain verified in Resend). Defaults to
 *                       Resend's test sender, which can ONLY deliver to the
 *                       email address the Resend account was created with.
 *
 * Best-effort: never throws, never blocks checkout for more than ~5s.
 */

const SITE = 'https://andhrastore.com';

export function isOrderAlertConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_ALERT_EMAIL);
}

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function buildEmail(o) {
  const isCOD = o.payment_method === 'cod';
  const kind  = isCOD ? 'COD order' : 'Paid order';
  const items = Array.isArray(o.items) ? o.items : [];
  const address = [o.address1, o.address2, `${o.city}, ${o.state} - ${o.pincode}`].filter(Boolean).join(', ');

  const subject = `🛒 New ${kind}: ₹${o.total} from ${o.customer_name} (${o.city})`;

  const itemRows = items
    .map((i) => `<tr><td style="padding:4px 0">${esc(i.name)} (${esc(i.weightLabel || i.weight)}${i.packaging ? ` · ${esc(i.packaging)}` : ''}) × ${esc(i.qty)}</td><td style="padding:4px 0;text-align:right">₹${esc(i.lineTotal)}</td></tr>`)
    .join('');

  const html = `
<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:560px">
  <h2 style="margin:0 0 4px">New ${kind}: ₹${esc(o.total)}</h2>
  <p style="margin:0 0 16px;color:#555">${isCOD ? 'Cash on Delivery: confirm with the customer on WhatsApp.' : `Paid online via Razorpay (payment ${esc(o.razorpay_payment_id)}).`}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:12px">${itemRows}
    <tr><td style="padding:4px 0;border-top:1px solid #ddd">Subtotal</td><td style="padding:4px 0;border-top:1px solid #ddd;text-align:right">₹${esc(o.subtotal)}</td></tr>
    <tr><td style="padding:4px 0">Delivery</td><td style="padding:4px 0;text-align:right">${o.delivery ? `₹${esc(o.delivery)}` : 'Free'}</td></tr>
    ${o.cod_charge ? `<tr><td style="padding:4px 0">COD charge</td><td style="padding:4px 0;text-align:right">₹${esc(o.cod_charge)}</td></tr>` : ''}
    <tr><td style="padding:4px 0"><b>Total</b></td><td style="padding:4px 0;text-align:right"><b>₹${esc(o.total)}</b></td></tr>
  </table>
  <p style="margin:0 0 4px"><b>${esc(o.customer_name)}</b></p>
  <p style="margin:0 0 4px"><a href="tel:+91${esc(o.phone)}">+91 ${esc(o.phone)}</a> · <a href="https://wa.me/91${esc(o.phone)}">WhatsApp</a>${o.email ? ` · ${esc(o.email)}` : ''}</p>
  <p style="margin:0 0 12px">${esc(address)}</p>
  <p style="margin:0 0 16px;color:#555">Order ID: ${esc(o.id)}${o.source ? `<br>Source: ${esc([o.source, o.medium, o.campaign].filter(Boolean).join(' / '))}` : ''}</p>
  <a href="${SITE}/admin" style="display:inline-block;background:#F97316;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Open orders admin</a>
</div>`.trim();

  const text = [
    `New ${kind}: ₹${o.total}`,
    ...items.map((i) => `- ${i.name} (${i.weightLabel || i.weight}) x ${i.qty}: ₹${i.lineTotal}`),
    `Total: ₹${o.total}`,
    '',
    o.customer_name,
    `+91 ${o.phone}`,
    address,
    '',
    `Order ID: ${o.id}`,
    `${SITE}/admin`,
  ].join('\n');

  return { subject, html, text };
}

/**
 * @param order  row shaped like the `orders` table (see supabase/orders.sql)
 */
export async function sendOrderAlert(order) {
  if (!isOrderAlertConfigured() || !order) return;
  try {
    const { subject, html, text } = buildEmail(order);
    const res = await fetch('https://api.resend.com/emails', {
      method : 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        from   : process.env.ORDER_ALERT_FROM || 'Andhra Store Orders <onboarding@resend.dev>',
        to     : process.env.ORDER_ALERT_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
        subject,
        html,
        text,
      }),
      signal : AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error('[order-alert] Resend', res.status, (await res.text()).slice(0, 300));
  } catch (err) {
    console.error('[order-alert] failed', order.id, err.message);
  }
}
