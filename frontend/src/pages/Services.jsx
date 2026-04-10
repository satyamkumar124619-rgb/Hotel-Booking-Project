import React, { useState } from 'react';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceHover: '#1C1D1A',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(198,162,100,0.5)',
  borderHover: 'rgba(198,162,100,0.2)',
  gold: '#C6A264',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
  save: 'rgba(107,158,122,0.15)',
  saveBorder: 'rgba(107,158,122,0.3)',
  saveText: '#6B9E7A',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
`;

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: T.gold,
  display: 'block',
};

const SectionHeader = ({ eyebrow, title, subtitle, center = false }) => (
  <div style={{ marginBottom: 56, textAlign: center ? 'center' : 'left' }}>
    <p style={{ ...label, marginBottom: 16 }}>{eyebrow}</p>
    <h2 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 44, fontWeight: 300,
      color: T.text, letterSpacing: '-0.015em',
      lineHeight: 1.1, marginBottom: 16,
    }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, fontWeight: 300,
        color: T.textSecondary, lineHeight: 1.8,
        maxWidth: 520,
        margin: center ? '0 auto' : undefined,
      }}>{subtitle}</p>
    )}
    <div style={{
      width: 32, height: 1,
      background: T.gold, opacity: 0.4,
      marginTop: 20,
      margin: center ? '20px auto 0' : '20px 0 0',
    }} />
  </div>
);

const serviceCategories = [
  { id: 'all',           name: 'All Services' },
  { id: 'dining',        name: 'Dining' },
  { id: 'wellness',      name: 'Wellness' },
  { id: 'business',      name: 'Business' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'transport',     name: 'Transport' },
];

const services = [
  { name: 'Fine Dining Restaurant',  description: 'Award-winning cuisine with panoramic city views. Open for breakfast, lunch, and dinner.', glyph: '◇', category: 'dining',        features: ['Michelin-star chef', 'City views', 'Live music', 'Private dining'],           price: '₹2,500 / person' },
  { name: 'Executive Lounge',        description: 'Exclusive lounge for premium guests with complimentary snacks and beverages.',            glyph: '◈', category: 'dining',        features: ['Complimentary', 'Premium guests', 'Business meetings', 'Evening cocktails'],   price: 'Included' },
  { name: 'Luxury Spa & Wellness',   description: 'Full-service spa with traditional and modern treatments in serene surroundings.',         glyph: '◎', category: 'wellness',      features: ['Massage therapy', 'Facial treatments', 'Yoga classes', 'Meditation garden'],  price: '₹5,000 / session' },
  { name: 'Fitness Center',          description: 'State-of-the-art gym with personal trainers and group fitness classes.',                  glyph: '◐', category: 'wellness',      features: ['24/7 access', 'Personal training', 'Group classes', 'Modern equipment'],      price: 'Included' },
  { name: 'Infinity Swimming Pool',  description: 'Rooftop infinity pool with breathtaking views and attentive poolside service.',           glyph: '◉', category: 'wellness',      features: ['Infinity edge', 'City skyline view', 'Pool bar', 'Heated water'],             price: 'Included' },
  { name: 'Business Center',         description: 'Fully equipped business center with high-speed internet and meeting facilities.',         glyph: '◆', category: 'business',      features: ['High-speed WiFi', 'Meeting rooms', 'Printing services', 'Video conferencing'], price: '₹500 / hour' },
  { name: '24/7 Concierge',          description: 'Personalised concierge service available round the clock for all your needs.',            glyph: '◈', category: 'business',      features: ['24/7 availability', 'Tour bookings', 'Restaurant reservations', 'Transport'], price: 'Included' },
  { name: 'In-Room Entertainment',   description: 'Premium entertainment system with streaming services and gaming consoles.',               glyph: '◇', category: 'entertainment', features: ['4K streaming', 'Gaming consoles', 'Sound system', 'Movie library'],           price: 'Included' },
  { name: 'Rooftop Bar & Lounge',    description: 'Exclusive rooftop bar with craft cocktails and live entertainment.',                      glyph: '◎', category: 'entertainment', features: ['Craft cocktails', 'Live music', 'City views', 'Private events'],              price: '₹1,200 / person' },
  { name: 'Airport Transfer',        description: 'Luxury airport transfers with professional chauffeurs and premium vehicles.',             glyph: '◐', category: 'transport',     features: ['Private chauffeur', 'Luxury vehicles', 'Meet & greet', 'Flight tracking'],    price: '₹3,500 / way' },
  { name: 'City Tours',              description: 'Guided city tours and excursions arranged by our expert concierge team.',                 glyph: '◉', category: 'transport',     features: ['Expert guides', 'Private tours', 'Cultural sites', 'Flexible scheduling'],    price: '₹8,000 / person' },
  { name: 'Valet Parking',           description: 'Secure valet parking service with 24/7 vehicle monitoring.',                             glyph: '◆', category: 'transport',     features: ['Secure parking', 'Vehicle wash', '24/7 monitoring', 'Electric charging'],     price: '₹200 / night' },
];

const packages = [
  { title: 'Wellness Retreat',  subtitle: 'Spa session + fitness classes + healthy dining', price: '₹12,000', unit: 'per person' },
  { title: 'Business Package',  subtitle: 'Meeting room + executive lounge + transport',    price: '₹8,500',  unit: 'per day' },
  { title: 'Family Experience', subtitle: 'Family room + kids activities + dining',         price: '₹15,000', unit: 'per family' },
];

const ServiceCard = ({ service, index }) => {
  const [hovered, setHovered] = useState(false);
  const isPaid = !service.price.toLowerCase().includes('included');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 4,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s ease',
        animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
        cursor: 'default',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
          <div style={{
            width: 40, height: 40, flexShrink: 0,
            border: `1px solid ${hovered ? T.borderHover : T.border}`,
            borderRadius: 2, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: hovered ? T.goldMuted : 'transparent',
            transition: 'all 0.25s ease',
          }}>
            <span style={{ fontSize: 16, color: hovered ? T.gold : T.textMuted, transition: 'color 0.25s' }}>{service.glyph}</span>
          </div>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 300,
            fontStyle: 'italic', color: T.text,
            lineHeight: 1.2,
          }}>{service.name}</h3>
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 300,
          color: T.textSecondary, lineHeight: 1.8,
          marginBottom: 22,
        }}>{service.description}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 28 }}>
          {service.features.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.gold, opacity: 0.5, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: T.textMuted, letterSpacing: '0.03em' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 20, borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 300, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {isPaid ? 'Starting from' : 'Pricing'}
        </span>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 300,
          color: isPaid ? T.text : T.saveText,
          letterSpacing: '-0.01em',
        }}>{service.price}</span>
      </div>
    </div>
  );
};

const PackageCard = ({ pkg }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.goldMuted : T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 4, padding: '36px 28px',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
    >
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22, fontWeight: 300,
        fontStyle: 'italic', color: T.text,
        marginBottom: 10,
      }}>{pkg.title}</h3>
      <div style={{ width: 20, height: 1, background: T.gold, opacity: 0.4, margin: '0 auto 14px' }} />
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, fontWeight: 300,
        color: T.textMuted, lineHeight: 1.7,
        marginBottom: 24, letterSpacing: '0.02em',
      }}>{pkg.subtitle}</p>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 34, fontWeight: 300,
        color: T.gold, letterSpacing: '-0.01em',
        lineHeight: 1, marginBottom: 6,
      }}>{pkg.price}</p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, fontWeight: 300,
        color: T.textMuted, letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>{pkg.unit}</p>
    </div>
  );
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Hero */}
        <section style={{
          background: T.surfaceAlt,
          borderBottom: `1px solid ${T.border}`,
          padding: '80px 40px',
          textAlign: 'center',
          animation: 'fadeUp 0.6s ease',
        }}>
          <p style={{ ...label, marginBottom: 18 }}>What we offer</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 62, fontWeight: 300,
            color: T.text, letterSpacing: '-0.02em',
            lineHeight: 1.05, marginBottom: 18,
          }}>
            Premium <span style={{ fontStyle: 'italic' }}>Services</span>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 300,
            color: T.textSecondary, lineHeight: 1.8,
            maxWidth: 480, margin: '0 auto',
          }}>
            Indulge in luxury and convenience with our world-class amenities and personalised service.
          </p>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>

          {/* Category filter */}
          <div style={{ padding: '48px 0 0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {serviceCategories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '9px 20px',
                      background: active ? T.goldMuted : 'transparent',
                      border: `1px solid ${active ? 'rgba(198,162,100,0.3)' : T.border}`,
                      borderRadius: 2,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11, fontWeight: active ? 500 : 300,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: active ? T.gold : T.textMuted,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.textSecondary; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result count */}
          <div style={{ padding: '32px 0 40px', borderBottom: `1px solid ${T.border}` }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 300,
              color: T.text,
            }}>
              {filtered.length} <span style={{ fontStyle: 'italic' }}>
                {activeCategory === 'all'
                  ? 'services available'
                  : serviceCategories.find(c => c.id === activeCategory)?.name + ' services'}
              </span>
            </p>
          </div>

          {/* Services grid */}
          <section style={{ padding: '56px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {filtered.map((s, i) => (
                <ServiceCard key={s.name} service={s} index={i} />
              ))}
            </div>
          </section>

          <div style={{ height: 1, background: T.border }} />

          {/* Packages */}
          <section style={{ padding: '80px 0' }}>
            <SectionHeader
              eyebrow="Exclusive combinations"
              title={<>Special <span style={{ fontStyle: 'italic' }}>Packages</span></>}
              subtitle="Curated bundles for the ultimate stay — designed to give you more for less."
              center
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {packages.map((pkg) => <PackageCard key={pkg.title} pkg={pkg} />)}
            </div>
          </section>

          <div style={{ height: 1, background: T.border }} />

          {/* CTA */}
          <section style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{ ...label, marginBottom: 18 }}>Get in touch</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 44, fontWeight: 300,
              color: T.text, letterSpacing: '-0.015em',
              lineHeight: 1.1, marginBottom: 16,
            }}>
              Experience Luxury <span style={{ fontStyle: 'italic' }}>Like Never Before</span>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 300,
              color: T.textSecondary, lineHeight: 1.8,
              maxWidth: 480, margin: '0 auto 40px',
            }}>
              Our dedicated team is here to make your stay extraordinary. Contact us to customise your perfect experience.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  padding: '13px 32px',
                  background: T.gold,
                  border: `1px solid ${T.gold}`,
                  borderRadius: 2,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#0E0F0D', cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Request Concierge
              </button>
              <button
                style={{
                  padding: '13px 32px',
                  background: 'transparent',
                  border: `1px solid ${T.border}`,
                  borderRadius: 2,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 300,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: T.textMuted, cursor: 'pointer',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.textSecondary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
              >
                Send Inquiry
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Services;