// Booking.jsx
import React from 'react';
import BookingForm from '../components/BookingForm';

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; }
`;

const T = {
  bg: '#0A0A08',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C6A264',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.58)',
};

export const Booking = () => {
  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '72px 24px 96px' }}>

        {/* Page header */}
        <div style={{ maxWidth: 680, margin: '0 auto 56px', textAlign: 'center' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, display: 'block', marginBottom: 16 }}>
            Reservations
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 14 }}>
            Book Your <span style={{ fontStyle: 'italic' }}>Stay</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: T.textSecondary, lineHeight: 1.75, maxWidth: 440, margin: '0 auto 20px' }}>
            Reserve your perfect accommodation and unlock exclusive offers.
            Choose your dates, select a room, and we'll take care of the rest.
          </p>
          <div style={{ width: 32, height: 1, background: T.gold, opacity: 0.35, margin: '0 auto' }} />
        </div>

        {/* Form */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BookingForm />
        </div>
      </div>
    </>
  );
};

export default Booking;