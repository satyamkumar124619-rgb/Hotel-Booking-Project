const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // T object background colors
  { regex: /bg:\s*['"]#fdfdfd['"]/g, replace: "bg: '#0A0A08'" },
  { regex: /surface:\s*['"]#ffffff['"]/g, replace: "surface: '#131310'" },
  { regex: /surfaceAlt:\s*['"]#f8fafc['"]/g, replace: "surfaceAlt: '#0F0F0C'" },
  
  // T object text colors
  { regex: /text:\s*['"]#0f172a['"]/g, replace: "text: '#F0EDE6'" },
  { regex: /textMuted:\s*['"]rgba\(15,23,42,([0-9.]+)['"]/g, replace: "textMuted: 'rgba(240,237,230,$1'" },
  { regex: /textSecondary:\s*['"]rgba\(15,23,42,([0-9.]+)['"]/g, replace: "textSecondary: 'rgba(240,237,230,$1'" },
  
  // Borders
  { regex: /border:\s*['"]rgba\(0,0,0,0\.08\)['"]/g, replace: "border: 'rgba(255,255,255,0.06)'" },

  // Inline backgrounds that are dark
  { regex: /background:\s*['"]#fdfdfd['"]/g, replace: "background: '#0E0F0D'" },
  { regex: /background:\s*['"]#ffffff['"]/g, replace: "background: '#161714'" },
  
  // Overlays (light trans back to dark trans)
  // Be VERY careful here not to clobber real white text or real white borders if any were left as rgba(255,...)
  // But since the original script did: rgba(10,10,8,X) -> rgba(255,255,255,X)
  // Most of those overlays are likely 0.85, 0.9, 0.75, 0.65
  // We'll revert them manually or loosely for the exact background properties we changed.
  { regex: /background:\s*['"]rgba\(255,255,255,([0-9.]+)['"]/g, replace: "background: 'rgba(14,15,13,$1'" },
  
  // Reverting strings that were 'rgba(10,10,8,X)' or 'rgba(14,15,13,X)' we unfortunately made all them 'rgba(255,255,255,X)'.
  // If we just flip all 'rgba(255,255,255,' to 'rgba(14,15,13,' we break any genuine white stuff.
  // We'll target linear-gradients specifically because that's where they lived
  { regex: /linear-gradient\(([^,]+), rgba\(255,255,255,([0-9.]+)\) ([0-9]+%), rgba\(255,255,255,([0-9.]+)\) ([0-9]+%)\)/g, replace: "linear-gradient($1, rgba(14,15,13,$2) $3, rgba(14,15,13,$4) $5)" },
  { regex: /linear-gradient\(([^,]+), rgba\(255,255,255,([0-9.]+)\)/g, replace: "linear-gradient($1, rgba(14,15,13,$2)" },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replace);
      }
      
      // Also a specific fix for Gallery.jsx which had T = bg: #0E0F0D
      if (file === 'Gallery.jsx') {
          content = content.replace(/bg:\s*['"]#0A0A08['"]/g, "bg: '#0E0F0D'");
          content = content.replace(/surface:\s*['"]#131310['"]/g, "surface: '#161714'");
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Reverted theme in ${file}`);
      }
    }
  });
}

processDirectory(srcDir);
console.log('Done reverting light colors back to dark colors.');
