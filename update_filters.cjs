const fs = require('fs');

let searchBarCode = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

searchBarCode = searchBarCode.replace(
  /<option value="1">1\+ Quartos<\/option>\s*<option value="2">2\+ Quartos<\/option>\s*<option value="3">3\+ Quartos<\/option>\s*<option value="4">4\+ Quartos<\/option>/,
  '<option value="1">1 Quarto</option>\n                <option value="2">2 Quartos</option>\n                <option value="3">3 Quartos</option>\n                <option value="4">4+ Quartos</option>'
);

searchBarCode = searchBarCode.replace(
  /<option value="1">1 Banheiro<\/option>\s*<option value="2">2 Banheiros<\/option>\s*<option value="3">3 Banheiros<\/option>/,
  '<option value="1">1 Banheiro</option>\n                <option value="2">2 Banheiros</option>\n                <option value="3">3 Banheiros</option>\n                <option value="4">4+ Banheiros</option>'
);

searchBarCode = searchBarCode.replace(
  /<option value="1">1 Vaga<\/option>\s*<option value="2">2 Vagas<\/option>\s*<option value="3">3 Vagas<\/option>/,
  '<option value="1">1 Vaga</option>\n                <option value="2">2 Vagas</option>\n                <option value="3">3 Vagas</option>\n                <option value="4">4+ Vagas</option>'
);

fs.writeFileSync('src/components/SearchBar.tsx', searchBarCode);


let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  /const matchesBedrooms = filters\.bedrooms === null \|\| \(p\.bedrooms !== undefined && p\.bedrooms >= filters\.bedrooms\);/,
  "const matchesBedrooms = filters.bedrooms === null || (p.bedrooms !== undefined && (filters.bedrooms === 4 ? p.bedrooms >= 4 : p.bedrooms === filters.bedrooms));"
);

appCode = appCode.replace(
  /const matchesBathrooms = filters\.bathrooms === null \|\| \(p\.bathrooms !== undefined && p\.bathrooms === filters\.bathrooms\);/,
  "const matchesBathrooms = filters.bathrooms === null || (p.bathrooms !== undefined && (filters.bathrooms === 4 ? p.bathrooms >= 4 : p.bathrooms === filters.bathrooms));"
);

appCode = appCode.replace(
  /const matchesGarages = filters\.garages === null \|\| \(p\.garages !== undefined && p\.garages === filters\.garages\);/,
  "const matchesGarages = filters.garages === null || (p.garages !== undefined && (filters.garages === 4 ? p.garages >= 4 : p.garages === filters.garages));"
);

fs.writeFileSync('src/App.tsx', appCode);
