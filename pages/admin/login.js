/**
 * /admin/login — password form for the orders admin panel.
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { isAdminRequest } from '@/lib/adminAuth';

export async function getServerSideProps({ req, res }) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (isAdminRequest(req)) return { redirect: { destination: '/admin', permanent: false } };
  return { props: {} };
}

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/admin/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Login failed');
      router.replace('/admin');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin login | Andhra Store</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Andhra Store admin</h1>
          <p className="text-sm text-gray-500 mb-5">Enter the admin password to see orders.</p>
          <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="mt-5 w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? 'Checking…' : 'Log in'}
          </button>
        </form>
      </main>
    </>
  );
}
