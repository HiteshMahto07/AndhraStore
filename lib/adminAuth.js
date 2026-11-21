/**
 * lib/adminAuth.js  —  SERVER-SIDE ONLY
 *
 * Single-password login for /admin. The session cookie holds an HMAC derived
 * from ADMIN_PASSWORD, so changing the password in Vercel logs everyone out.
 *
 * Env: ADMIN_PASSWORD (use a long, random password)
 */

import crypto from 'crypto';

export const ADMIN_COOKIE = 'as_admin';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sessionToken() {
  return crypto.createHmac('sha256', process.env.ADMIN_PASSWORD).update('andhra-store-admin-v1').digest('hex');
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(password) {
  return isAdminConfigured() && typeof password === 'string' && safeEqual(password, process.env.ADMIN_PASSWORD);
}

export function isAdminRequest(req) {
  if (!isAdminConfigured()) return false;
  const value = req.cookies?.[ADMIN_COOKIE];
  return typeof value === 'string' && safeEqual(value, sessionToken());
}

function cookie(value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export const loginCookie  = () => cookie(sessionToken(), MAX_AGE);
export const logoutCookie = () => cookie('', 0);
