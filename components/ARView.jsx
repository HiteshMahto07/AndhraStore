import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/* ─── Dummy data maps ────────────────────────────────────────────── */
const nutritionData = {
  Chicken: { calories: 185, carbs: 2.1, protein: 18.5, fat: 11.2, fiber: 0.3 },
  Meat:    { calories: 210, carbs: 1.8, protein: 20.1, fat: 13.5, fiber: 0.2 },
  Prawns:  { calories: 165, carbs: 2.5, protein: 16.8, fat: 9.8,  fiber: 0.4 },
  Ginger:  { calories: 142, carbs: 8.4, protein: 3.2,  fat: 10.1, fiber: 2.8 },
  Mango:   { calories: 148, carbs: 12.5,protein: 2.1,  fat: 9.8,  fiber: 3.2 },
  Fish:    { calories: 178, carbs: 1.9, protein: 17.2, fat: 11.5, fiber: 0.2 },
  Garlic:  { calories: 152, carbs: 9.1, protein: 3.8,  fat: 10.5, fiber: 2.1 },
  RedChilli:{ calories: 138, carbs: 7.8, protein: 2.9, fat: 10.2, fiber: 3.5 },
  Gongura: { calories: 135, carbs: 6.2, protein: 3.5,  fat: 10.8, fiber: 2.9 },
  Tomato:  { calories: 140, carbs: 10.2,protein: 2.4,  fat: 9.5,  fiber: 2.6 },
  Lemon:   { calories: 132, carbs: 8.8, protein: 1.9,  fat: 9.2,  fiber: 2.4 },
  Amla:    { calories: 128, carbs: 11.5,protein: 2.2,  fat: 8.1,  fiber: 3.8 },
  Curry:   { calories: 130, carbs: 7.5, protein: 3.1,  fat: 9.8,  fiber: 3.2 },
  GreenChilli:{ calories: 136, carbs: 8.2,protein: 2.6, fat: 9.9,  fiber: 3.0 },
};
const spiceLevels = {
  Chicken:3, Meat:3, Prawns:3, Ginger:4, Mango:4, Fish:3,
  Garlic:4, RedChilli:5, Gongura:4, Tomato:3, Lemon:3,
  Amla:2, Curry:3, GreenChilli:5,
};
const featuresList = [
  'No preservatives','Gluten free','Small batch',
  'Cold-pressed oil','Andhra recipe','Hand-pounded spices',
];

