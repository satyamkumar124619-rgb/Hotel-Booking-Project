import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(198,162,100,0.4)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.5)',
  textSecondary: 'rgba(240,237,230,0.65)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

const rooms = [
  {
    id: 1,
    name: 'Standard Room',
    type: 'Standard',
    price: 9247,
    originalPrice: 11800,
    rating: 8.7,
    reviews: 2281,
    size: '280 sq ft',
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1560184897-120b0bc7dd2c?w=800',
    amenities: ['Free WiFi', 'AC', 'TV', 'Room Service'],
    description: 'A cozy and comfortable room perfect for solo travelers or couples.',
  },
  {
    id: 2,
    name: 'Deluxe King Room',
    type: 'Deluxe',
    price: 10799,
    originalPrice: 12999,
    rating: 9.1,
    reviews: 365,
    size: '420 sq ft',
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['Free WiFi', 'AC', 'Smart TV', 'Bathtub', 'Balcony'],
    description: 'Spacious deluxe room with king-size bed and stunning city views.',
  },
];

const RoomCard = ({ room, index }) => {
  const [hover, setHover] = useState(false);
  const discount = Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr 220px',
        background: T.surface,
        border: `1px solid ${hover ? T.borderHover : T.border}`,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        boxShadow: hover ? '0 24px 64px rgba(0,0,0,0.7)' : '0 4px 24px rgba(0,0,0,0.3)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        animation: `fadeUp 0.5s ease ${index * 0.1}s both`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={room.image}
          alt={room.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)' }} />
        {/* Type Badge */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
          border: `1px solid ${T.borderHover}`,
          padding: '4px 12px',
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold }}>{room.type}</span>
        </div>
        {/* Discount Badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            background: T.gold, padding: '4px 10px',
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: '#0E0F0D' }}>–{discount}% OFF</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ padding: '3px 10px', background: T.goldMuted, border: `1px solid rgba(198,162,100,0.2)` }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: T.gold }}>★ {room.rating}</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, fontWeight: 300 }}>{room.reviews.toLocaleString()} reviews</span>
          </div>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: T.text, letterSpacing: '-0.01em', marginBottom: 8 }}>
            {room.name}
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>{room.description}</p>

          {/* Specs */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            {[
              { icon: '⊡', label: room.size },
              { icon: '◎', label: `${room.capacity} Guests` },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: T.gold, fontSize: 14 }}>{s.icon}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, fontWeight: 300 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {room.amenities.map((a) => (
            <span key={a} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300,
              color: T.textSecondary, border: `1px solid ${T.border}`,
              padding: '3px 10px', letterSpacing: '0.04em',
            }}>{a}</span>
          ))}
        </div>
      </div>

      {/* Price & Book */}
      <div style={{
        padding: '28px 24px',
        borderLeft: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: hover ? 'rgba(198,162,100,0.03)' : 'transparent',
        transition: 'background 0.3s ease',
      }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 }}>Per night</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, fontWeight: 300, textDecoration: 'line-through', marginBottom: 4 }}>₹{room.originalPrice.toLocaleString()}</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: T.gold, letterSpacing: '-0.02em', lineHeight: 1 }}>
            ₹{room.price.toLocaleString()}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, marginTop: 4, fontWeight: 300 }}>excl. taxes</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            to="/booking"
            style={{
              padding: '13px 20px', textAlign: 'center',
              background: hover ? T.goldLight : T.gold,
              color: '#0E0F0D', textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
              transition: 'background 0.25s ease', display: 'block',
            }}
          >
            Reserve Now →
          </Link>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, textAlign: 'center', fontWeight: 300 }}>Free cancellation</p>
        </div>
      </div>
    </div>
  );
};

export default function Rooms() {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() =>
    rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '60px 40px 80px', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ maxWidth: 900, margin: '0 auto 48px', animation: 'fadeUp 0.5s ease' }}>
          <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: 14 }}>Our Accommodation</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Rooms & <span style={{ fontStyle: 'italic' }}>Suites</span>
            </h1>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: 280 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: 14 }}>⊕</span>
              <input
                placeholder="Search by room name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  width: '100%', padding: '12px 16px 12px 38px',
                  background: T.surface,
                  border: `1px solid ${focused ? 'rgba(198,162,100,0.5)' : T.border}`,
                  color: T.text,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300,
                  outline: 'none', transition: 'border 0.2s ease',
                }}
              />
            </div>
          </div>
          <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4, marginTop: 20 }} />
        </div>

        {/* Results count */}
        <div style={{ maxWidth: 900, margin: '0 auto 24px' }}>
          <p style={{ fontSize: 12, color: T.textMuted, fontWeight: 300, letterSpacing: '0.06em' }}>
            Showing <span style={{ color: T.gold }}>{filtered.length}</span> of {rooms.length} rooms
          </p>
        </div>

        {/* Room Cards */}
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: T.textMuted, fontStyle: 'italic' }}>No rooms match your search</p>
              <button onClick={() => setSearch('')} style={{ marginTop: 16, background: 'none', border: `1px solid ${T.border}`, color: T.textMuted, padding: '8px 20px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                Clear search
              </button>
            </div>
          ) : (
            filtered.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)
          )}
        </div>
      </div>
    </>
  );
}