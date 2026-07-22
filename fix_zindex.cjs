const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

code = code.replace(
  'className="absolute flex items-center justify-center group"',
  'className="absolute flex items-center justify-center group hover:z-50"'
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
