const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

code = code.replace(
  "const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=br`);",
  "const cleanQuery = query.replace(/\\\\b(bairro)\\\\b/gi, '').trim();\n      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=5&countrycodes=br`);"
);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
