import React, { useState } from 'react';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(198,162,100,0.55)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
  success: 'rgba(107,158,122,0.12)',
  successBorder: 'rgba(107,158,122,0.35)',
  successText: '#6B9E7A',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  textarea { resize: vertical; }
`;

const labelStyle = {
  display: 'block',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: T.textMuted,
  marginBottom: 8,
};

const FieldInput = ({ label, type = 'text', name, value, onChange, required, placeholder, multiline, rows = 5 }) => {
  const [focused, setFocused] = useState(false);
  const shared = {
    width: '100%',
    background: focused ? '#1C1D1A' : T.surface,
    border: `1px solid ${focused ? T.borderFocus : T.border}`,
    borderRadius: 2,
    padding: '13px 16px',
    color: T.text,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 300,
    letterSpacing: '0.02em',
    outline: 'none',
    transition: 'all 0.2s ease',
    display: 'block',
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline
        ? <textarea name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} rows={rows} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...shared, lineHeight: 1.7 }} />
        : <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={shared} />
      }
    </div>
  );
};

const ContactInfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: T.gold }}>
      {icon}
    </div>
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: T.textSecondary, lineHeight: 1.6 }}>{value}</p>
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '80px 40px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 64, animation: 'fadeUp 0.5s ease' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, marginBottom: 16 }}>Get in touch</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 14 }}>
              Contact <span style={{ fontStyle: 'italic' }}>Us</span>
            </h1>
            <p style={{ fontSize: 14, fontWeight: 300, color: T.textSecondary, lineHeight: 1.75, maxWidth: 440 }}>Reach out for any inquiries, reservations, or special requests — our team is always at your service.</p>
            <div style={{ width: 32, height: 1, background: T.gold, opacity: 0.4, marginTop: 20 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

            {/* Form */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: '44px 40px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, fontStyle: 'italic', color: T.text, marginBottom: 32 }}>Send a message</h2>

              {sent && (
                <div style={{ padding: '13px 16px', background: T.success, border: `1px solid ${T.successBorder}`, borderRadius: 2, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: T.successText, fontSize: 14 }}>✓</span>
                  <p style={{ fontSize: 13, color: T.successText, fontWeight: 300 }}>Message sent — we'll be in touch soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <FieldInput label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                  <FieldInput label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <FieldInput label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required />
                <FieldInput label="Message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more…" required multiline rows={5} />

                <button
                  type="submit"
                  onMouseEnter={() => setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                  style={{
                    padding: '14px 24px',
                    background: btnHovered ? T.goldLight : T.gold,
                    border: `1px solid ${T.gold}`,
                    borderRadius: 2,
                    color: '#0E0F0D',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  Send message
                  <span style={{ fontSize: 14, opacity: 0.6 }}>→</span>
                </button>
              </form>
            </div>

            {/* Contact info + map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: '40px' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, fontStyle: 'italic', color: T.text, marginBottom: 32 }}>Contact information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <ContactInfoRow
                    icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                    label="Address"
                    value="123 Luxury Street, Downtown City, ST 12345"
                  />
                  <ContactInfoRow
                    icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>}
                    label="Phone"
                    value="+91 92635 46350"
                  />
                  <ContactInfoRow
                    icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                    label="Email"
                    value="info@luxuryhotel.com"
                  />
                </div>
              </div>

              {/* Map */}
              <div style={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.241264875458!2d-73.98710668459375!3d40.75889597932781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1633024000000!5m2!1sen!2sus"
                  width="100%"
                  height="240"
                  style={{ border: 0, display: 'block', filter: 'grayscale(0.6) invert(0.9) hue-rotate(180deg) brightness(0.85)' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Hotel Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contact;