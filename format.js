const fs = require('fs');

let home = fs.readFileSync('c:/Users/satya/OneDrive/Desktop/Hotel Booking Project/frontend/src/pages/Home.jsx', 'utf8');

// Add CSS classes into fonts
home = home.replace('</style>', `
  .resp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .resp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .resp-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .resp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin-bottom: 16px; }
  .resp-cta { display: grid; grid-template-columns: 1fr auto; gap: 56px; align-items: center; }
  .resp-welcome { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; }
  .resp-spaces-right { display: grid; grid-template-rows: 1fr 1fr; gap: 8px; }
  .resp-spaces-right-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  
  @media (max-width: 1024px) {
    .resp-grid-2 { grid-template-columns: 1fr; gap: 48px; }
    .resp-grid-3 { grid-template-columns: repeat(2, 1fr); }
    .resp-grid-4 { grid-template-columns: repeat(2, 1fr); }
    .resp-cta { grid-template-columns: 1fr; text-align: center; }
    .resp-cta > div:last-child { align-items: center !important; }
    .section-wrap { padding: 64px 24px !important; }
  }
  @media (max-width: 768px) {
    .resp-grid-3 { grid-template-columns: 1fr; }
    .resp-grid-4 { grid-template-columns: 1fr; }
    .resp-stats { grid-template-columns: 1fr; gap: 8px; background: transparent; border: none; }
    .resp-stats > div { border: 1px solid rgba(255,255,255,0.06); border-radius: 2px; }
    .resp-welcome { flex-direction: column; gap: 20px; align-items: flex-start; }
    .resp-spaces-right-inner { grid-template-columns: 1fr; }
    h1 { font-size: 42px !important; }
    h2 { font-size: 36px !important; }
  }
</style>`);

// Replace inline styles with classNames where applicable
home = home.replace("style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}", 'className="resp-grid-2"');
home = home.replace("style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}", 'className="resp-grid-3"');
home = home.replace("style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}", 'className="resp-grid-3" style={{ marginBottom: 40 }}');
home = home.replace("style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}", 'className="resp-grid-4"');
home = home.replace("style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}", 'className="resp-stats"');
home = home.replace("style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}", 'className="resp-welcome" style={{ maxWidth: 1160, margin: \\'0 auto\\', padding: \\'28px 40px\\' }}');
home = home.replace("style={{ position: 'relative', maxWidth: 1160, margin: '0 auto', padding: '88px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 56, alignItems: 'center', zIndex: 1 }}", 'className="resp-cta" style={{ position: \\'relative\\', maxWidth: 1160, margin: \\'0 auto\\', padding: \\'88px 40px\\', zIndex: 1 }}');

home = home.replace("style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}", 'className="resp-spaces-right-inner"');
home = home.replace("style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}", 'className="resp-spaces-right"');
// Note: spaces parent also has "display: grid, gridTemplateColumns: 1fr 1fr, gap: 8" which we replaced
home = home.replace("style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}", 'className="resp-grid-2" style={{ gap: 8 }}');

home = home.replace("const SectionWrap = ({ children, pad }) => (\\n  <div style={{ maxWidth: 1160, margin: '0 auto', padding: pad || '96px 40px' }}>{children}</div>", "const SectionWrap = ({ children, pad }) => (\\n  <div className=\\\"section-wrap\\\" style={{ maxWidth: 1160, margin: '0 auto', padding: pad || '96px 40px' }}>{children}</div>");

fs.writeFileSync('c:/Users/satya/OneDrive/Desktop/Hotel Booking Project/frontend/src/pages/Home.jsx', home);
console.log('done');
