import React from 'react';
import { Link } from 'react-router-dom';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C6A264',
  goldMuted: 'rgba(198,162,100,0.08)',
  goldBorder: 'rgba(198,162,100,0.15)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    Explore: [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Rooms & Suites', to: '/rooms' },
      { label: 'Services', to: '/services' },
      { label: 'Gallery', to: '/gallery' },
    ],
    Reservations: [
      { label: 'Book a Room', to: '/booking' },
      { label: 'Sign In', to: '/signin' },
      { label: 'Register', to: '/register' },
      { label: 'Contact Us', to: '/contact' },
    ],
  };

  const contacts = [
    { icon: '◎', label: '123 Luxury Avenue, Mumbai, India' },
    { icon: '◈', label: '+91 98765 43210' },
    { icon: '◇', label: 'hello@luxuryhotel.com' },
    { icon: '◆', label: 'Open 24 hours, 7 days a week' },
  ];

  return (
    <>
      <style>{fonts}</style>
      <footer style={{
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Top Section */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 40px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, border: `1px solid ${T.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: T.gold, fontSize: 16 }}>◆</span>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold }}>Luxury Hotel</p>
                  <p style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted, fontWeight: 300 }}>Est. 1995</p>
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.8, maxWidth: 280, marginBottom: 28 }}>
                Experience the pinnacle of luxury hospitality. Where every detail is crafted for your comfort and every moment becomes a cherished memory.
              </p>
              {/* Newsletter */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 12 }}>Newsletter</p>
                <div style={{ display: 'flex', gap: 0 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      flex: 1, padding: '10px 14px',
                      background: T.bg, border: `1px solid ${T.border}`,
                      borderRight: 'none', color: T.text,
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                      fontWeight: 300, outline: 'none',
                    }}
                  />
                  <button style={{
                    padding: '10px 16px', background: T.gold,
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    fontWeight: 500, color: '#0E0F0D',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Links */}
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, marginBottom: 20 }}>{title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map((item) => (
                    <Link key={item.label} to={item.to} style={{
                      fontSize: 13, fontWeight: 300, color: T.textSecondary,
                      textDecoration: 'none', letterSpacing: '0.02em',
                      transition: 'color 0.2s ease',
                    }}
                      onMouseEnter={e => e.target.style.color = T.gold}
                      onMouseLeave={e => e.target.style.color = T.textSecondary}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, marginBottom: 20 }}>Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {contacts.map((c) => (
                  <div key={c.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: T.gold, fontSize: 12, marginTop: 2, minWidth: 16 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 300, color: T.textSecondary, lineHeight: 1.6 }}>{c.label}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 12 }}>Follow Us</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['◈', '◇', '◉', '◆'].map((icon, i) => (
                    <div key={i} style={{
                      width: 32, height: 32,
                      border: `1px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = T.goldMuted; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ color: T.textMuted, fontSize: 14 }}>{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${T.border}` }} />

        {/* Bottom */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 300, color: T.textMuted, letterSpacing: '0.04em' }}>
            © {currentYear} Luxury Hotel. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <span key={item} style={{ fontSize: 11, fontWeight: 300, color: T.textMuted, cursor: 'pointer', letterSpacing: '0.04em' }}
                onMouseEnter={e => e.target.style.color = T.gold}
                onMouseLeave={e => e.target.style.color = T.textMuted}
              >{item}</span>
            ))}
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: 'italic', fontWeight: 300, color: T.textMuted }}>
            "Experience Excellence"
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;