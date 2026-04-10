import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { getAllRooms } from '../api/roomService';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#0F0F0C',
  border: 'rgba(255,255,255,0.06)',
  borderGold: 'rgba(198,162,100,0.2)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.07)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.35)',
  textSecondary: 'rgba(240,237,230,0.58)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  @keyframes slideIn   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes scrollBob { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(7px);opacity:.9} }
  @keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes kenBurns  { 0%{transform:scale(1.08);} 100%{transform:scale(1);} }
`;

// ── Beautiful hotel images from picsum (always works, no auth needed) ──
// Using specific picsum IDs that look like luxury hotels/interiors
const heroSlides = [
  {
    // Grand hotel exterior / lobby feel
    image: 'https://picsum.photos/seed/luxhotel1/1920/1080',
    title: 'Where Luxury Meets Comfort',
    subtitle: 'An extraordinary experience awaits you in every corner of our world-class property.',
  },
  {
    // Pool / resort
    image: 'https://picsum.photos/seed/luxhotel2/1920/1080',
    title: 'Unparalleled Serenity',
    subtitle: 'Escape the ordinary and immerse yourself in pure, unhurried elegance.',
  },
  {
    // Room interior
    image: 'https://picsum.photos/seed/luxhotel3/1920/1080',
    title: 'Crafted for Excellence',
    subtitle: 'Every detail thoughtfully designed to make your stay truly unforgettable.',
  },
];

// Fetched dynamically from database now

const spaces = [
  { src: 'https://picsum.photos/seed/space1lux/800/600', label: 'Elegant Rooms',   desc: 'City views, designed for total comfort.' },
  { src: 'https://picsum.photos/seed/space2lux/800/600', label: 'Infinity Pool',   desc: 'Heated pool open year-round.' },
  { src: 'https://picsum.photos/seed/space3lux/800/600', label: 'Grand Dining',    desc: 'Fine cuisine, impeccable service.' },
  { src: 'https://picsum.photos/seed/space4lux/800/600', label: 'Wellness Spa',    desc: 'Rejuvenate mind, body and soul.' },
];

const highlights = [
  { glyph: '◍', title: 'Prime Location',          desc: 'Steps from top attractions, dining, and cultural landmarks.' },
  { glyph: '◇', title: 'Complimentary Breakfast', desc: 'Daily chef-curated buffet with local and international favourites.' },
  { glyph: '◈', title: 'High-Speed WiFi',          desc: 'Fast, reliable internet throughout the entire property.' },
  { glyph: '◆', title: '24 / 7 Concierge',         desc: 'Our dedicated team is always on hand for anything you need.' },
];

const stats = [
  { value: '4.9', unit: '/5',   label: 'Guest Rating' },
  { value: '12K+', unit: '',    label: 'Guests / Year' },
  { value: '98%',  unit: '',    label: 'Satisfaction' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Traveller',
    quote: 'Exceptional service and luxurious accommodations. The staff went above and beyond to make my stay perfect.',
    initials: 'SJ',
    color: '#8B7355',
  },
  {
    name: 'Michael Chen',
    role: 'Family Vacation',
    quote: 'Perfect family getaway. The rooms were spacious, the pool was amazing, and every detail was thoughtfully arranged.',
    initials: 'MC',
    color: '#6B8B73',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Romantic Getaway',
    quote: 'Romantic atmosphere with stunning views. The attention to detail was simply perfect. We will be back.',
    initials: 'ER',
    color: '#7B6B8B',
  },
];

// ── Helper components ──
const Btn = ({ to, primary, children, small }) => {
  const [h, setH] = useState(false);
  return (
    <Link to={to}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: small ? '9px 20px' : '13px 30px',
        background: primary ? (h ? T.goldLight : T.gold) : 'transparent',
        border: primary ? 'none' : '1px solid rgba(240,237,230,0.25)',
        borderRadius: 2,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: small ? 10 : 11,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: primary ? '#0A0A08' : (h ? T.text : T.textSecondary),
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      {primary && <span style={{ fontSize: 13, opacity: 0.6 }}>→</span>}
    </Link>
  );
};

const Skeleton = () => (
  <div style={{
    position: 'absolute', inset: 0,
    background: `linear-gradient(90deg, ${T.surface} 25%, #1a1a15 50%, ${T.surface} 75%)`,
    backgroundSize: '400px 100%',
    animation: 'shimmer 1.4s infinite linear',
  }} />
);

