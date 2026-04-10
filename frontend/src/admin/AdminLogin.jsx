import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', auth: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '', auth: '' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = { email: '', password: '', auth: '' };
    let valid = true;

    if (!credentials.email.trim()) {
      newErrors.email = '⚠ Email required';
      valid = false;
    }
    if (!credentials.password) {
      newErrors.password = '⚠ Passkey required';
      valid = false;
    }
    if (!valid) return setErrors(newErrors);

    setLoading(true);
    try {
      const response = await login(credentials.email.trim(), credentials.password);
      if (response.user?.role !== 'admin') {
        setErrors({ ...newErrors, auth: '⚠ Access denied — admin account required' });
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      setErrors({ ...newErrors, auth: '⚠ Invalid credentials — access denied' });
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .al-root {
          font-family: 'DM Mono', monospace;
          background: #0a0a0f;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .al-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(99,211,180,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,211,180,0.035) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .al-root::after {
          content: '';
          position: fixed;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,211,180,0.07) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -55%);
          pointer-events: none;
        }

        .al-card {
          position: relative;
          width: 440px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 48px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 32px 80px rgba(0,0,0,0.6),
            0 8px 24px rgba(0,0,0,0.4);
          backdrop-filter: blur(16px);
          animation: al-slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes al-slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .al-card::before, .al-card::after {
          content: '';
          position: absolute;
          width: 12px; height: 12px;
          border-color: #63D3B4;
          border-style: solid;
        }
        .al-card::before {
          top: -1px; left: -1px;
          border-width: 2px 0 0 2px;
        }
        .al-card::after {
          bottom: -1px; right: -1px;
          border-width: 0 2px 2px 0;
        }

        .al-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #63D3B4;
          margin-bottom: 16px;
        }

        .al-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #63D3B4;
          animation: al-pulse 2s ease-in-out infinite;
        }

        @keyframes al-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        .al-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #f0ede8;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0 0 8px;
        }

        .al-subtitle {
          font-size: 12px;
          color: rgba(240,237,232,0.4);
          letter-spacing: 0.05em;
          margin: 0;
        }

        .al-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 24px 0 32px;
          border: none;
        }

        .al-field { margin-bottom: 20px; }

        .al-label {
          display: block;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.4);
          margin-bottom: 8px;
        }

        .al-input-wrap { position: relative; }

        .al-input-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(240,237,232,0.4);
          font-size: 14px;
          pointer-events: none;
          transition: color 0.2s;
          z-index: 1;
        }

        .al-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 13px 14px 13px 40px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: #f0ede8;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          letter-spacing: 0.03em;
          box-sizing: border-box;
        }

        .al-input:focus {
          border-color: rgba(99,211,180,0.5);
          background: rgba(99,211,180,0.06);
          box-shadow: 0 0 0 3px rgba(99,211,180,0.06);
        }

        .al-input::placeholder { color: rgba(240,237,232,0.18); }

        .al-input-wrap:focus-within .al-input-icon { color: #63D3B4; }

        .al-toggle {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(240,237,232,0.4);
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          padding: 0;
          transition: color 0.2s;
        }
        .al-toggle:hover { color: #63D3B4; }

        .al-error {
          font-size: 11px;
          color: #ff6b6b;
          margin-top: 6px;
          letter-spacing: 0.05em;
          min-height: 16px;
        }

        .al-auth-error {
          font-size: 11px;
          color: #ff6b6b;
          letter-spacing: 0.05em;
          text-align: center;
          margin-bottom: 16px;
          min-height: 16px;
        }

        .al-btn {
          width: 100%;
          background: #63D3B4;
          border: none;
          border-radius: 2px;
          padding: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0f;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s, opacity 0.2s;
        }

        .al-btn:hover { background: #7ee8c9; box-shadow: 0 0 24px rgba(99,211,180,0.3); }
        .al-btn:active { transform: scale(0.99); }
        .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .al-footer {
          text-align: center;
          font-size: 10px;
          color: rgba(240,237,232,0.2);
          letter-spacing: 0.1em;
          margin-top: 28px;
          text-transform: uppercase;
        }

        .al-success {
          position: absolute; inset: 0;
          background: rgba(10,10,15,0.97);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .al-success-icon {
          font-size: 32px;
          color: #63D3B4;
          animation: al-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes al-pop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .al-success-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #63D3B4;
        }

        .al-success-sub {
          font-size: 11px;
          color: rgba(240,237,232,0.4);
          letter-spacing: 0.08em;
        }
      `}</style>

      <div className="al-root" onKeyDown={handleKeyDown}>
        <div className="al-card">
          {/* Header */}
          <div>
            <div className="al-badge">
              <span className="al-badge-dot" />
              Secure Access
            </div>
            <h1 className="al-title">Admin</h1>
            <p className="al-subtitle">Authorized personnel only</p>
          </div>

          <hr className="al-divider" />

          {/* Email */}
          <div className="al-field">
            <label className="al-label" htmlFor="email">Email</label>
            <div className="al-input-wrap">
              <input
                className="al-input"
                type="email"
                id="email"
                name="email"
                placeholder="admin@luxuryhotel.com"
                autoComplete="email"
                value={credentials.email}
                onChange={handleChange}
              />
              <span className="al-input-icon">◈</span>
            </div>
            <div className="al-error">{errors.email}</div>
          </div>

          {/* Password */}
          <div className="al-field">
            <label className="al-label" htmlFor="password">Passkey</label>
            <div className="al-input-wrap">
              <input
                className="al-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
              />
              <span className="al-input-icon">◉</span>
              <button
                className="al-toggle"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'hide' : 'show'}
              </button>
            </div>
            <div className="al-error">{errors.password}</div>
          </div>

          {/* Auth error */}
          <div className="al-auth-error">{errors.auth}</div>

          {/* Submit */}
          <button
            className="al-btn"
            type="button"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Verifying...' : 'Authenticate →'}
          </button>

          <p className="al-footer">Protected admin portal · v2.4.1</p>

          {/* Success overlay */}
          {success && (
            <div className="al-success">
              <div className="al-success-icon">✦</div>
              <div className="al-success-title">Access Granted</div>
              <div className="al-success-sub">Redirecting to dashboard...</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLogin;