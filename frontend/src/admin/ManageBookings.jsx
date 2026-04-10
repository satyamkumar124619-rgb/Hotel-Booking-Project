import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../api/bookingService';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
  danger: '#C07070',
  success: '#70C070',
  info: '#7090C0'
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
  
  .booking-row { transition: background 0.3s ease; }
  .booking-row:hover { background: rgba(255,255,255,0.02); }
  
  .action-btn { transition: all 0.2s ease; cursor: pointer; border-radius: 4px; padding: 6px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
  .action-confirm { background: rgba(112,192,112,0.1); border: 1px solid rgba(112,192,112,0.2); color: #70C070; }
  .action-confirm:hover { background: rgba(112,192,112,0.2); }
  .action-cancel { background: rgba(192,112,112,0.1); border: 1px solid rgba(192,112,112,0.2); color: #C07070; }
  .action-cancel:hover { background: rgba(192,112,112,0.2); }
  .action-checkin { background: rgba(112,144,192,0.1); border: 1px solid rgba(112,144,192,0.2); color: #7090C0; }
  .action-checkin:hover { background: rgba(112,144,192,0.2); }
`;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data.bookings || []);
      setError('');
    } catch (err) { setError('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if(newStatus === 'cancelled' && !window.confirm('Cancel this booking?')) return;
    try {
      await updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) { setError('Failed to update status'); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusStyle = (status) => {
    const s = {
      pending:    { bg: T.goldMuted, color: T.gold, border: `1px solid rgba(198,162,100,0.2)` },
      confirmed:  { bg: 'rgba(112,192,112,0.08)', color: T.success, border: '1px solid rgba(112,192,112,0.2)' },
      cancelled:  { bg: 'rgba(192,112,112,0.08)', color: T.danger, border: '1px solid rgba(192,112,112,0.2)' },
      'checked-in': { bg: 'rgba(112,144,192,0.08)', color: T.info, border: '1px solid rgba(112,144,192,0.2)' },
    };
    return s[status] || { bg: T.surfaceAlt, color: T.textMuted, border: `1px solid ${T.border}` };
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50, animation: 'fadeUp 0.6s ease' }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: 12, display: 'block' }}>Administration</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: T.text, margin: 0 }}>
              Manage <span style={{ fontStyle: 'italic', color: T.gold }}>Reservations</span>
            </h1>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4, margin: '20px auto 0' }} />
          </div>

          {error && (
            <div style={{ padding: 16, background: 'rgba(180,80,80,0.1)', border: '1px solid rgba(180,80,80,0.2)', color: T.danger, borderRadius: 4, marginBottom: 30, fontSize: 13, textAlign: 'center' }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}>Synchronizing reservations...</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6 }}>
              <span style={{ fontSize: 32, color: T.gold, opacity: 0.5, display: 'block', marginBottom: 16 }}>◈</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', color: T.text, marginBottom: 8 }}>No active reservations</h3>
              <p style={{ color: T.textMuted, fontSize: 13 }}>Guest bookings will appear here once processed.</p>
            </div>
          ) : (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, overflowX: 'auto', animation: 'fadeUp 0.7s ease' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: T.surfaceAlt, borderBottom: `1px solid ${T.border}` }}>
                    {['Guest', 'Accommodation', 'Dates', 'Total', 'Status', 'Actions'].map((h,i) => (
                      <th key={i} style={{ padding: '16px 24px', fontSize: 10, fontWeight: 500, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="booking-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontSize: 13, color: T.text, fontWeight: 500, marginBottom: 2 }}>{b.user?.name || 'Unknown'}</p>
                        <p style={{ fontSize: 11, color: T.textSecondary }}>{b.user?.email || '—'}</p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontSize: 13, color: T.text, marginBottom: 2 }}>{b.room?.name || 'Unknown'}</p>
                        <p style={{ fontSize: 11, color: T.gold }}>{b.room?.roomType || '—'}</p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontSize: 12, color: T.textSecondary }}>{formatDate(b.checkIn)} <span style={{color: T.gold}}>→</span> {formatDate(b.checkOut)}</p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>₹{b.totalPrice?.toLocaleString() || '—'}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ ...getStatusStyle(b.status), padding: '4px 10px', borderRadius: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(b._id, 'confirmed')} className="action-btn action-confirm">Confirm</button>
                              <button onClick={() => handleUpdateStatus(b._id, 'cancelled')} className="action-btn action-cancel">Cancel</button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => handleUpdateStatus(b._id, 'checked-in')} className="action-btn action-checkin">Check In</button>
                          )}
                          {(b.status === 'cancelled' || b.status === 'checked-in') && (
                            <span style={{ fontSize: 11, color: T.textMuted, fontStyle: 'italic' }}>—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '16px 24px', background: T.surfaceAlt }}>
                 <p style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.05em' }}>Total Reservations: <span style={{color: T.gold, fontWeight: 600}}>{bookings.length}</span></p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ManageBookings;