const LazyImg = ({ src, alt, style }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {!loaded && !error && <Skeleton />}
      {error ? (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a0e 0%, #0e0f0d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: T.gold, fontSize: 32, opacity: 0.3 }}>◈</span>
        </div>
      ) : (
        <img src={src} alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        />
      )}
    </div>
  );
};

const SectionWrap = ({ children, pad }) => (
  <div style={{ maxWidth: 1160, margin: '0 auto', padding: pad || '96px 40px' }}>{children}</div>
);

const EyebrowText = ({ children, center }) => (
  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: 16, textAlign: center ? 'center' : 'left' }}>
    {children}
  </p>
);

const SectionHead = ({ eye, title, italic, sub, center }) => (
  <div style={{ marginBottom: 56, textAlign: center ? 'center' : 'left' }}>
    <EyebrowText center={center}>{eye}</EyebrowText>
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 46, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: 16 }}>
      {title}{italic && <em style={{ fontStyle: 'italic', color: T.goldLight }}> {italic}</em>}
    </h2>
    {sub && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, maxWidth: center ? 520 : 460, margin: center ? '0 auto' : 0 }}>{sub}</p>}
    <div style={{ width: 28, height: 1, background: T.gold, opacity: 0.35, marginTop: 20, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }} />
  </div>
);

