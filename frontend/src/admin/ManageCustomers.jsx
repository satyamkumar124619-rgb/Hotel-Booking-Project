import React, { useState, useEffect } from 'react';
import API from '../api/config';

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
  info: '#7090C0'
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
  .customer-row { transition: background 0.3s ease; }
  .customer-row:hover { background: rgba(255,255,255,0.02); }
`;

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/auth/users');
      setCustomers(data.users || []);
      setError('');
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50, animation: 'fadeUp 0.6s ease' }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: 12, display: 'block' }}>Administration</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: T.text, margin: 0 }}>
              Manage <span style={{ fontStyle: 'italic', color: T.gold }}>Guests</span>
            </h1>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4, margin: '20px auto 0' }} />
          </div>

          {error && (
            <div style={{ padding: 16, background: 'rgba(180,80,80,0.1)', border: '1px solid rgba(180,80,80,0.2)', color: T.danger, borderRadius: 4, marginBottom: 30, fontSize: 13, textAlign: 'center' }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}>Synchronizing guest manifest...</div>
          ) : customers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6 }}>
              <span style={{ fontSize: 32, color: T.gold, opacity: 0.5, display: 'block', marginBottom: 16 }}>◈</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', color: T.text, marginBottom: 8 }}>No Registered Guests</h3>
              <p style={{ color: T.textMuted, fontSize: 13 }}>Guest profiles will populate here as users join.</p>
            </div>
          ) : (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, overflowX: 'auto', animation: 'fadeUp 0.7s ease' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: T.surfaceAlt, borderBottom: `1px solid ${T.border}` }}>
                    {['Profile', 'Contact', 'Role', 'Joined Date'].map((h,i) => (
                      <th key={i} style={{ padding: '16px 24px', fontSize: 10, fontWeight: 500, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id} className="customer-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: T.goldMuted, border: `1px solid rgba(198,162,100,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: T.gold }}>{c.name?.charAt(0)?.toUpperCase() || '•'}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: 14, color: T.text, fontWeight: 400, marginBottom: 2 }}>{c.name}</p>
                            <p style={{ fontSize: 11, color: T.textSecondary }}>Guest ID: {c._id.substring(c._id.length - 6)}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontSize: 13, color: T.textSecondary, marginBottom: 4 }}>{c.email}</p>
                        <p style={{ fontSize: 12, color: T.textMuted }}>{c.phone || '—'}</p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          background: c.role === 'admin' ? T.goldMuted : 'rgba(255,255,255,0.03)',
                          color: c.role === 'admin' ? T.gold : T.textSecondary,
                          border: `1px solid ${c.role === 'admin' ? 'rgba(198,162,100,0.2)' : T.border}`,
                          padding: '4px 10px', borderRadius: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 
                        }}>
                          {c.role || 'user'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontSize: 13, color: T.textMuted }}>{formatDate(c.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '16px 24px', background: T.surfaceAlt }}>
                 <p style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.05em' }}>Total Guests: <span style={{color: T.gold, fontWeight: 600}}>{customers.length}</span></p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ManageCustomers;