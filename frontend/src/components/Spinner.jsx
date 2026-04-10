import React from 'react';

/**
 * Spinner — minimal gold arc spinner matching the dark luxury design system.
 *
 * Props:
 *   style   — passed directly to the outer <div> (use for width/height override, e.g. { width: 16, height: 16 })
 *   color   — stroke color, defaults to '#C6A264' (gold)
 *   track   — track ring color, defaults to 'rgba(198,162,100,0.15)'
 */
const Spinner = ({ style, color = '#C6A264', track = 'rgba(198,162,100,0.15)' }) => {
  const size = (style?.width || style?.height) ? undefined : 24;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', animation: 'spinnerRotate 1.4s linear infinite' }}
      >
        <style>{`
          @keyframes spinnerRotate {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes spinnerDash {
            0%   { stroke-dashoffset: 56; }
            50%  { stroke-dashoffset: 14; }
            100% { stroke-dashoffset: 56; }
          }
        `}</style>
        {/* Track */}
        <circle cx="12" cy="12" r="9" stroke={track} strokeWidth="1.5" />
        {/* Arc */}
        <circle
          cx="12" cy="12" r="9"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="56"
          strokeDashoffset="42"
          style={{ animation: 'spinnerDash 1.4s ease-in-out infinite', transformOrigin: 'center' }}
        />
      </svg>
    </div>
  );
};

export default Spinner;