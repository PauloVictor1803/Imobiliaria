const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

code = code.replace(
  "maximumFractionDigits: 0,",
  "minimumFractionDigits: 2,\n      maximumFractionDigits: 2,"
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
