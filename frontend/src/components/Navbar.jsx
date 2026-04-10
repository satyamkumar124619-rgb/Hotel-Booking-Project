import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const T = {
  bg: '#0A0A08',
  bgScrolled: 'rgba(10,10,8,0.96)',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C6A264',
  goldMuted: 'rgba(198,162,100,0.1)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.45)',
  textSecondary: 'rgba(240,237,230,0.65)',
  danger: 'rgba(192,113,90,0.8)',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
`;

// ── BookNowButton defined first to avoid hoisting issues ──
const BookNowButton = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to="/booking"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 18px', background:hovered?'#D4B97E':T.gold, borderRadius:2, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:'#0E0F0D', textDecoration:'none', transition:'background 0.2s ease', whiteSpace:'nowrap', flexShrink:0 }}
    >
      Reserve <span style={{ fontSize:14, opacity:0.7 }}>→</span>
    </Link>
  );
};

const NavLink = ({ to, children, active }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 400,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: active ? T.gold : hovered ? T.text : T.textSecondary,
        textDecoration: 'none', padding: '6px 0',
        position: 'relative', transition: 'color 0.2s ease', whiteSpace: 'nowrap',
      }}
    >
      {children}
      {active && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: T.gold, opacity: 0.6 }} />}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: hovered ? T.gold : T.textSecondary,
        textDecoration: 'none', padding: '14px 0',
        borderBottom: `1px solid ${T.border}`, transition: 'color 0.2s ease',
      }}
    >
      {hovered && <span style={{ display: 'inline-block', width: 16, height: 1, background: T.gold, flexShrink: 0 }} />}
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // ✅ Auth state from AuthContext — not from broken localStorage keys
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/admin');
  };

  const isActive = (p) => location.pathname === p;

  const mainLinks = [
    { to: '/',         label: 'Home' },
    { to: '/about',    label: 'About' },
    { to: '/rooms',    label: 'Rooms' },
    { to: '/services', label: 'Services' },
    { to: '/gallery',  label: 'Gallery' },
    { to: '/contact',  label: 'Contact' },
  ];

  return (
    <>
      <style>{fonts}</style>
      <style>{`
        .nb-desktop   { display: flex; align-items: center; gap: 20px; }
        .nb-burger    { display: none !important; }
        .nb-logo-text { display: none; }
        @media (max-width: 1100px) {
          .nb-desktop { display: none !important; }
          .nb-burger  { display: flex !important; }
        }
        @media (min-width: 1101px) {
          .nb-logo-text { display: block; }
        }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? T.bgScrolled : T.bg,
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : T.border}`,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <img src="/logo.svg" alt="Luxury Hotel" style={{ height: 36, width: 'auto', filter: 'brightness(0.9)' }} />
              <div className="nb-logo-text">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: T.text, lineHeight: 1.1, letterSpacing: '0.04em' }}>Luxury Hotel</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 300, color: T.gold, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Experience Excellence</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="nb-desktop">
              {mainLinks.map((l) => (
                <NavLink key={l.to} to={l.to} active={isActive(l.to)}>{l.label}</NavLink>
              ))}

              <span style={{ width: 1, height: 16, background: T.border, flexShrink: 0 }} />

              {/* Admin section */}
              {isAdmin ? (
                <>
                  <NavLink to="/admin/dashboard" active={isActive('/admin/dashboard')}>Dashboard</NavLink>
                  <button onClick={handleAdminLogout}
                    style={{ background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:T.textMuted, padding:'6px 0', transition:'color 0.2s', whiteSpace:'nowrap' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = T.danger}
                    onMouseLeave={(e) => e.currentTarget.style.color = T.textMuted}
                  >Logout</button>
                </>
              ) : (
                <NavLink to="/admin" active={isActive('/admin')}>Admin</NavLink>
              )}

              {/* User sign in/out */}
              {isAuthenticated && !isAdmin ? (
                <>
                  <NavLink to="/my-bookings" active={isActive('/my-bookings')}>My Bookings</NavLink>
                  <button onClick={handleLogout}
                    style={{ background:'none', border:`1px solid rgba(192,113,90,0.5)`, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:T.danger, padding:'7px 14px', borderRadius:2, transition:'all 0.2s', whiteSpace:'nowrap' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192,113,90,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >Sign Out</button>
                </>
              ) : !isAuthenticated ? (
                <Link to="/signin"
                  style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:T.gold, textDecoration:'none', padding:'7px 14px', border:`1px solid ${T.gold}`, borderRadius:2, whiteSpace:'nowrap', background:'transparent', transition:'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.goldMuted}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >Sign In</Link>
              ) : null}

              <BookNowButton />
            </div>

            {/* Hamburger */}
            <button onClick={() => setIsOpen(!isOpen)} className="nb-burger"
              style={{ background:'none', border:`1px solid ${isOpen ? T.gold : T.border}`, borderRadius:2, width:38, height:38, cursor:'pointer', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, padding:10, transition:'border-color 0.2s' }}
              aria-label="Toggle menu"
            >
              <span style={{ display:'block', width:16, height:1, background:isOpen?T.gold:T.textSecondary, transition:'all 0.25s ease', transform:isOpen?'rotate(45deg) translateY(6px)':'none' }} />
              <span style={{ display:'block', width:16, height:1, background:isOpen?T.gold:T.textSecondary, transition:'all 0.25s ease', opacity:isOpen?0:1 }} />
              <span style={{ display:'block', width:16, height:1, background:isOpen?T.gold:T.textSecondary, transition:'all 0.25s ease', transform:isOpen?'rotate(-45deg) translateY(-6px)':'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div style={{ background:T.bg, borderTop:`1px solid ${T.border}`, padding:'8px 24px 32px', animation:'slideDown 0.25s ease' }}>
            {mainLinks.map((l) => (
              <MobileNavLink key={l.to} to={l.to} onClick={() => setIsOpen(false)}>{l.label}</MobileNavLink>
            ))}

            {isAdmin ? (
              <>
                <MobileNavLink to="/admin/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
                <button onClick={() => { setIsOpen(false); handleAdminLogout(); }}
                  style={{ display:'block', width:'100%', textAlign:'left', background:'none', border:'none', borderBottom:`1px solid ${T.border}`, padding:'14px 0', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:300, letterSpacing:'0.1em', textTransform:'uppercase', color:T.danger, cursor:'pointer' }}
                >Logout</button>
              </>
            ) : (
              <MobileNavLink to="/admin" onClick={() => setIsOpen(false)}>Admin</MobileNavLink>
            )}

            {isAuthenticated && !isAdmin ? (
              <button onClick={() => { setIsOpen(false); handleLogout(); }}
                style={{ display:'block', width:'100%', textAlign:'left', background:'none', border:'none', borderBottom:`1px solid ${T.border}`, padding:'14px 0', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:300, letterSpacing:'0.1em', textTransform:'uppercase', color:T.danger, cursor:'pointer' }}
              >Sign Out</button>
            ) : !isAuthenticated ? (
              <MobileNavLink to="/signin" onClick={() => setIsOpen(false)}>Sign In</MobileNavLink>
            ) : null}

            <div style={{ paddingTop:24 }}>
              <Link to="/booking" onClick={() => setIsOpen(false)}
                style={{ display:'block', padding:'14px 24px', background:T.gold, borderRadius:2, textAlign:'center', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:'#0E0F0D', textDecoration:'none' }}
              >Reserve a Room</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;