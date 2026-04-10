import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(198,162,100,0.55)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.08)',
  goldBorder: 'rgba(198,162,100,0.15)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
  error: 'rgba(180,80,80,0.10)',
  errorBorder: 'rgba(180,80,80,0.3)',
  errorText: '#C07070',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
`;

const FieldInput = ({ label, type = 'text', name, value, onChange, required, placeholder, icon }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      <label style={{
        display: 'block', fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, fontWeight: 500, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: focused ? T.gold : T.textMuted,
        marginBottom: 8, transition: 'color 0.2s ease',
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: focused ? T.gold : T.textMuted, fontSize: 14, transition: 'color 0.2s ease',
          }}>{icon}</span>
        )}
        <input
          type={isPassword ? (showPass ? 'text' : 'password') : type}
          name={name} value={value} onChange={onChange}
          required={required} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: focused ? '#1A1B18' : T.surface,
            border: `1px solid ${focused ? T.borderFocus : T.border}`,
            padding: `13px ${isPassword ? '44px' : '16px'} 13px ${icon ? '40px' : '16px'}`,
            color: T.text, fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 300, outline: 'none',
            transition: 'all 0.25s ease', display: 'block',
            boxShadow: focused ? '0 0 0 3px rgba(198,162,100,0.06)' : 'none',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.textMuted, fontSize: 14, padding: 0,
          }}>
            {showPass ? '◎' : '○'}
          </button>
        )}
      </div>
    </div>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: '◈', title: 'Manage Reservations', desc: 'View and modify your bookings anytime' },
    { icon: '◇', title: 'Exclusive Rates', desc: 'Members-only pricing on all room types' },
    { icon: '◎', title: 'Personal Concierge', desc: 'Dedicated service for every stay' },
    { icon: '◆', title: 'Priority Check-in', desc: 'Skip the queue with instant access' },
  ];

  const { user, login } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentFeature(p => (p + 1) % features.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user && !successData) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/booking');
    }
  }, [user, navigate, successData]);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      setSuccessData(response.user);
      setTimeout(() => {
        if (response.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/booking');
        }
      }, 2500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <>
        <style>{fonts}</style>
        <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ textAlign: 'center', padding: '60px 48px', maxWidth: 480, animation: 'fadeUp 0.6s ease' }}>
            <div style={{ width: 72, height: 72, border: `1px solid ${T.gold}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', background: T.goldMuted }}>
              <span style={{ color: T.gold, fontSize: 28 }}>✓</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Authentication Successful</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', marginBottom: 12 }}>
              Welcome <span style={{ fontStyle: 'italic' }}>Back</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, marginBottom: 32 }}>
              You are securely logged in as <span style={{ color: T.gold, fontWeight: 500 }}>{successData.name}</span>.<br/>
              Redirecting you to the {successData.role === 'admin' ? 'dashboard' : 'booking setup'}…
            </p>
            <div style={{ height: 1, background: T.border, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: T.gold, width: '100%', animation: 'progress 2.5s linear forwards' }} />
            </div>
            <style>{`@keyframes progress{from{width:0}to{width:100%}}`}</style>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>

        {/* ── Left Panel ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: T.surfaceAlt, borderRight: `1px solid ${T.border}`,
          position: 'relative', overflow: 'hidden',
        }}
          className="left-panel"
        >
          {/* Ambient glow */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 30% 40%, rgba(198,162,100,0.08) 0%, transparent 65%), radial-gradient(ellipse at 80% 80%, rgba(198,162,100,0.04) 0%, transparent 50%)`, pointerEvents: 'none' }} />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(198,162,100,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,162,100,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '60px 56px' }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
              <div style={{ width: 32, height: 32, border: `1px solid ${T.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: T.gold, fontSize: 14 }}>◆</span>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold }}>Luxury Hotel</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted, fontWeight: 300 }}>Est. 1995</p>
              </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 24, height: 1, background: T.gold, opacity: 0.5 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold }}>Member Portal</span>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
                  Welcome <span style={{ fontStyle: 'italic', color: T.gold }}>Back</span>
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, maxWidth: 320 }}>
                  Sign in to access your reservations, exclusive benefits, and personalised service.
                </p>
              </div>

              {/* Animated feature */}
              <div style={{ marginBottom: 40 }}>
                {features.map((f, i) => (
                  <div key={f.title} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', marginBottom: 8,
                    background: i === currentFeature ? T.goldMuted : 'transparent',
                    border: `1px solid ${i === currentFeature ? T.goldBorder : 'transparent'}`,
                    transition: 'all 0.4s ease',
                  }}>
                    <span style={{ color: i === currentFeature ? T.gold : T.textMuted, fontSize: 16, transition: 'color 0.3s ease', minWidth: 20 }}>{f.icon}</span>
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: i === currentFeature ? 500 : 300, color: i === currentFeature ? T.text : T.textMuted, letterSpacing: '0.02em', transition: 'all 0.3s ease' }}>{f.title}</p>
                      {i === currentFeature && (
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, color: T.textSecondary, marginTop: 2, animation: 'fadeIn 0.4s ease' }}>{f.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {features.map((_, i) => (
                  <div key={i} onClick={() => setCurrentFeature(i)} style={{
                    width: i === currentFeature ? 24 : 6, height: 6,
                    background: i === currentFeature ? T.gold : T.border,
                    cursor: 'pointer', transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', fontWeight: 300, color: T.textMuted }}>
              "A legacy of excellence since 1995"
            </p>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div style={{
          width: '100%', maxWidth: 540,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 56px', animation: 'slideLeft 0.6s ease',
          overflowY: 'auto',
        }}>
          {/* Back */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 52 }}>
            <span style={{ color: T.textMuted, fontSize: 14 }}>←</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.textMuted, transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.target.style.color = T.gold}
              onMouseLeave={e => e.target.style.color = T.textMuted}
            >Back to home</span>
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Member Access</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.02, marginBottom: 10 }}>
              Sign <span style={{ fontStyle: 'italic' }}>In</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.7 }}>
              Access your account to view and manage your reservations.
            </p>
            <div style={{ width: 32, height: 1, background: T.gold, opacity: 0.4, marginTop: 16 }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '14px 16px', background: T.error,
              border: `1px solid ${T.errorBorder}`, marginBottom: 24,
              display: 'flex', gap: 12, alignItems: 'flex-start',
              animation: 'fadeUp 0.3s ease',
            }}>
              <span style={{ color: T.errorText, fontSize: 16, lineHeight: 1 }}>⚠</span>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.errorText, fontWeight: 400, marginBottom: 2 }}>Authentication Failed</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.errorText, fontWeight: 300 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FieldInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required icon="◉" />
            <FieldInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required icon="◈" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, color: T.textMuted, cursor: 'pointer', letterSpacing: '0.04em' }}
                onMouseEnter={e => e.target.style.color = T.gold}
                onMouseLeave={e => e.target.style.color = T.textMuted}
              >Forgot password?</span>
            </div>

            <button
              type="submit" disabled={loading}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                marginTop: 8, padding: '15px 24px',
                background: loading ? 'rgba(198,162,100,0.4)' : (btnHovered ? T.goldLight : T.gold),
                border: `1px solid ${loading ? 'transparent' : T.gold}`,
                color: '#0E0F0D', fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#0E0F0D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Authenticating…
                </>
              ) : (
                <>Sign In <span style={{ opacity: 0.7, fontSize: 16 }}>→</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          {/* Register */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, textAlign: 'center', lineHeight: 1.7 }}>
            New to Luxury Hotel?{' '}
            <Link to="/register" style={{ color: T.gold, textDecoration: 'none', fontWeight: 500 }}>Create an account →</Link>
          </p>

          {/* Admin link */}
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/admin" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, color: T.textMuted, textDecoration: 'none', letterSpacing: '0.06em' }}
              onMouseEnter={e => e.target.style.color = T.textSecondary}
              onMouseLeave={e => e.target.style.color = T.textMuted}
            >Staff / Admin access →</Link>
          </p>

          {/* Demo box */}
          <div style={{ marginTop: 36, padding: '18px 20px', background: T.goldMuted, border: `1px solid ${T.goldBorder}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T.gold}, transparent)` }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, marginBottom: 10 }}>Demo Credentials</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, color: T.gold, marginBottom: 4, letterSpacing: '0.08em' }}>ADMIN</p>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: T.textSecondary, lineHeight: 1.8 }}>admin@luxuryhotel.com<br />admin123</p>
              </div>
              <div style={{ width: 1, background: T.border }} />
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, color: T.textMuted, marginBottom: 4, letterSpacing: '0.08em' }}>USER</p>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: T.textSecondary, lineHeight: 1.8 }}>john@example.com<br />john1234</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 768px) { .left-panel { display: none !important; } }
        `}</style>
      </div>
    </>
  );
};

export default SignIn;