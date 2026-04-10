import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/config';
import { getAllRooms } from '../api/roomService';
import { getAllBookings } from '../api/bookingService';

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
  danger: '#8A3B3B',
  success: '#70C070',
  pending: '#C6A264',
  info: '#7090C0'
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
  .dash-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; }
  .dash-card:hover { transform: translateY(-6px); border-color: ${T.gold}; box-shadow: 0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,162,100,0.1) inset; background: linear-gradient(145deg, ${T.surface} 0%, rgba(198,162,100,0.02) 100%); }
  .action-card { transition: all 0.3s ease; text-decoration: none; display: block; border: 1px solid ${T.border}; border-radius: 6px; padding: 32px 24px; text-align: center; }
  .action-card:hover { border-color: ${T.gold}; background: linear-gradient(145deg, ${T.surface} 0%, rgba(198,162,100,0.06) 100%); transform: translateY(-4px); }
  .booking-item { transition: background 0.3s ease; }
  .booking-item:hover { background: rgba(255,255,255,0.03) !important; }
`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData, usersRes] = await Promise.all([
        getAllRooms(),
        getAllBookings(),
        API.get('/auth/users').catch(() => ({ data: { users: [] } }))
      ]);

      const rooms = roomsData.rooms || [];
      const bookings = bookingsData.bookings || [];
      const users = usersRes.data?.users || [];

      // Calculate aggregated metrics
      const totalBookings = bookings.length;
      const totalRooms = rooms.length;
      const totalCustomers = users.length;
      
      const totalRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      // Sort recent 5 bookings
      const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setStats({ totalBookings, totalRooms, totalCustomers, totalRevenue });
      setRecentBookings(sortedBookings.slice(0, 5));
      setError('');
    } catch (err) {
      setError('Failed to communicate with hotel database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statCards = stats ? [
    { name: 'Active Bookings', value: stats.totalBookings.toLocaleString(), icon: '◈' },
    { name: 'Hotel Suites', value: stats.totalRooms.toLocaleString(), icon: '◇' },
    { name: 'Registered Guests', value: stats.totalCustomers.toLocaleString(), icon: '◍' },
    { name: 'Gross Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '◆' },
  ] : [];

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
      <div style={{ backgroundColor: T.bg, minHeight: '100vh', padding: '60px 20px', fontFamily: "'DM Sans', sans-serif", color: T.text }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeUp 0.6s ease' }}>

          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, display: 'block', marginBottom: 12 }}>
              Executive Overview
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: T.text, margin: 0, fontWeight: 300 }}>
              Command <span style={{ fontStyle: 'italic', color: T.gold }}>Center</span>
            </h1>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4, margin: '20px auto 0' }} />
          </div>

          {error && (
            <div style={{ background: 'rgba(180,80,80,0.1)', border: `1px solid ${T.danger}`, color: T.danger, padding: 16, borderRadius: 6, marginBottom: 30, textAlign: 'center', fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
             <div style={{ textAlign: 'center', padding: 100, color: T.textMuted }}>Establishing connection to records...</div>
          ) : (
            <>
              {/* Stats Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 50 }}>
                {statCards.map((s, i) => (
                  <div key={i} className="dash-card" style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '36px 30px', borderRadius: 6 }}>
                    <div style={{ fontSize: 24, color: T.gold, opacity: 0.6, marginBottom: 24 }}>{s.icon}</div>
                    <p style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>{s.name}</p>
                    <p style={{ fontSize: 38, color: T.text, fontWeight: 300, fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Management Grid */}
              <div style={{ marginBottom: 60 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 24, height: 1, background: T.gold, opacity: 0.4 }} />
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: T.text, margin: 0, fontWeight: 300 }}>Management Suite</h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                  <Link to="/admin/rooms" className="action-card" style={{ background: T.surfaceAlt }}>
                    <div style={{ fontSize: 32, marginBottom: 16, color: T.textSecondary }}>🏨</div>
                    <h3 style={{ fontSize: 16, fontWeight: 400, color: T.text, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>Accommodations</h3>
                    <p style={{ fontSize: 13, color: T.textMuted }}>Edit room listings and pricing</p>
                  </Link>
                  <Link to="/admin/bookings" className="action-card" style={{ background: T.surfaceAlt }}>
                    <div style={{ fontSize: 32, marginBottom: 16, color: T.textSecondary }}>📋</div>
                    <h3 style={{ fontSize: 16, fontWeight: 400, color: T.text, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>Reservations</h3>
                    <p style={{ fontSize: 13, color: T.textMuted }}>Track guest check-ins and orders</p>
                  </Link>
                  <Link to="/admin/customers" className="action-card" style={{ background: T.surfaceAlt }}>
                    <div style={{ fontSize: 32, marginBottom: 16, color: T.textSecondary }}>👥</div>
                    <h3 style={{ fontSize: 16, fontWeight: 400, color: T.text, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>Guest Profiles</h3>
                    <p style={{ fontSize: 13, color: T.textMuted }}>Audit user accounts and history</p>
                  </Link>
                </div>
              </div>

              {/* Latest Activity */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: '40px 48px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontStyle: 'italic', color: T.text, marginBottom: 30 }}>Recent Reservations</h3>
                
                {recentBookings.length === 0 ? (
                  <p style={{ color: T.textMuted, fontSize: 13 }}>No recent activity on your perimeter.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {recentBookings.map((b) => (
                      <div key={b._id} className="booking-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 4, flexWrap: 'wrap', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <p style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{b.user?.name || 'Guest'} <span style={{ color: T.textMuted, fontWeight: 300 }}>• #{String(b._id).slice(-6)}</span></p>
                          <p style={{ color: T.textSecondary, fontSize: 11 }}>
                            {formatDate(b.checkIn)} <span style={{ opacity: 0.5 }}>→</span> {formatDate(b.checkOut)} <span style={{ padding: '0 6px', color: T.gold }}>◈</span> ₹{b.totalPrice?.toLocaleString()}
                          </p>
                        </div>
                        <span style={{ ...getStatusStyle(b.status), padding: '4px 10px', borderRadius: 4, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Dashboard;