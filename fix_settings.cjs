const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');

// Fix duplicated interface props
content = content.replace(/  onSave\?: \(\) => void;\n  isSaving\?: boolean;\n/g, '');
content = content.replace(
  'onClose?: () => void;',
  'onClose?: () => void;\n  onSave?: () => void;\n  isSaving?: boolean;'
);

fs.writeFileSync('src/components/SettingsPanel.tsx', content);
