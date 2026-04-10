import React, { useState } from 'react';

const T = {
  bg: '#0E0F0D',
  surface: '#161714',
  border: 'rgba(255,255,255,0.06)',
  gold: '#C6A264',
  goldMuted: 'rgba(198,162,100,0.1)',
  text: '#F0EDE6',
  textMuted: 'rgba(15,23,42,0.5)',
  textSecondary: 'rgba(15,23,42,0.7)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
  @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
`;

const images = [
  { src: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=1600&q=85', label: 'Grand Lobby',        category: 'Interiors',  span: 'wide' },
  { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85',  label: 'Deluxe Suite',      category: 'Rooms',      span: 'tall' },
  { src: 'https://images.unsplash.com/photo-1576013551528-96f30a9163eb?auto=format&fit=crop&w=900&q=85',  label: 'Infinity Pool',     category: 'Amenities',  span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=900&q=85',  label: 'Mountain View',     category: 'Views',      span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85', label: 'Presidential Suite',category: 'Rooms',      span: 'wide' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85',  label: 'Fine Dining',       category: 'Dining',     span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85',  label: 'Spa & Wellness',    category: 'Amenities',  span: 'tall' },
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85',  label: 'Pool Terrace',      category: 'Amenities',  span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=85',  label: 'Garden View',       category: 'Views',      span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1541628951107-a5af53102653?auto=format&fit=crop&w=900&q=85',  label: "Chef's Table",      category: 'Dining',     span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?auto=format&fit=crop&w=1600&q=85', label: 'Rooftop Lounge',    category: 'Amenities',  span: 'wide' },
  { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1e?auto=format&fit=crop&w=900&q=85',     label: 'Bar & Cocktails',   category: 'Dining',     span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1522771731478-44eb939c37bd?auto=format&fit=crop&w=900&q=85',  label: 'Executive Room',    category: 'Rooms',      span: 'tall' },
  { src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=85',  label: 'Cozy Living',       category: 'Interiors',  span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=85',  label: 'Hotel Facade',      category: 'Interiors',  span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85', label: 'Ocean View Balcony',category: 'Views',      span: 'wide' }
];

const categories = ['All', 'Rooms', 'Amenities', 'Dining', 'Views', 'Interiors'];
const FALLBACK = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80';

/* ── Robust image with shimmer + fallback ── */
const Img = ({ src, alt, style = {} }) => {
  const [status, setStatus] = useState('loading');
  return (
    <>
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #111210 25%, #1c1d1a 50%, #111210 75%)',
          backgroundSize: '600px 100%',
          animation: 'shimmer 1.5s infinite linear',
        }} />
      )}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8, background: '#161714',
        }}>
          <span style={{ fontSize: 28, opacity: 0.2 }}>🏨</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: T.textMuted, letterSpacing: '0.06em' }}>{alt}</span>
        </div>
      )}
      <img
        src={src} alt={alt} loading="lazy" crossOrigin="anonymous"
        onLoad={() => setStatus('loaded')}
        onError={(e) => {
          if (e.currentTarget.src !== FALLBACK) { e.currentTarget.src = FALLBACK; }
          else { setStatus('error'); }
        }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: status === 'loaded' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          ...style,
        }}
      />
    </>
  );
};

/* ── Gallery grid item ── */
const GalleryItem = ({ image, index, onClick, animDelay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer', borderRadius: 3,
        background: T.surface, width: '100%', height: '100%',
        animation: `fadeUp 0.55s ease ${animDelay}s both`,
      }}
    >
      <Img
        src={image.src} alt={image.label}
        style={{
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          filter: hovered ? 'brightness(0.5)' : 'brightness(0.8)',
          transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease, opacity 0.4s ease',
        }}
      />

      {/* Category pill */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 1,
        padding: '4px 10px',
        background: 'rgba(255,255,255,0.75)',
        border: `1px solid rgba(198,162,100,${hovered ? 0.4 : 0.12})`,
        borderRadius: 2, transition: 'border-color 0.3s, opacity 0.3s',
        opacity: hovered ? 1 : 0.75,
      }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.gold }}>{image.category}</span>
      </div>

      {/* Index badge */}
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 1,
        width: 26, height: 26, borderRadius: '50%',
        border: `1px solid rgba(198,162,100,${hovered ? 0.55 : 0.18})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.3s',
      }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 300, color: hovered ? T.gold : T.textMuted, transition: 'color 0.3s' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Label overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
        padding: '44px 18px 18px',
        background: 'linear-gradient(to top, rgba(10,11,10,0.92) 0%, transparent 100%)',
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        opacity: hovered ? 1 : 0,
        transition: 'all 0.35s ease',
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 300, color: T.text, fontStyle: 'italic', letterSpacing: '0.02em', marginBottom: 6 }}>{image.label}</p>
        <div style={{ width: 20, height: 1, background: T.gold, opacity: 0.6 }} />
      </div>
    </div>
  );
};

