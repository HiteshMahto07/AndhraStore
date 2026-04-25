import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, User, Phone, Mail, LogIn, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Double rAF to allow browser to paint before triggering transition
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = '';
        // Reset after close animation
        setSuccess(false);
        setForm({ name: '', phone: '', email: '' });
        setErrors({});
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen && !visible) return null;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    // Brief artificial delay for UX feedback
    await new Promise((r) => setTimeout(r, 600));
    login({ name: form.name, phone: form.phone, email: form.email });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => onClose(), 900);
  };

  const field = (key, setter) => ({
    value: form[key],
    onChange: (e) => {
      setter(e.target.value);
      setErrors((prev) => ({ ...prev, [key]: '' }));
    },
  });

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal Wrapper ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Andhra Store"
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ease-out ${
            visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="relative bg-gradient-to-br from-olive-700 via-brand-600 to-brand-500 px-6 py-6 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative flex items-center gap-4">
              {/* Icon badge */}
              <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-1 ring-white/30 flex-shrink-0">
                <LogIn size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white leading-snug">
                  Welcome to Andhra Store
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  Sign in to track orders &amp; unlock exclusive offers
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close sign-in modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/35 active:scale-95 flex items-center justify-center text-white transition-all duration-150"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Success State ── */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
              <div
                className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center"
                style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
              >
                <CheckCircle2 size={34} className="text-brand-500" />
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-gray-800 text-base">You&apos;re signed in!</p>
                <p className="text-xs text-gray-400 mt-1">Happy shopping, {form.name.split(' ')[0]} 🎉</p>
              </div>
            </div>
          ) : (

            /* ── Form ── */
            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>

              {/* Name */}
              <div style={{ animation: visible ? 'slideUp 0.35s ease-out 0.05s both' : 'none' }}>
                <label htmlFor="lm-name" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Full Name <span className="text-brand-500">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="lm-name"
                    type="text"
                    placeholder="Ravi Kumar"
                    autoComplete="name"
                    {...field('name', (v) => setForm((f) => ({ ...f, name: v })))}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150 ${
                      errors.name
                        ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/25 bg-gray-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-px" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div style={{ animation: visible ? 'slideUp 0.35s ease-out 0.12s both' : 'none' }}>
                <label htmlFor="lm-phone" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Mobile Number <span className="text-brand-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="lm-phone"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    autoComplete="tel"
                    {...field('phone', (v) => setForm((f) => ({ ...f, phone: v.replace(/\D/g, '') })))}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150 ${
                      errors.phone
                        ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/25 bg-gray-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-px" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email (optional) */}
              <div style={{ animation: visible ? 'slideUp 0.35s ease-out 0.19s both' : 'none' }}>
                <label htmlFor="lm-email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="lm-email"
                    type="email"
                    placeholder="ravi@example.com"
                    autoComplete="email"
                    {...field('email', (v) => setForm((f) => ({ ...f, email: v })))}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150 ${
                      errors.email
                        ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/25 bg-gray-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-px" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div style={{ animation: visible ? 'slideUp 0.35s ease-out 0.26s both' : 'none' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="relative w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-brand-500/25 disabled:opacity-80 disabled:cursor-not-allowed mt-1 overflow-hidden group"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Continue to Shop
                      <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer */}
              <p
                className="text-center text-[11px] text-gray-400 leading-relaxed"
                style={{ animation: visible ? 'slideUp 0.35s ease-out 0.32s both' : 'none' }}
              >
                By continuing, you agree to our{' '}
                <Link href="/terms" onClick={onClose} className="text-brand-600 hover:text-brand-700 hover:underline underline-offset-2 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" onClick={onClose} className="text-brand-600 hover:text-brand-700 hover:underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ── Modal-scoped keyframes ── */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