/* ─── Inline style sheet (injected via <style>) ──────────────────── */
const STYLES = `
/* ── base resets inside the overlay ── */
.ar-overlay *{box-sizing:border-box;margin:0;padding:0}

/* ── animations ── */
@keyframes ar-bootFlicker{
  0%,4%,8%{opacity:0}
  2%,6%,10%,100%{opacity:1}
}
@keyframes ar-scanLine{
  0%{top:-4px}100%{top:100%}
}
@keyframes ar-fadeSlideUp{
  0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}
}
@keyframes ar-fadeSlideLeft{
  0%{opacity:0;transform:translateX(-30px)}100%{opacity:1;transform:translateX(0)}
}
@keyframes ar-fadeSlideRight{
  0%{opacity:0;transform:translateX(30px)}100%{opacity:1;transform:translateX(0)}
}
@keyframes ar-scaleIn{
  0%{opacity:0;transform:scale(.7)}100%{opacity:1;transform:scale(1)}
}
@keyframes ar-glow{
  0%,100%{box-shadow:0 0 8px rgba(0,229,255,.15)}
  50%{box-shadow:0 0 20px rgba(0,229,255,.35)}
}
@keyframes ar-pulse{
  0%,100%{opacity:1}50%{opacity:.4}
}
@keyframes ar-cornerDash{
  0%{stroke-dashoffset:200}100%{stroke-dashoffset:0}
}
@keyframes ar-progressFill{
  0%{width:0}100%{width:var(--fill)}
}
@keyframes ar-numberCount{
  0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}
}
@keyframes ar-gridPan{
  0%{background-position:0 0}100%{background-position:40px 40px}
}
@keyframes ar-ring{
  0%{stroke-dashoffset:var(--circum)}100%{stroke-dashoffset:var(--offset)}
}

/* ── grid background ── */
.ar-grid-bg{
  background-image:
    linear-gradient(rgba(0,229,255,.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,229,255,.03) 1px,transparent 1px);
  background-size:40px 40px;
  animation:ar-gridPan 12s linear infinite;
}

/* ── panel base ── */
.ar-panel{
  border:1px solid rgba(0,229,255,.12);
  border-radius:16px;
  background:rgba(6,18,38,.65);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  position:relative;overflow:hidden;
  animation:ar-glow 4s ease-in-out infinite;
}
.ar-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,229,255,.5),transparent);
}

/* ── scan line sweeping inside panels ── */
.ar-scan-sweep{
  position:absolute;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(0,229,255,.4),transparent);
  animation:ar-scanLine 3s linear infinite;
  pointer-events:none;
}

/* ── label chip ── */
.ar-label{
  font-size:9px;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(0,229,255,.8);font-weight:600;margin-bottom:14px;
  display:flex;align-items:center;gap:6px;
}
.ar-label::before{
  content:'';width:10px;height:1px;background:rgba(0,229,255,.5);
}

/* ── spice bar ── */
.ar-spice-bar{
  height:6px;border-radius:3px;animation:ar-progressFill 1.5s ease forwards;
  width:var(--fill);
}

/* ── feature dot ── */
.ar-feat-dot{
  width:7px;height:7px;border-radius:50%;
  box-shadow:0 0 8px var(--c);background:var(--c);
  animation:ar-pulse 2.5s ease infinite;
  animation-delay:var(--d);
}

/* ── bottom stat cards ── */
.ar-stat{
  border:1px solid rgba(0,229,255,.1);border-radius:14px;
  background:rgba(6,18,38,.5);padding:16px 12px;text-align:center;
  animation:ar-fadeSlideUp .6s ease both;animation-delay:var(--d);
}
.ar-stat-value{
  font-size:20px;font-weight:800;
  background:linear-gradient(135deg,var(--c1),var(--c2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}

/* responsive */
@media(max-width:768px){
  .ar-main-grid{grid-template-columns:1fr!important}
  .ar-top-grid{grid-template-columns:1fr!important}
  .ar-bottom-stats{grid-template-columns:repeat(2,1fr)!important}
}
`;

