import React, { useState } from 'react';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(198,162,100,0.25)',
  gold: '#C6A264',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
`;

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#C6A264',
};

const facilities = [
  { name: 'Free WiFi',       glyph: '◈' },
  { name: 'Swimming Pool',   glyph: '◉' },
  { name: 'Fitness Center',  glyph: '◐' },
  { name: 'Restaurant',      glyph: '◇' },
  { name: 'Spa Services',    glyph: '◎' },
  { name: '24/7 Concierge',  glyph: '◆' },
];

const staff = [
  { name: 'John Doe',     position: 'General Manager', image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80' },
  { name: 'Jane Smith',   position: 'Head Chef',       image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mike Johnson', position: 'Spa Director',    image: 'https://images.unsplash.com/photo-1592382141926-8b6d3d3547c5?auto=format&fit=crop&w=600&q=80' },
];

/* ─────────────────────────────────────────────
   Reusable image component with:
   • shimmer skeleton while loading
   • one-shot fallback URL on error
   • graceful error placeholder if fallback also fails
───────────────────────────────────────────── */
const Img = ({
  src,
  alt,
  fallback = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  style = {},
  containerStyle = {},
  errorIcon = '🏨',
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const shimmer = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(90deg, ${T.surfaceAlt} 25%, #1e1f1c 50%, ${T.surfaceAlt} 75%)`,
    backgroundSize: '600px 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: T.surfaceAlt, ...containerStyle }}>
      {status === 'loading' && <div style={shimmer} />}

      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
          background: T.surfaceAlt,
        }}>
          <span style={{ fontSize: 32, opacity: 0.25 }}>{errorIcon}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.textMuted, letterSpacing: '0.06em' }}>{alt}</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        crossOrigin="anonymous"
        onLoad={() => setStatus('loaded')}
        onError={(e) => {
          if (e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          } else {
            setStatus('error');
          }
        }}
        style={{
          display: 'block',
          opacity: status === 'loaded' ? 1 : 0,
          transition: 'opacity 0.35s ease',
          ...style,
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   FacilityCard
───────────────────────────────────────────── */
const FacilityCard = ({ name, glyph }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 24px',
        background: hovered ? T.goldMuted : T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 2,
        textAlign: 'center',
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize: 22, color: hovered ? T.gold : T.textMuted, marginBottom: 14, transition: 'color 0.25s' }}>{glyph}</div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, letterSpacing: '0.06em', color: hovered ? T.text : T.textSecondary, transition: 'color 0.25s' }}>{name}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   StaffCard
───────────────────────────────────────────── */
const StaffCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  const personFallback = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}
    >
      <Img
        src={member.image}
        alt={member.name}
        fallback={personFallback}
        errorIcon="👤"
        containerStyle={{ aspectRatio: '4/3', width: '100%' }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          filter: hovered ? 'brightness(0.8)' : 'brightness(0.9)',
          transition: 'transform 0.5s ease, filter 0.4s ease, opacity 0.35s ease',
        }}
      />
      <div style={{ padding: '22px 24px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, fontStyle: 'italic', color: T.text, marginBottom: 6 }}>{member.name}</h3>
        <div style={{ width: 20, height: 1, background: T.gold, opacity: 0.5, margin: '0 auto 10px' }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted }}>{member.position}</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SectionHeader
───────────────────────────────────────────── */
const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div style={{ marginBottom: 56 }}>
    <p style={{ ...label, marginBottom: 16 }}>{eyebrow}</p>
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: T.text, letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: 16 }}>
      {title}
    </h2>
    {subtitle && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: T.textSecondary, lineHeight: 1.75, maxWidth: 520 }}>{subtitle}</p>}
    <div style={{ width: 32, height: 1, background: T.gold, opacity: 0.4, marginTop: 20 }} />
  </div>
);

/* ─────────────────────────────────────────────
   About page
───────────────────────────────────────────── */
const About = () => {
  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Hero */}
        <section style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
          <Img
            src="https://images.unsplash.com/photo-1542317851-9f9a8638a16f?auto=format&fit=crop&w=2400&q=80"
            alt="Hotel exterior"
            containerStyle={{ width: '100%', height: '100%' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 24px',
            animation: 'fadeUp 0.7s ease',
            pointerEvents: 'none',
          }}>
            <p style={{ ...label, marginBottom: 18 }}>Our story</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 60, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
              About Our <span style={{ fontStyle: 'italic' }}>Hotel</span>
            </h1>
            <p style={{ fontSize: 14, fontWeight: 300, color: T.textSecondary, letterSpacing: '0.06em' }}>A legacy of luxury and hospitality since 1995</p>
          </div>
        </section>

        {/* Story */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <SectionHeader eyebrow="Since 1995" title="Our Story" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  "Founded in 1995, our hotel has been a beacon of luxury and comfort for over two decades. What started as a small boutique hotel has grown into one of the most prestigious accommodations in the city.",
                  "Our commitment to excellence is reflected in every aspect of our service, from the meticulously designed rooms to the personalised attention from our dedicated staff.",
                  "We pride ourselves on creating memorable experiences for our guests, whether they're here for business or leisure.",
                ].map((para, i) => (
                  <p key={i} style={{ fontSize: 14, fontWeight: 300, color: T.textSecondary, lineHeight: 1.85 }}>{para}</p>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${T.border}` }}>
              <Img
                src="https://images.unsplash.com/photo-1542317851-9f9a8638a16f?auto=format&fit=crop&w=1200&q=80"
                alt="Hotel exterior"
                containerStyle={{ width: '100%' }}
                style={{ width: '100%', display: 'block', filter: 'brightness(0.9)' }}
              />
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ height: 1, background: T.border }} />
        </div>

        {/* Facilities */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <SectionHeader
            eyebrow="Amenities"
            title="Our Facilities"
            subtitle="Everything you need for a perfect stay — thoughtfully curated, impeccably maintained."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {facilities.map((f) => <FacilityCard key={f.name} {...f} />)}
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ height: 1, background: T.border }} />
        </div>

        {/* Staff */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <SectionHeader
            eyebrow="The people behind the experience"
            title="Meet Our Team"
            subtitle="Dedicated professionals committed to making every stay exceptional."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {staff.map((m) => <StaffCard key={m.name} member={m} />)}
          </div>
        </section>

      </div>
    </>
  );
};

export default About;