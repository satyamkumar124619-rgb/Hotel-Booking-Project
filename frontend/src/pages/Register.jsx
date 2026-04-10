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
  success: 'rgba(80,160,80,0.10)',
  successBorder: 'rgba(80,160,80,0.3)',
  successText: '#70C070',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes checkmark{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}
`;

const FieldInput = ({ label, type = 'text', name, value, onChange, required, placeholder, icon, hint }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const hasValue = value && value.length > 0;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: focused ? T.gold : T.textMuted, transition: 'color 0.2s ease',
        }}>{label}{required && <span style={{ color: T.gold, marginLeft: 3 }}>*</span>}</label>
        {hint && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.textMuted, fontWeight: 300 }}>{hint}</span>}
      </div>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: focused ? T.gold : T.textMuted, fontSize: 13, transition: 'color 0.2s ease', pointerEvents: 'none',
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
            border: `1px solid ${focused ? T.borderFocus : hasValue ? 'rgba(198,162,100,0.2)' : T.border}`,
            padding: `13px ${isPassword ? '44px' : '16px'} 13px ${icon ? '40px' : '16px'}`,
            color: T.text, fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 300, outline: 'none',
            transition: 'all 0.25s ease',
            boxShadow: focused ? '0 0 0 3px rgba(198,162,100,0.05)' : 'none',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.textMuted, fontSize: 14, padding: 4,
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => e.target.style.color = T.gold}
            onMouseLeave={e => e.target.style.color = T.textMuted}
          >
            {showPass ? '◎' : '○'}
          </button>
        )}
        {/* Filled indicator */}
        {hasValue && !focused && (
          <span style={{ position: 'absolute', right: isPassword ? 44 : 14, top: '50%', transform: 'translateY(-50%)', color: T.gold, fontSize: 10 }}>✓</span>
        )}
      </div>
    </div>
  );
};

/* Password Strength Indicator */
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#C07070', '#C6A264', '#8BA888', '#70C070'];

  return (
    <div style={{ marginTop: -12 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 2, background: i <= strength ? colors[strength] : T.border, transition: 'all 0.3s ease' }} />
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: colors[strength], fontWeight: 300, letterSpacing: '0.06em' }}>
        {labels[strength]} {strength > 0 && `(${strength}/4)`}
      </p>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const { user: authUser, register } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (authUser) navigate('/booking');
  }, []);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Full name is required.';
    if (!formData.email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      // Show success then redirect
      setSuccess(true);
      setStep(2);
      setTimeout(() => navigate('/booking'), 2500);

    } catch (err) {
      setError(err.message || 'Cannot connect to server. Please check your connection.');
      setLoading(false);
    }
  };

  const requiredFields = ['name', 'email', 'password'];
  const filledCount = requiredFields.filter(k => formData[k].trim()).length;
  const progressPct = (filledCount / 3) * 100;

  /* ── Success Screen ── */
  if (step === 2) {
    return (
      <>
        <style>{fonts}</style>
        <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ textAlign: 'center', padding: '60px 48px', maxWidth: 480, animation: 'fadeUp 0.6s ease' }}>
            {/* Success icon */}
            <div style={{ width: 72, height: 72, border: `1px solid ${T.gold}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', background: T.goldMuted }}>
              <span style={{ color: T.gold, fontSize: 28 }}>✓</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Welcome to Luxury Hotel</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', marginBottom: 12 }}>
              Account <span style={{ fontStyle: 'italic' }}>Created</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, marginBottom: 32 }}>
              Welcome, <span style={{ color: T.gold }}>{authUser?.name}</span>. Your account has been saved. Redirecting you to the homepage…
            </p>
            {/* Progress bar */}
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.surfaceAlt, borderRight: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }} className="left-panel">
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(198,162,100,0.08) 0%, transparent 60%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(198,162,100,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,162,100,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

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

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 24, height: 1, background: T.gold, opacity: 0.5 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold }}>New Member</span>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
                  Join Our <span style={{ fontStyle: 'italic', color: T.gold }}>Legacy</span>
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, maxWidth: 300 }}>
                  Become a member and unlock a world of exclusive benefits, personalised service, and unforgettable experiences.
                </p>
              </div>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '◈', text: 'Instant booking confirmation' },
                  { icon: '◇', text: 'Member-exclusive room rates' },
                  { icon: '◎', text: 'Dedicated concierge service' },
                  { icon: '◆', text: 'Loyalty points on every stay' },
                ].map((b) => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: T.goldMuted, border: `1px solid ${T.goldBorder}` }}>
                    <span style={{ color: T.gold, fontSize: 13 }}>{b.icon}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: T.textSecondary, letterSpacing: '0.03em' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', fontWeight: 300, color: T.textMuted }}>
              "Where every guest is family"
            </p>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div style={{
          width: '100%', maxWidth: 560,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '48px 56px', animation: 'slideLeft 0.6s ease',
          overflowY: 'auto',
        }}>
          {/* Back */}
          <Link to="/signin" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <span style={{ color: T.textMuted, fontSize: 14 }}>←</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.textMuted }}
              onMouseEnter={e => e.target.style.color = T.gold}
              onMouseLeave={e => e.target.style.color = T.textMuted}
            >Back to sign in</span>
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Create Account</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.02, marginBottom: 10 }}>
              Join <span style={{ fontStyle: 'italic' }}>Us</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.7 }}>
              Create your account to book rooms and manage your reservations.
            </p>
            <div style={{ width: 32, height: 1, background: T.gold, opacity: 0.4, marginTop: 16 }} />
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.textMuted, fontWeight: 300, letterSpacing: '0.08em' }}>Profile completion</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.gold, fontWeight: 500 }}>{Math.round(progressPct)}%</span>
            </div>
            <div style={{ height: 2, background: T.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: T.gold, width: `${progressPct}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '14px 16px', background: T.error, border: `1px solid ${T.errorBorder}`, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
              <span style={{ color: T.errorText, fontSize: 16, lineHeight: 1 }}>⚠</span>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.errorText, fontWeight: 400, marginBottom: 2 }}>Please fix the following</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.errorText, fontWeight: 300 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <FieldInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required icon="◎" />
            <FieldInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required icon="◉" />
            <FieldInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" icon="◇" hint="Optional" />
            <FieldInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required icon="◈" />
            <PasswordStrength password={formData.password} />
            <FieldInput label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required icon="◈" />

            {/* Terms */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, color: T.textMuted, lineHeight: 1.7 }}>
              By creating an account, you agree to our{' '}
              <span style={{ color: T.gold, cursor: 'pointer' }}>Terms of Service</span> and{' '}
              <span style={{ color: T.gold, cursor: 'pointer' }}>Privacy Policy</span>.
            </p>

            <button
              type="submit" disabled={loading}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                marginTop: 4, padding: '15px 24px',
                background: loading ? 'rgba(198,162,100,0.4)' : (btnHovered ? T.goldLight : T.gold),
                border: `1px solid ${loading ? 'transparent' : T.gold}`,
                color: '#0E0F0D', fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#0E0F0D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Creating account…
                </>
              ) : (
                <>Create Account <span style={{ opacity: 0.7, fontSize: 16 }}>→</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: T.gold, textDecoration: 'none', fontWeight: 500 }}>Sign in →</Link>
          </p>
        </div>

        <style>{`@media(max-width:768px){.left-panel{display:none!important}}`}</style>
      </div>
    </>
  );
};

export default Register;
