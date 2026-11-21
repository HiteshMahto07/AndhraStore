/**
 * POST /api/admin/login   { password }  → sets the admin session cookie
 * POST /api/admin/login?logout=1        → clears it
 */

import { checkPassword, loginCookie, logoutCookie, isAdminConfigured } from '@/lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  if (req.query.logout) {
    res.setHeader('Set-Cookie', logoutCookie());
    return res.status(200).json({ ok: true });
  }

  if (!isAdminConfigured()) return res.status(503).json({ error: 'Admin login is not set up (ADMIN_PASSWORD missing).' });

  if (!checkPassword(req.body?.password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down password guessing
    return res.status(401).json({ error: 'Wrong password' });
  }

  res.setHeader('Set-Cookie', loginCookie());
  return res.status(200).json({ ok: true });
}