/* ─── Animated Number Counter ────────────────────────────────────── */
function AnimNum({ value, suffix = '', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const dur = 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setDisplay(+(ease * value).toFixed(1));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return <>{display}{suffix}</>;
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ARView({ pickle, weight = '250', onClose }) {
  const [phase, setPhase] = useState('boot');     // boot → scan → reveal
  const [scanY, setScanY] = useState(0);
  const overlayRef = useRef(null);

  const displayWeight = weight === '1' ? '1 Kg' : `${weight}g`;

  const nutrition = nutritionData[pickle.type] || nutritionData.Mango;
  const spice     = spiceLevels[pickle.type] || 3;
  const freshness = 86 + Math.floor(Math.random() * 10);
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (freshness / 100) * circumference;

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Boot → scan → reveal timeline */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('scan'), 800);
    const t2 = setTimeout(() => setPhase('reveal'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Scan line */
  useEffect(() => {
    if (phase !== 'scan') return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      setScanY(p * 100);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div ref={overlayRef} className="ar-overlay ar-grid-bg" style={{
        position: 'fixed', inset: 0, zIndex: 300, overflowY: 'auto',
        background: 'linear-gradient(160deg,#020a18 0%,#071428 50%,#0a0e1a 100%)',
        fontFamily: "'Inter','SF Pro','system-ui',sans-serif",
        color: '#c8d6e5',
      }}>

        {/* ════════  BOOT PHASE  ════════ */}
        {phase === 'boot' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12, animation: 'ar-bootFlicker .6s ease',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              border: '2px solid rgba(0,229,255,.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="1.5">
                <path d="M2 7l1-4h18l1 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="3"/><path d="M6 13h.01M18 13h.01" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, letterSpacing: 5, color: '#00e5ff', textTransform: 'uppercase' }}>
              Initializing AR
            </span>
          </div>
        )}

        {/* ════════  SCAN PHASE  ════════ */}
        {phase === 'scan' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 28,
          }}>
            {/* Product silhouette with scan line */}
            <div style={{ position: 'relative', width: 200, height: 200, overflow: 'hidden', borderRadius: 16 }}>
              <img src={pickle.image[0]?.name} alt="" style={{
                width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16,
                filter: 'brightness(0.3) contrast(1.2)',
              }} />
              {/* Scan line */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 3, top: `${scanY}%`,
                background: 'linear-gradient(90deg,transparent,#00e5ff,transparent)',
                boxShadow: '0 0 20px #00e5ff, 0 0 60px rgba(0,229,255,.3)',
                transition: 'top 0.05s linear',
              }} />
              {/* Corner brackets */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 200" fill="none">
                <path d="M4 40 V4 H40" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" style={{ animation: 'ar-cornerDash 1s ease forwards' }} strokeDasharray="200" />
                <path d="M160 4 H196 V40" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" style={{ animation: 'ar-cornerDash 1s ease .15s forwards' }} strokeDasharray="200" />
                <path d="M196 160 V196 H160" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" style={{ animation: 'ar-cornerDash 1s ease .3s forwards' }} strokeDasharray="200" />
                <path d="M40 196 H4 V160" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" style={{ animation: 'ar-cornerDash 1s ease .45s forwards' }} strokeDasharray="200" />
              </svg>
            </div>
            {/* progress */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: '#4a6a8a', textTransform: 'uppercase', marginBottom: 8 }}>
                Scanning product...
              </div>
              <div style={{ width: 200, height: 3, background: '#0d1f3c', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${scanY}%`, borderRadius: 2,
                  background: 'linear-gradient(90deg,#00e5ff,#f97316)',
                  transition: 'width 0.1s linear',
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ════════  REVEAL PHASE  ════════ */}
        {phase === 'reveal' && (
          <div style={{ minHeight: '100vh', padding: '16px 16px 32px', maxWidth: 1120, margin: '0 auto' }}>

            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 28, paddingBottom: 14,
              borderBottom: '1px solid rgba(0,229,255,.08)',
              animation: 'ar-fadeSlideUp .5s ease both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  border: '1px solid rgba(0,229,255,.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="1.5">
                    <path d="M2 7l1-4h18l1 4"/><path d="M2 7h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z"/><circle cx="12" cy="13" r="3"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: '#00e5ff', textTransform: 'uppercase', fontWeight: 700 }}>
                    Andhra Store
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: '#2a4a6a', textTransform: 'uppercase' }}>
                    AR Analytics · v2.0
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'ar-pulse 2s infinite' }} />
                  <span style={{ fontSize: 9, letterSpacing: 2, color: '#22c55e', textTransform: 'uppercase', fontWeight: 600 }}>Live</span>
                </div>
                <button onClick={onClose} style={{
                  background: 'rgba(0,229,255,.06)', border: '1px solid rgba(0,229,255,.15)',
                  borderRadius: 10, padding: 8, cursor: 'pointer', color: '#4a6a8a',
                  display: 'flex', transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,.4)'; e.currentTarget.style.color = '#00e5ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,.15)'; e.currentTarget.style.color = '#4a6a8a'; }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Three column grid ── */}
            <div className="ar-top-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', gap: 20, marginBottom: 20 }}>

              {/* ─ LEFT: Ingredients + Nutrition ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'ar-fadeSlideLeft .6s ease .2s both' }}>
                {/* Ingredients */}
                <div className="ar-panel" style={{ padding: 20 }}>
                  <div className="ar-scan-sweep" />
                  <div className="ar-label">Ingredients</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pickle.ingredients.map((ing, i) => {
                      const colors = ['#f97316','#ef4444','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899','#06b6d4'];
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          animation: 'ar-fadeSlideLeft .4s ease both',
                          animationDelay: `${0.4 + i * 0.08}s`,
                        }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: colors[i % colors.length],
                            boxShadow: `0 0 8px ${colors[i % colors.length]}50`,
                          }} />
                          <span style={{ fontSize: 12.5, color: '#8899aa', fontWeight: 500 }}>{ing.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nutrition */}
                <div className="ar-panel" style={{ padding: 20 }}>
                  <div className="ar-scan-sweep" />
                  <div className="ar-label">Nutrition /100g</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { k: 'Calories', v: nutrition.calories, s: ' kcal', c: '#f97316', max: 300 },
                      { k: 'Carbs',    v: nutrition.carbs,    s: 'g',     c: '#eab308', max: 30 },
                      { k: 'Protein',  v: nutrition.protein,  s: 'g',     c: '#22c55e', max: 30 },
                      { k: 'Fat',      v: nutrition.fat,      s: 'g',     c: '#ef4444', max: 20 },
                      { k: 'Fiber',    v: nutrition.fiber,    s: 'g',     c: '#3b82f6', max: 10 },
                    ].map((n, i) => (
                      <div key={i} style={{ animation: 'ar-fadeSlideUp .4s ease both', animationDelay: `${0.6 + i * 0.1}s` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#4a6a8a' }}>{n.k}</span>
                          <span style={{ fontSize: 12, color: n.c, fontWeight: 700 }}>
                            <AnimNum value={n.v} suffix={n.s} delay={600 + i * 100} />
                          </span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,.04)' }}>
                          <div className="ar-spice-bar" style={{
                            '--fill': `${Math.min((n.v / n.max) * 100, 100)}%`,
                            background: `linear-gradient(90deg,${n.c}80,${n.c})`,
                            animationDelay: `${0.8 + i * 0.1}s`,
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─ CENTER: Product ─ */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                animation: 'ar-scaleIn .7s ease .3s both',
              }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 300, aspectRatio: '1' }}>
                  {/* Corner brackets */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }} viewBox="0 0 300 300" fill="none">
                    <path d="M6 60 V6 H60" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M240 6 H294 V60" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M294 240 V294 H240" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M60 294 H6 V240" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <img src={pickle.image[0]?.name} alt={pickle.name} style={{
                    width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, padding: 16,
                  }} />
                  {/* Subtle ring */}
                  <div style={{
                    position: 'absolute', inset: -8, borderRadius: 24,
                    border: '1px solid rgba(0,229,255,.08)',
                    animation: 'ar-glow 5s ease infinite',
                    pointerEvents: 'none',
                  }} />
                </div>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <h2 style={{
                    fontSize: 20, letterSpacing: 6, textTransform: 'uppercase',
                    fontWeight: 800, marginBottom: 6,
                    background: 'linear-gradient(135deg,#e0e6ed,#00e5ff)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {pickle.type} Pickle
                  </h2>
                  <p style={{ fontSize: 10, letterSpacing: 4, color: '#2a4a6a', textTransform: 'uppercase', fontWeight: 500 }}>
                    Andhra Store · Authentic
                  </p>
                </div>

                {/* Spice Index below product */}
                <div className="ar-panel" style={{ marginTop: 24, padding: '16px 24px', width: '100%', maxWidth: 320 }}>
                  <div className="ar-label">Spice Index</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <div key={s} style={{
                        flex: 1, height: 8, borderRadius: 4,
                        background: s <= spice
                          ? s <= 2 ? '#22c55e' : s <= 3 ? '#eab308' : '#ef4444'
                          : 'rgba(255,255,255,.04)',
                        boxShadow: s <= spice ? `0 0 8px ${s <= 2 ? '#22c55e' : s <= 3 ? '#eab308' : '#ef4444'}40` : 'none',
                        transition: 'all .4s',
                        transitionDelay: `${s * 0.1}s`,
                      }} />
                    ))}
                    <span style={{ fontSize: 11, color: '#8899aa', marginLeft: 8, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {spice}/5 {spice >= 4 ? '🔥 HOT' : spice >= 3 ? '🌶️ MEDIUM' : '🌿 MILD'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ─ RIGHT: Freshness + Features ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'ar-fadeSlideRight .6s ease .2s both' }}>
                {/* Freshness */}
                <div className="ar-panel" style={{ padding: 20, textAlign: 'center' }}>
                  <div className="ar-scan-sweep" />
                  <div className="ar-label" style={{ justifyContent: 'center' }}>Freshness</div>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ margin: '0 auto 12px', display: 'block' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#freshGrad)" strokeWidth="5"
                      strokeLinecap="round"
                      style={{
                        '--circum': circumference, '--offset': dashOffset,
                        strokeDasharray: circumference,
                        strokeDashoffset: circumference,
                        animation: 'ar-ring 2s ease 1s forwards',
                        transform: 'rotate(-90deg)', transformOrigin: '50% 50%',
                      }}
                    />
                    <defs>
                      <linearGradient id="freshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
                      style={{ fontSize: 22, fontWeight: 800, fill: '#f97316', fontFamily: 'inherit' }}>
                      {freshness}%
                    </text>
                  </svg>
                  <div style={{ fontSize: 10, color: '#3a5a7a', lineHeight: 2 }}>
                    {[
                      ['Mfg date', 'Jan 2025', '#6a8aaa'],
                      ['Best before', 'Jan 2027', '#6a8aaa'],
                      ['Shelf life', '24 months', '#00e5ff'],
                    ].map(([k, v, c], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{k}</span><span style={{ color: c, fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="ar-panel" style={{ padding: 20 }}>
                  <div className="ar-scan-sweep" />
                  <div className="ar-label">Features</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {featuresList.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        animation: 'ar-fadeSlideRight .4s ease both',
                        animationDelay: `${0.5 + i * 0.1}s`,
                      }}>
                        <div className="ar-feat-dot" style={{ '--c': '#22c55e', '--d': `${i * 0.3}s` }} />
                        <span style={{ fontSize: 12, color: '#8899aa', fontWeight: 500 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom stat cards ── */}
            <div className="ar-bottom-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Net Wt', value: displayWeight, c1: '#3b82f6', c2: '#06b6d4', d: '.6s' },
                { label: 'Origin', value: 'Andhra Pradesh', c1: '#f97316', c2: '#eab308', d: '.7s' },
                { label: 'Serves', value: '~60', c1: '#22c55e', c2: '#10b981', d: '.8s' },
                { label: 'Rating', value: '4.8 ★', c1: '#eab308', c2: '#f97316', d: '.9s' },
              ].map((s, i) => (
                <div key={i} className="ar-stat" style={{ '--d': s.d }}>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: '#3a5a7a', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                    {s.label}
                  </div>
                  <div className="ar-stat-value" style={{ '--c1': s.c1, '--c2': s.c2 }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              textAlign: 'center', fontSize: 9, letterSpacing: 4,
              color: '#1a2a4a', textTransform: 'uppercase', paddingTop: 8,
              animation: 'ar-fadeSlideUp .5s ease 1s both',
            }}>
              Andhra Store AR · v2.0 · Product Verified ✓
            </div>
          </div>
        )}
      </div>
    </>
  );
}