const GoldDivider = () => (
  <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.border} 20%, ${T.border} 80%, transparent)` }} />
  </div>
);

// ── Page ──
const Home = () => {
  const [slide, setSlide] = useState(0);
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        if (data.rooms) {
          setFeaturedRooms(data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load featured rooms", err);
      }
    };
    fetchRooms();

    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, color: T.text, overflowX: 'hidden' }}>

        {/* ════════════════════ HERO ════════════════════ */}
        <section style={{ position: 'relative', height: '92vh', minHeight: 600, overflow: 'hidden' }}>

          {/* Slides */}
          {heroSlides.map((s, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slide ? 1 : 0, transition: 'opacity 1.4s ease', zIndex: 0 }}>
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <LazyImg src={s.image} alt={s.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.28) saturate(0.8)', animation: i === slide ? 'kenBurns 7s ease-out forwards' : 'none' }}
                />
              </div>
            </div>
          ))}

          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,8,0.15) 0%, rgba(10,10,8,0.5) 70%, rgba(10,10,8,0.85) 100%)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,8,0.4) 100%)', zIndex: 1, pointerEvents: 'none' }} />

          {/* Content */}
          <div key={slide} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px', zIndex: 2, animation: 'slideIn 0.8s cubic-bezier(0.22,1,0.36,1) both' }}>

            {/* Gold line accent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.5 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold }}>Luxury Hotel</span>
              <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.5 }} />
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(44px, 7vw, 82px)', fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.04, marginBottom: 24, maxWidth: 760 }}>
              {heroSlides[slide].title.split(' ').map((w, i) =>
                i === Math.floor(heroSlides[slide].title.split(' ').length / 2)
                  ? <em key={i} style={{ fontStyle: 'italic', color: T.goldLight }}>{w} </em>
                  : `${w} `
              )}
            </h1>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, color: T.textSecondary, letterSpacing: '0.03em', lineHeight: 1.7, marginBottom: 44, maxWidth: 460 }}>
              {heroSlides[slide].subtitle}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Btn to="/booking" primary>Reserve a room</Btn>
              <Btn to="/rooms">Explore rooms</Btn>
            </div>
          </div>

          {/* Slide indicators */}
          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 3 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                style={{ width: i === slide ? 28 : 6, height: 6, borderRadius: 3, background: i === slide ? T.gold : 'rgba(240,237,230,0.25)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s ease' }}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 32, right: 44, zIndex: 3, animation: 'scrollBob 2.2s ease-in-out infinite', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.textMuted }}>Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
              <rect x="0.75" y="0.75" width="12.5" height="20.5" rx="6.25" stroke="rgba(198,162,100,0.35)" strokeWidth="1.5"/>
              <circle cx="7" cy="6" r="1.8" fill="rgba(198,162,100,0.55)"/>
            </svg>
          </div>

          {/* Bottom gradient strip */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to bottom, transparent, ${T.bg})`, zIndex: 2, pointerEvents: 'none' }} />
        </section>

        {/* ════════════════════ WELCOME STRIP ════════════════════ */}
        <div style={{ background: T.surfaceAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[
              { icon: '◈', text: 'Free Cancellation' },
              { icon: '◇', text: 'Complimentary Breakfast' },
              { icon: '◍', text: 'Airport Transfer' },
              { icon: '◆', text: '24/7 Concierge' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: T.gold, fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textSecondary }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════ ABOUT / STATS ════════════════════ */}
        <SectionWrap>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <SectionHead
                eye="Welcome"
                title="A Legacy of"
                italic="Excellence"
                sub="Discover a world of luxury and comfort at our premier hotel. With stunning architecture, world-class amenities, and exceptional service, we provide an unforgettable experience for every guest."
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <Btn to="/about" primary>Our story</Btn>
                <Btn to="/rooms">View rooms</Btn>
              </div>
            </div>

            <div>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ background: T.surface, padding: '32px 20px', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: T.text, lineHeight: 1, marginBottom: 4 }}>
                      {s.value}<span style={{ fontSize: 18, color: T.gold }}>{s.unit}</span>
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Est. banner */}
              <div style={{ padding: '20px 24px', background: T.goldMuted, border: `1px solid rgba(198,162,100,0.12)`, borderRadius: 2, textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: T.gold, marginBottom: 4 }}>Est. 1995</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.16em', color: T.textMuted, textTransform: 'uppercase' }}>Three decades of legendary hospitality</p>
              </div>

              {/* Image collage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
                {['collage1lux','collage2lux'].map((seed) => (
                  <div key={seed} style={{ position: 'relative', height: 140, borderRadius: 2, overflow: 'hidden', background: T.surface }}>
                    <LazyImg src={`https://picsum.photos/seed/${seed}/400/300`} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.75) saturate(0.7)' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrap>

        <GoldDivider />

        {/* ════════════════════ SPACES ════════════════════ */}
        <SectionWrap>
          <SectionHead
            eye="Explore"
            title="Spaces You'll"
            italic="Love"
            sub="Beautifully curated rooms and areas designed for relaxation, work, and unforgettable moments."
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* Big card left */}
            <SpaceCardBig space={spaces[0]} />
            {/* 3 small cards right */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <SpaceCardSmall space={spaces[1]} />
                <SpaceCardSmall space={spaces[2]} />
              </div>
              <SpaceCardSmall space={spaces[3]} wide />
            </div>
          </div>
        </SectionWrap>

        <GoldDivider />

        {/* ════════════════════ HIGHLIGHTS ════════════════════ */}
        <SectionWrap>
          <SectionHead
            eye="Why us"
            title="Crafted for"
            italic="Every Guest"
            sub="From arrival to departure, thoughtful details make every stay exceptional."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {highlights.map((h) => <HighlightCard key={h.title} {...h} />)}
          </div>
        </SectionWrap>

        <GoldDivider />

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <SectionWrap>
          <SectionHead
            eye="Guest voices"
            title="What Our"
            italic="Guests Say"
            sub="Hear directly from the guests who've experienced the magic."
            center
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {testimonials.map((t) => <TestiCard key={t.name} t={t} />)}
          </div>
        </SectionWrap>

        <GoldDivider />

        {/* ════════════════════ FEATURED ROOMS ════════════════════ */}
        <SectionWrap>
          <SectionHead
            eye="Accommodations"
            title="Featured"
            italic="Rooms"
            sub="Choose from our carefully curated selection of premium rooms and suites."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
            {featuredRooms.map((room) => <RoomCard key={room._id} room={room} />)}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Btn to="/rooms" primary>View all rooms</Btn>
          </div>
        </SectionWrap>

        {/* ════════════════════ CTA BANNER ════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <LazyImg src="https://picsum.photos/seed/ctabanner/1920/600" alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.18) saturate(0.6)' }}
            />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(14,15,13,0.95) 0%, rgba(14,15,13,0.7) 100%)' }} />

          {/* Gold top line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`, opacity: 0.3 }} />

          <div style={{ position: 'relative', maxWidth: 1160, margin: '0 auto', padding: '88px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 56, alignItems: 'center', zIndex: 1 }}>
            <div>
              <EyebrowText>Start your journey</EyebrowText>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: 18 }}>
                Ready for an <em style={{ fontStyle: 'italic', color: T.gold }}>Unforgettable</em> Experience?
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, maxWidth: 500 }}>
                Join thousands of guests who have created memories that last a lifetime. Your perfect stay awaits — book today and receive our exclusive welcome package.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
              <Btn to="/booking" primary>Reserve now</Btn>
              <Btn to="/contact">Contact us</Btn>
            </div>
          </div>
        </section>

        {/* Floating Book CTA */}
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 50 }}>
          <Link to="/booking"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: T.gold, borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#0A0A08', textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(198,162,100,0.2)' }}
          >
            Book now →
          </Link>
        </div>

      </div>
    </>
  );
};

