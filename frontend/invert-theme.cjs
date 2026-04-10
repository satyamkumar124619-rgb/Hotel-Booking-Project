const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // T object background colors
  { regex: /bg:\s*['"]#0[A-Z0-9a-z]{5}['"]/g, replace: "bg: '#fdfdfd'" },
  { regex: /surface:\s*['"]#1[A-Z0-9a-z]{5}['"]/g, replace: "surface: '#ffffff'" },
  { regex: /surfaceAlt:\s*['"]#0[A-Z0-9a-z]{5}['"]/g, replace: "surfaceAlt: '#f8fafc'" },
  
  // T object text colors
  { regex: /text:\s*['"]#[EF][A-Z0-9a-z]{5}['"]/g, replace: "text: '#0f172a'" },
  { regex: /textMuted:\s*['"]rgba\(2[0-9]{2},2[0-9]{2},2[0-9]{2},([0-9.]+)['"]/g, replace: "textMuted: 'rgba(15,23,42,$1'" },
  { regex: /textSecondary:\s*['"]rgba\(2[0-9]{2},2[0-9]{2},2[0-9]{2},([0-9.]+)['"]/g, replace: "textSecondary: 'rgba(15,23,42,$1'" },
  
  // Borders
  { regex: /border:\s*['"]rgba\(255,255,255,([0-9.]+)['"]/g, replace: "border: 'rgba(0,0,0,0.08)'" },

  // Inline backgrounds that are dark
  { regex: /background:\s*['"]#0[A-Z0-9a-z]{5}['"]/g, replace: "background: '#fdfdfd'" },
  { regex: /background:\s*['"]#1[A-Z0-9a-z]{5}['"]/g, replace: "background: '#ffffff'" },
  
  // Overlays (dark trans to light trans)
  { regex: /background:\s*['"]rgba\(10,10,8,([0-9.]+)['"]/g, replace: "background: 'rgba(255,255,255,$1'" },
  { regex: /background:\s*['"]rgba\(14,15,13,([0-9.]+)['"]/g, replace: "background: 'rgba(255,255,255,$1'" },
  { regex: /rgba\(10,10,8,([0-9.]+)\)/g, replace: "rgba(255,255,255,$1)" },
  { regex: /rgba\(14,15,13,([0-9.]+)\)/g, replace: "rgba(255,255,255,$1)" },
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
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated theme in ${file}`);
      }
    }
  });
}

processDirectory(srcDir);
console.log('Done mapping dark colors to light colors.');
