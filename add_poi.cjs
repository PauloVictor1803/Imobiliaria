const fs = require('fs');

// 1. Add kindergarten to POIType
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(
  "'grocery_store';",
  "'grocery_store' | 'kindergarten';"
);
fs.writeFileSync('src/types.ts', types);

// 2. Add kindergarten to App.tsx activePoiTypes
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  "'health_center', 'grocery_store'",
  "'health_center', 'grocery_store', 'kindergarten'"
);
fs.writeFileSync('src/App.tsx', app);

// 3. Add to SettingsPanel.tsx
let settings = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');
settings = settings.replace(
  "{ type: 'school', label: 'Escolas / Colégios' },",
  "{ type: 'school', label: 'Escolas / Colégios' },\n  { type: 'kindergarten', label: 'Creches / CEMEI' },"
);
settings = settings.replace(
  "{ type: 'pharmacy', label: 'Farmácias' },",
  "{ type: 'pharmacy', label: 'Farmácias / Drogarias' },"
);
fs.writeFileSync('src/components/SettingsPanel.tsx', settings);

// 4. Add SVG and color to MapArea.tsx
let mapArea = fs.readFileSync('src/components/MapArea.tsx', 'utf8');
mapArea = mapArea.replace(
  "case 'school': return '#9333ea'; // purple-600",
  "case 'school': return '#9333ea'; // purple-600\n    case 'kindergarten': return '#d946ef'; // fuchsia-500"
);
mapArea = mapArea.replace(
  "case 'school': return `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4 6 8-4 8 4\"/><path d=\"m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2\"/><path d=\"M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4\"/><path d=\"M18 5v17\"/><path d=\"M6 5v17\"/><circle cx=\"12\" cy=\"9\" r=\"2\"/></svg>`;",
  "case 'school': \n    case 'kindergarten': return `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4 6 8-4 8 4\"/><path d=\"m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2\"/><path d=\"M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4\"/><path d=\"M18 5v17\"/><path d=\"M6 5v17\"/><circle cx=\"12\" cy=\"9\" r=\"2\"/></svg>`;"
);
fs.writeFileSync('src/components/MapArea.tsx', mapArea);

