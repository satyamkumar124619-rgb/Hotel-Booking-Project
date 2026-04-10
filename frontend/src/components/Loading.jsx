import React from 'react';

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=DM+Sans:wght@300&display=swap');
  @keyframes rotateDash {
    0%   { stroke-dashoffset: 220; transform: rotate(-90deg); }
    50%  { stroke-dashoffset: 60; }
    100% { stroke-dashoffset: 220; transform: rotate(270deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .ring-spin {
    transform-origin: center;
    animation: rotateDash 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .dot-pulse {
    animation: pulse 1.8s ease-in-out infinite;
  }
  .dot-pulse:nth-child(2) { animation-delay: 0.3s; }
  .dot-pulse:nth-child(3) { animation-delay: 0.6s; }
`;

const Loading = () => {
  return (
    <>
      <style>{fonts}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0E0F0D',
        gap: 32,
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          {/* Track */}
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(198,162,100,0.1)" strokeWidth="1" />
          </svg>
          {/* Spinning arc */}
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0 }}>
            <circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke="#C6A264"
              strokeWidth="1"
              strokeDasharray="220"
              strokeLinecap="round"
              className="ring-spin"
            />
          </svg>
          {/* Center dot */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C6A264', opacity: 0.6 }} />
          </div>
        </div>

        {/* Brand wordmark */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(240,237,230,0.5)',
            letterSpacing: '0.1em',
            marginBottom: 10,
          }}>
            Luxury Hotel
          </p>
          {/* Dot pulse */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="dot-pulse"
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: '#C6A264',
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;