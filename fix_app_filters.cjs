const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const matchesBathrooms = filters\.bathrooms === null \|\| \(p\.bathrooms !== undefined && p\.bathrooms >= filters\.bathrooms\);/,
  "const matchesBathrooms = filters.bathrooms === null || (p.bathrooms !== undefined && p.bathrooms === filters.bathrooms);"
);

code = code.replace(
  /const matchesGarages = filters\.garages === null \|\| \(p\.garages !== undefined && p\.garages >= filters\.garages\);/,
  "const matchesGarages = filters.garages === null || (p.garages !== undefined && p.garages === filters.garages);"
);

fs.writeFileSync('src/App.tsx', code);
