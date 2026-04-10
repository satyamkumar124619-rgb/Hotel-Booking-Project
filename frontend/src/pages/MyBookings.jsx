import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../api/bookingService';
import { useAuth } from '../context/AuthContext';

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
`;

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C6A264',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.58)',
  error: '#C07070',
  errorBg: 'rgba(192,113,90,0.1)',
  success: '#70C070',
  successBg: 'rgba(112,192,112,0.1)',
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const getStatusBadge = (status) => {
  let color = T.textMuted;
  let bg = T.surface;
  switch (status.toLowerCase()) {
    case 'confirmed':
      color = T.success;
      bg = T.successBg;
      break;
    case 'pending':
      color = T.gold;
      bg = 'rgba(198,162,100,0.1)';
      break;
    case 'cancelled':
      color = T.error;
      bg = T.errorBg;
      break;
    case 'checked-in':
      color = '#70A0C0';
      bg = 'rgba(112,160,192,0.1)';
      break;
  }
  return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color, background: bg, border: `1px solid ${color}` }}>{status}</span>;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    
    setCancellingId(id);
    setError('');
    
    try {
      await cancelBooking(id);
      // Immediately reflect locally
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel the booking. Please contact support.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '72px 24px 96px', fontFamily: "'DM Sans', sans-serif" }}>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, display: 'block', marginBottom: 16 }}>
            Your Profile
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 14 }}>
            My <span style={{ fontStyle: 'italic' }}>Bookings</span>
          </h1>
          <div style={{ width: 32, height: 1, background: T.gold, opacity: 0.35, margin: '20px auto 0' }} />
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {error && (
            <div style={{ background: T.errorBg, border: `1px solid ${T.error}`, color: T.error, padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '13px' }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: T.textMuted }}>Loading your reservations...</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '4px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
              <p style={{ color: T.textSecondary, marginBottom: '24px' }}>You don't have any bookings yet.</p>
              <a href="/rooms" style={{ color: T.gold, textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore Rooms →</a>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {bookings.map((booking) => (
                <div key={booking._id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    
                    <div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: T.text, marginBottom: '4px' }}>
                        {booking.room?.name || 'Standard Room'}
                      </h2>
                      <p style={{ fontSize: '13px', color: T.textMuted }}>
                        Booking ID: <span style={{ fontFamily: 'monospace' }}>{booking._id.slice(-8).toUpperCase()}</span> • Created {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                  </div>

                  <div style={{ height: 1, background: T.border }} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                    <div>
                      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textMuted, marginBottom: '6px' }}>Check In</p>
                      <p style={{ color: T.text, fontSize: '14px' }}>{formatDate(booking.checkIn)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textMuted, marginBottom: '6px' }}>Check Out</p>
                      <p style={{ color: T.text, fontSize: '14px' }}>{formatDate(booking.checkOut)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textMuted, marginBottom: '6px' }}>Guests</p>
                      <p style={{ color: T.text, fontSize: '14px' }}>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textMuted, marginBottom: '6px' }}>Total Price</p>
                      <p style={{ color: T.gold, fontSize: '15px', fontWeight: 600 }}>₹{booking.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>

                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button 
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        style={{
                          background: 'transparent',
                          border: `1px solid ${T.error}`,
                          color: T.error,
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          cursor: cancellingId === booking._id ? 'not-allowed' : 'pointer',
                          opacity: cancellingId === booking._id ? 0.6 : 1,
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => !cancellingId && (e.currentTarget.style.background = T.errorBg)}
                        onMouseLeave={(e) => !cancellingId && (e.currentTarget.style.background = 'transparent')}
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;
