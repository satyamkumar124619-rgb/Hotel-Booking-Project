import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceHover: '#1C1D1A',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(198,162,100,0.3)',
  gold: '#C6A264',
  goldMuted: 'rgba(198,162,100,0.1)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
`;

const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
];

const RoomCard = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardHovered, setCardHovered] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
  const [bookHovered, setBookHovered] = useState(false);

  // Use real room images from DB, fallback to placeholders
  const images = room.images && room.images.length > 0 ? room.images : hotelImages;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((i) => (i + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <>
      <style>{fonts}</style>
      <div
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        style={{
          background: T.surface,
          border: `1px solid ${cardHovered ? T.borderHover : T.border}`,
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'border-color 0.3s ease, transform 0.3s ease',
          transform: cardHovered ? 'translateY(-3px)' : 'none',
        }}
      >
        {/* Image area */}
        <div
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
          style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', cursor: 'pointer' }}
        >
          <img
            src={images[currentImageIndex]}
            alt={room.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: imgHovered ? 'scale(1.06)' : 'scale(1)',
              filter: imgHovered ? 'brightness(0.75)' : 'brightness(0.9)',
              transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease',
            }}
          />

          {/* Prev / Next arrows */}
          {[{ dir: 'prev', label: '‹', pos: 'left' }, { dir: 'next', label: '›', pos: 'right' }].map(({ dir, label, pos }) => (
            <button
              key={dir}
              onClick={dir === 'prev' ? prevImage : nextImage}
              aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} image`}
              style={{
                position: 'absolute',
                [pos]: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.65)',
                border: `1px solid rgba(198,162,100,0.3)`,
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: T.gold,
                fontSize: 20,
                lineHeight: 1,
                opacity: imgHovered ? 1 : 0,
                transition: 'opacity 0.25s ease, background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.65)'}
            >
              {label}
            </button>
          ))}

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(i); }}
                aria-label={`Image ${i + 1}`}
                style={{
                  width: i === currentImageIndex ? 18 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === currentImageIndex ? T.gold : 'rgba(240,237,230,0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Price badge */}
          <div style={{
            position: 'absolute',
            top: 14,
            right: 14,
            padding: '5px 12px',
            background: 'rgba(255,255,255,0.75)',
            border: `1px solid rgba(198,162,100,0.25)`,
            borderRadius: 2,
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, color: T.gold }}>
              ₹{room.price?.toLocaleString()}<span style={{ fontSize: 10, fontWeight: 300, color: T.textMuted }}>/night</span>
            </span>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '24px 24px 28px' }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            fontWeight: 300,
            fontStyle: 'italic',
            color: T.text,
            letterSpacing: '0.01em',
            marginBottom: 10,
            transition: 'color 0.2s',
          }}>
            {room.name}
          </h3>

          {/* Thin gold rule */}
          <div style={{ width: 24, height: 1, background: T.gold, opacity: 0.4, marginBottom: 14 }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 300,
            color: T.textSecondary,
            lineHeight: 1.75,
            marginBottom: 24,
          }}>
            {room.description}
          </p>

          <Link
            to="/booking"
            onMouseEnter={() => setBookHovered(true)}
            onMouseLeave={() => setBookHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 24px',
              background: bookHovered ? '#D4B97E' : T.gold,
              borderRadius: 2,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#0E0F0D',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            Reserve this room
            <span style={{ fontSize: 14, opacity: 0.6 }}>→</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default RoomCard;