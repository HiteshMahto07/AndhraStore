import { useState, useEffect } from 'react';
import { Cookie, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        const timer = setTimeout(() => {
          setIsRendered(true);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsVisible(true));
          });
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const dismiss = (data) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify({ ...data, date: new Date().toISOString() }));
    } catch (e) {}
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 600);
  };

  const handleAccept = () => dismiss({ accepted: true, all: true });
  const handleDecline = () => dismiss({ accepted: false, all: false });
  const handleSavePreferences = () => dismiss({ accepted: true, preferences });

  if (!isRendered) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[200] transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleDecline}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-label="Cookie consent"
        className={`fixed z-[201] left-1/2 bottom-4 -translate-x-1/2 w-[92%] max-w-[500px] max-h-[85vh] overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-24 opacity-0 scale-95'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden">
          {/* Accent line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-brand-400 via-brand-500 to-olive-500" />

          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-50 border border-brand-100">
                <Cookie size={18} className="text-brand-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900">Cookie consent</h3>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-[13px] leading-relaxed mb-5">
              We and our partners use cookies and other technologies to personalize
              your experience, show you ads, and perform analytics, and we will not use
              cookies or other technologies for these purposes unless you accept them.
              Learn more in our{' '}
              <Link href="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium transition-colors">
                Privacy Policy
              </Link>.
            </p>

            {/* Preferences Panel — only rendered when toggled */}
            {showPreferences && (
              <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-fade-in">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings size={12} />
                  Preferences
                </h4>

                {/* Necessary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={13} className="text-olive-600" />
                    <span className="text-sm text-gray-700">Necessary</span>
                    <span className="text-[10px] text-gray-400 font-medium">(always on)</span>
                  </div>
                  <div style={{ position: 'relative', width: '44px', height: '24px', flexShrink: 0 }}>
                    <div style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: '#6B8E3A' }} />
                    <div style={{ position: 'absolute', top: '2px', left: '22px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Analytics</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.analytics}
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    style={{
                      position: 'relative', width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0, border: 'none', cursor: 'pointer', padding: 0,
                      backgroundColor: preferences.analytics ? '#6B8E3A' : '#D1D5DB',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: '2px',
                      left: preferences.analytics ? '22px' : '2px',
                      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
                    }} />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Marketing</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.marketing}
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    style={{
                      position: 'relative', width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0, border: 'none', cursor: 'pointer', padding: 0,
                      backgroundColor: preferences.marketing ? '#6B8E3A' : '#D1D5DB',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: '2px',
                      left: preferences.marketing ? '22px' : '2px',
                      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
                    }} />
                  </button>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="w-full mt-1 py-2 text-xs font-semibold text-white bg-olive-600 rounded-lg hover:bg-olive-700 transition-colors shadow-sm"
                >
                  Save preferences
                </button>
              </div>
            )}

            {/* Bottom actions */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowPreferences(prev => !prev)}
                  className="text-[13px] font-medium text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors whitespace-nowrap"
                >
                  {showPreferences ? 'Hide preferences' : 'Manage preferences'}
                </button>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleAccept}
                    className="px-5 py-2 text-[13px] font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow active:scale-[0.97]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-5 py-2 text-[13px] font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.97]"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
