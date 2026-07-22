const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');

// Remove the button
content = content.replace(
  /\{\s*onSave && \(\s*<button[\s\S]*?<\/button>\s*\)\s*\}/,
  ''
);

fs.writeFileSync('src/components/SettingsPanel.tsx', content);