/* ── Lightbox ── */
const Lightbox = ({ image, index, total, onClose, onPrev, onNext, allImages }) => {
  const [imgStatus, setImgStatus] = useState('loading');
  React.useEffect(() => { setImgStatus('loading'); }, [image.src]);
  React.useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose, onPrev, onNext]);

  const NavBtn = ({ onClick: handleClick, children, extraStyle = {} }) => (
    <button
      onClick={handleClick}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(198,162,100,0.5)'; e.currentTarget.style.color = T.gold; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; }}
      style={{
        background: 'rgba(255,255,255,0.7)', border: `1px solid ${T.border}`,
        borderRadius: '50%', width: 48, height: 48,
        cursor: 'pointer', color: T.textSecondary, fontSize: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.2s, color 0.2s',
        backdropFilter: 'blur(8px)',
        ...extraStyle,
      }}
    >{children}</button>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(8,9,8,0.97)',
        zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease', padding: '24px 80px 100px',
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', animation: 'scaleIn 0.28s ease', maxWidth: '88vw' }}>
        {imgStatus === 'loading' && (
          <div style={{
            width: '72vw', height: '62vh',
            background: 'linear-gradient(90deg, #111210 25%, #1c1d1a 50%, #111210 75%)',
            backgroundSize: '600px 100%',
            animation: 'shimmer 1.5s infinite linear', borderRadius: 3,
          }} />
        )}
        <img
          src={image.src} alt={image.label} crossOrigin="anonymous"
          onLoad={() => setImgStatus('loaded')}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK) { e.currentTarget.src = FALLBACK; }
            else { setImgStatus('error'); }
          }}
          style={{
            maxWidth: '88vw', maxHeight: '76vh',
            objectFit: 'contain',
            display: imgStatus === 'loading' ? 'none' : 'block',
            borderRadius: 3,
            opacity: imgStatus === 'loaded' ? 1 : 0,
            transition: 'opacity 0.35s ease',
          }}
        />

        {/* Caption */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.border}`,
          opacity: imgStatus === 'loaded' ? 1 : 0, transition: 'opacity 0.35s ease',
        }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 300, color: T.text, fontStyle: 'italic', marginBottom: 4 }}>{image.label}</p>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.gold }}>{image.category}</span>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: T.textMuted, fontWeight: 300, letterSpacing: '0.12em' }}>
            {String(index + 1).padStart(2, '0')} <span style={{ margin: '0 6px', color: T.border }}>—</span> {String(total).padStart(2, '0')}
          </p>
        </div>
      </div>

      <NavBtn onClick={(e) => { e.stopPropagation(); onPrev(); }} extraStyle={{ position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)' }}>‹</NavBtn>
      <NavBtn onClick={(e) => { e.stopPropagation(); onNext(); }} extraStyle={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)' }}>›</NavBtn>
      <NavBtn onClick={onClose} extraStyle={{ position: 'fixed', top: 20, right: 20, width: 38, height: 38, fontSize: 14 }}>✕</NavBtn>

      {/* Thumbnail strip */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 5,
          background: 'rgba(255,255,255,0.85)', border: `1px solid ${T.border}`,
          borderRadius: 3, padding: '7px 9px', backdropFilter: 'blur(12px)',
          maxWidth: '80vw', overflowX: 'auto',
        }}
      >
        {allImages.map((img, i) => (
          <div
            key={i}
            style={{
              width: 38, height: 27, borderRadius: 2, overflow: 'hidden', flexShrink: 0,
              border: `1px solid ${i === index ? T.gold : 'transparent'}`,
              opacity: i === index ? 1 : 0.38,
              transition: 'opacity 0.2s, border-color 0.2s',
              cursor: 'pointer',
            }}
          >
            <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Gallery ── */
const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const getGridStyle = (span) => {
    if (span === 'wide') return { gridColumn: 'span 2', aspectRatio: '16/7' };
    if (span === 'tall') return { gridRow: 'span 2', aspectRatio: '3/4' };
    return { aspectRatio: '4/3' };
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100%', padding: '72px 40px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 52, animation: 'fadeUp 0.5s ease both' }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, marginBottom: 16 }}>Visual journey</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 20 }}>
              Our <span style={{ fontStyle: 'italic' }}>Gallery</span>
            </h2>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.5, marginBottom: 36 }} />

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '7px 18px',
                      background: active ? T.goldMuted : 'transparent',
                      border: `1px solid ${active ? 'rgba(198,162,100,0.3)' : T.border}`,
                      borderRadius: 2,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 10, fontWeight: active ? 500 : 300,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: active ? T.gold : T.textMuted,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(198,162,100,0.2)'; e.currentTarget.style.color = T.textSecondary; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
                  >{cat}</button>
                );
              })}
            </div>
          </div>

          {/* Masonry-style grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, gridAutoRows: '220px' }}>
            {filtered.map((img, i) => (
              <div key={`${img.label}-${i}`} style={getGridStyle(img.span)}>
                <GalleryItem image={img} index={i} onClick={setLightboxIndex} animDelay={i * 0.05} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <p style={{ marginTop: 44, fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: T.textMuted, fontWeight: 300, letterSpacing: '0.1em', textAlign: 'center', textTransform: 'uppercase' }}>
            {filtered.length} photographs · click any image to explore
          </p>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          image={filtered[lightboxIndex]}
          index={lightboxIndex}
          total={filtered.length}
          allImages={filtered}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)}
          onNext={() => setLightboxIndex((i) => (i + 1) % filtered.length)}
        />
      )}
    </>
  );
};

export default Gallery;