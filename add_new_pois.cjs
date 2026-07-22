const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(
  "'kindergarten';",
  "'kindergarten' | 'club' | 'snack_bar' | 'pizzeria';"
);
fs.writeFileSync('src/types.ts', types);

// 2. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  "'kindergarten'",
  "'kindergarten', 'club', 'snack_bar', 'pizzeria'"
);
fs.writeFileSync('src/App.tsx', app);

// 3. SettingsPanel.tsx
let settings = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');
settings = settings.replace(
  "{ type: 'grocery_store', label: 'Mercearias' },",
  "{ type: 'grocery_store', label: 'Mercearias' },\n  { type: 'club', label: 'Clubes / Piscinas' },\n  { type: 'snack_bar', label: 'Lanchonetes' },\n  { type: 'pizzeria', label: 'Pizzarias' },"
);
fs.writeFileSync('src/components/SettingsPanel.tsx', settings);

// 4. MapArea.tsx
let mapArea = fs.readFileSync('src/components/MapArea.tsx', 'utf8');
mapArea = mapArea.replace(
  "case 'grocery_store': return '#f59e0b'; // amber-500",
  "case 'grocery_store': return '#f59e0b'; // amber-500\n    case 'club': return '#06b6d4'; // cyan-500\n    case 'snack_bar': return '#fb923c'; // orange-400\n    case 'pizzeria': return '#ef4444'; // red-500"
);
mapArea = mapArea.replace(
  "case 'grocery_store':",
  "case 'grocery_store':\n    case 'snack_bar':"
);
mapArea = mapArea.replace(
  "case 'restaurant': return `<svg",
  "case 'restaurant': \n    case 'pizzeria': return `<svg"
);
const clubSvg = `case 'club':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6 0 1.2-.2 1.7-.6C4.8 4.7 5.9 4 7 4s2.2.7 3.3 1.4C10.8 5.8 11.4 6 12 6s1.2-.2 1.7-.6C14.8 4.7 15.9 4 17 4s2.2.7 3.3 1.4C21.4 5.8 22 6 22 6"/><path d="M2 12c.6 0 1.2-.2 1.7-.6C4.8 10.7 5.9 10 7 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 10.7 15.9 10 17 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/><path d="M2 18c.6 0 1.2-.2 1.7-.6C4.8 16.7 5.9 16 7 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 16.7 15.9 16 17 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/></svg>\`; // waves`;
mapArea = mapArea.replace(
  "case 'ambulance':",
  `${clubSvg}\n    case 'ambulance':`
);
fs.writeFileSync('src/components/MapArea.tsx', mapArea);

// 5. PropertyDetailsCard.tsx
let card = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// replace imports
card = card.replace(
  "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket } from 'lucide-react';",
  "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket, Waves, Pizza, UtensilsCrossed } from 'lucide-react';"
);

// replace poiIconMap
card = card.replace(
  "convenience_store: <ShoppingBasket className=\"w-5 h-5 text-amber-500\" />\n};",
  "convenience_store: <ShoppingBasket className=\"w-5 h-5 text-amber-500\" />,\n  club: <Waves className=\"w-5 h-5 text-cyan-500\" />,\n  snack_bar: <UtensilsCrossed className=\"w-5 h-5 text-orange-400\" />,\n  pizzeria: <Pizza className=\"w-5 h-5 text-red-500\" />\n};"
);

// replace activeTypes
card = card.replace(
  "'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station'",
  "'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station', 'club', 'snack_bar', 'pizzeria'"
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', card);

