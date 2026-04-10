import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms } from '../api/roomService';
import { useAuth } from '../context/AuthContext';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(198,162,100,0.45)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.42)',
  textSecondary: 'rgba(240,237,230,0.62)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
`;

const FILTERS = ['all', 'standard', 'deluxe', 'suite', 'presidential'];

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div style={{ border: `1px solid ${T.border}`, overflow: 'hidden', animation: 'shimmer 1.5s ease infinite' }}>
    <div style={{ height: 240, background: T.surface }} />
    <div style={{ padding: 24 }}>
      <div style={{ height: 12, width: '40%', background: T.surface, marginBottom: 12 }} />
      <div style={{ height: 20, width: '70%', background: T.surface, marginBottom: 10 }} />
      <div style={{ height: 12, width: '90%', background: T.surface, marginBottom: 6 }} />
      <div style={{ height: 12, width: '60%', background: T.surface, marginBottom: 24 }} />
      <div style={{ height: 40, background: T.surface }} />
    </div>
  </div>
);

/* ── Room Card ── */
const RoomCard = ({ room, onBook, index }) => {
  const [hover, setHover] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${hover ? T.borderHover : T.border}`,
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hover ? '0 28px 64px rgba(0,0,0,0.6)' : '0 4px 20px rgba(0,0,0,0.25)',
        background: T.surface,
        animation: `fadeUp 0.5s ease ${index * 0.08}s both`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: T.surfaceAlt }}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
          alt={room.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.6s ease',
            opacity: imgLoaded ? 1 : 0,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,15,13,0.7) 0%, transparent 50%)' }} />

        {/* Featured Badge */}
        {room.featured && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: T.gold, padding: '4px 12px',
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0E0F0D' }}>Featured</span>
          </div>
        )}

        {/* Rating */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
          border: `1px solid rgba(198,162,100,0.25)`, padding: '5px 10px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ color: T.gold, fontSize: 11 }}>★</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: T.text }}>{room.rating}</span>
        </div>

        {/* Bottom info overlay */}
        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)',
            border: `1px solid ${T.borderHover}`, padding: '3px 10px',
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold }}>{room.roomType}</span>
          </div>
          {room.size && (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,237,230,0.6)', fontWeight: 300 }}>{room.size}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px 24px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: T.text, letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.2 }}>
          {room.name}
        </h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, fontWeight: 300, lineHeight: 1.7, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {room.description}
        </p>

        {/* Amenities */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {room.amenities?.slice(0, 3).map((a) => (
            <span key={a} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300,
              color: T.textSecondary, border: `1px solid ${T.border}`,
              padding: '3px 9px', letterSpacing: '0.03em',
            }}>{a}</span>
          ))}
          {room.amenities?.length > 3 && (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.gold, border: `1px solid rgba(198,162,100,0.2)`, padding: '3px 9px' }}>
              +{room.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Capacity */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, fontWeight: 300, marginBottom: 18, letterSpacing: '0.04em' }}>
          ◎ Up to {room.capacity} guests
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: T.border, marginBottom: 18 }} />

        {/* Price + Book */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 3 }}>Per night</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: T.gold, letterSpacing: '-0.02em' }}>
                ₹{room.price?.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => onBook(room._id)}
            style={{
              padding: '11px 22px',
              background: hover ? T.goldLight : T.gold,
              border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#0E0F0D', transition: 'background 0.25s ease',
            }}
          >
            Reserve →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════MAIN PAGE
════════════════════════════════ */
const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => { fetchRooms(); }, [filter]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { roomType: filter } : {};
      const data = await getAllRooms(filters);
      setRooms(data.rooms || []);
    } catch (err) {
      setError('Failed to load rooms. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (roomId) => {
    if (!isAuthenticated) {
      navigate('/signin');
    } else {
      navigate('/booking');
    }
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Hero Header ── */}
        <div style={{
          padding: '80px 40px 60px',
          background: `linear-gradient(to bottom, rgba(14,15,13,0) 0%, ${T.bg} 100%), radial-gradient(ellipse at 50% 0%, rgba(198,162,100,0.07) 0%, transparent 60%)`,
          textAlign: 'center',
          borderBottom: `1px solid ${T.border}`,
          animation: 'fadeUp 0.6s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: T.gold }}>Luxury Hotel</span>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4 }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 58, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
            Rooms & <span style={{ fontStyle: 'italic' }}>Suites</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: T.textSecondary, maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.8 }}>
            Experience unparalleled comfort in our meticulously crafted rooms, each designed to offer a sanctuary of luxury.
          </p>

          {/* ── Filter Pills ── */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map((type) => {
              const active = filter === type;
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{
                    padding: '8px 20px',
                    background: active ? T.gold : 'transparent',
                    border: `1px solid ${active ? T.gold : T.border}`,
                    color: active ? '#0E0F0D' : T.textMuted,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10, fontWeight: active ? 600 : 300,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (!active) { e.target.style.borderColor = 'rgba(198,162,100,0.4)'; e.target.style.color = T.gold; } }}
                  onMouseLeave={(e) => { if (!active) { e.target.style.borderColor = T.border; e.target.style.color = T.textMuted; } }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 80px' }}>

          {/* Count */}
          {!loading && !error && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, fontWeight: 300, letterSpacing: '0.06em' }}>
                <span style={{ color: T.gold, fontWeight: 500 }}>{rooms.length}</span> room{rooms.length !== 1 ? 's' : ''} available
              </p>
              <div style={{ height: 1, flex: 1, background: T.border, margin: '0 24px' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, fontWeight: 300, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {filter === 'all' ? 'All categories' : filter}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 0', animation: 'fadeUp 0.5s ease' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: T.borderHover, marginBottom: 16 }}>⊘</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: T.textMuted, fontStyle: 'italic', marginBottom: 8 }}>Connection failed</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, fontWeight: 300, marginBottom: 28 }}>{error}</p>
              <button
                onClick={fetchRooms}
                style={{ padding: '12px 32px', background: T.gold, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0E0F0D' }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && rooms.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: T.textMuted, fontStyle: 'italic', marginBottom: 8 }}>No rooms found</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, fontWeight: 300, marginBottom: 24 }}>Try a different category</p>
              <button onClick={() => setFilter('all')} style={{ padding: '10px 28px', background: 'none', border: `1px solid ${T.border}`, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                View All Rooms
              </button>
            </div>
          )}

          {/* Rooms Grid */}
          {!loading && !error && rooms.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
              {rooms.map((room, i) => (
                <RoomCard key={room._id} room={room} onBook={handleBook} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomsPage;