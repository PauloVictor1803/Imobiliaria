const fs = require('fs');
let code = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

code = code.replace(
  "case 'restaurant': \n    case 'pizzeria': return `<svg",
  "case 'restaurant': return `<svg"
);

fs.writeFileSync('src/components/MapArea.tsx', code);