// ── Space Cards ──
const SpaceCardBig = ({ space }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer', minHeight: 480, background: T.surface }}
    >
      <LazyImg src={space.src} alt={space.label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: h ? 'brightness(0.45) saturate(0.7)' : 'brightness(0.65) saturate(0.7)', transform: h ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.5s ease' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,15,13,0.9) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 28px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, fontStyle: 'italic', color: T.text, marginBottom: 6 }}>{space.label}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: T.textSecondary, opacity: h ? 1 : 0, transform: h ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.3s ease' }}>{space.desc}</p>
      </div>
    </div>
  );
};

const SpaceCardSmall = ({ space, wide }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer', height: 180, background: T.surface, gridColumn: wide ? '1 / -1' : 'auto' }}
    >
      <LazyImg src={space.src} alt={space.label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: h ? 'brightness(0.4) saturate(0.7)' : 'brightness(0.6) saturate(0.7)', transform: h ? 'scale(1.06)' : 'scale(1)', transition: 'all 0.5s ease' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,15,13,0.85) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: T.text }}>{space.label}</h3>
      </div>
    </div>
  );
};

// ── Highlight Card ──
const HighlightCard = ({ glyph, title, desc }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: '32px 24px', background: h ? T.goldMuted : T.surface, border: `1px solid ${h ? 'rgba(198,162,100,0.2)' : T.border}`, borderRadius: 2, transition: 'all 0.25s ease', cursor: 'default' }}
    >
      <div style={{ fontSize: 22, color: h ? T.gold : T.textMuted, marginBottom: 20, transition: 'color 0.25s' }}>{glyph}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 300, fontStyle: 'italic', color: T.text, marginBottom: 10 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8 }}>{desc}</p>
    </div>
  );
};

// ── Testimonial Card ──
const TestiCard = ({ t }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
    <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
      {Array(5).fill(0).map((_, i) => <span key={i} style={{ color: T.gold, fontSize: 12 }}>★</span>)}
    </div>
    <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 300, fontStyle: 'italic', color: T.textSecondary, lineHeight: 1.75, marginBottom: 28, flex: 1 }}>"{t.quote}"</blockquote>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{t.initials}</span>
      </div>
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, color: T.text }}>{t.name}</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, color: T.textMuted, letterSpacing: '0.05em' }}>{t.role}</p>
      </div>
    </div>
  </div>
);

export default Home;