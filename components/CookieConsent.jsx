import { useState, useEffect } from 'react';
import { Cookie, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { updateConsent, restoreConsent } from '@/lib/gtm';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Effect 1: Show banner for new visitors (no saved consent).
  // Existing visitors already have 'cookie-consent' in localStorage — banner stays hidden.
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

  // Effect 2: Restore previous consent for returning visitors on every page load.
  // Fires within the 500ms wait_for_update window set in _document.js so GTM
  // receives the 'granted' update before it times out and fires tags at 'denied'.
  useEffect(() => {
    restoreConsent();
  }, []);

  const dismiss = (data) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify({ ...data, date: new Date().toISOString() }));
    } catch (e) {}
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 600);
  };

  // Each handler calls updateConsent() BEFORE dismiss() so GTM receives the
  // signal immediately — before the banner animates out.
  const handleAccept = () => {
    updateConsent(true, true);
    dismiss({ accepted: true, all: true });
  };

  const handleDecline = () => {
    updateConsent(false, false);
    dismiss({ accepted: false, all: false });
  };

  const handleSavePreferences = () => {
    updateConsent(preferences.analytics, preferences.marketing);
    dismiss({ accepted: true, preferences });
  };

  if (!isRendered) return null;

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[200] h-32 bg-gradient-to-t from-black/10 to-transparent transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label="Cookie consent"
        className={`fixed bottom-0 left-1/2 z-[201] max-h-[90vh] w-full -translate-x-1/2 overflow-y-auto transition-all duration-300 ease-out sm:bottom-4 sm:w-[calc(100%-2rem)] sm:max-w-[760px] ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-16 opacity-0 scale-95'
        }`}
      >
        <div className="overflow-hidden rounded-t-2xl border border-gray-200/80 bg-white shadow-2xl sm:rounded-2xl">
          <div className="h-[3px] w-full bg-gradient-to-r from-brand-400 via-brand-500 to-olive-500" aria-hidden="true" />

          <div className="p-4 sm:p-5">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-100 bg-brand-50" aria-hidden="true">
                <Cookie size={18} className="text-brand-600" />
              </div>
              <h2 className="font-heading text-base font-bold text-gray-900 sm:text-lg">Cookie consent</h2>
            </div>

            <p className="mb-4 text-[12px] leading-5 text-gray-600 sm:text-[13px]">
              We use optional cookies for analytics and personalised advertising only with your consent. Necessary cookies keep the store working. Learn more in our{' '}
              <Link href="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium transition-colors">
                Privacy Policy
              </Link>.
            </p>

            {showPreferences && (
              <div className="mb-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 animate-fade-in">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings size={12} aria-hidden="true" />
                  Preferences
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={13} className="text-olive-600" aria-hidden="true" />
                    <span className="text-sm text-gray-700">Necessary</span>
                    <span className="text-[10px] text-gray-400 font-medium">(always on)</span>
                  </div>
                  <div style={{ position: 'relative', width: '44px', height: '24px', flexShrink: 0 }} aria-label="Necessary cookies — always enabled" role="status">
                    <div style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: '#6B8E3A' }} />
                    <div style={{ position: 'absolute', top: '2px', left: '22px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Analytics</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.analytics}
                    aria-label="Toggle analytics cookies"
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

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Marketing</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.marketing}
                    aria-label="Toggle marketing cookies"
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

            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setShowPreferences(prev => !prev)}
                  className="text-[13px] font-medium text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors whitespace-nowrap"
                  aria-expanded={showPreferences}
                >
                  {showPreferences ? 'Hide preferences' : 'Manage preferences'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleAccept}
                    className="min-h-11 rounded-lg bg-gray-900 px-4 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow active:scale-[0.97]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleDecline}
                    className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 text-[13px] font-semibold text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.97]"
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
