const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes("'police_station'")) {
    types = types.replace(
      "'pizzeria';",
      "'pizzeria' | 'police_station' | 'military_police';"
    );
    fs.writeFileSync('src/types.ts', types);
}

// 2. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes("'police_station'")) {
    app = app.replace(
      "'pizzeria'",
      "'pizzeria', 'police_station', 'military_police'"
    );
    fs.writeFileSync('src/App.tsx', app);
}

// 3. SettingsPanel.tsx
let settings = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');
if (!settings.includes("'police_station'")) {
    settings = settings.replace(
      "{ type: 'police', label: 'Polícia' },",
      "{ type: 'police', label: 'Polícia' },\n  { type: 'police_station', label: 'Postos Policiais' },\n  { type: 'military_police', label: 'Batalhões da PM' },"
    );
    fs.writeFileSync('src/components/SettingsPanel.tsx', settings);
}

// 4. MapArea.tsx
let mapArea = fs.readFileSync('src/components/MapArea.tsx', 'utf8');
if (!mapArea.includes("'police_station':")) {
    mapArea = mapArea.replace(
      "case 'police': return '#3b82f6';",
      "case 'police': \n    case 'police_station':\n    case 'military_police': return '#3b82f6';"
    );
    const policeSvg = `case 'police':
    case 'police_station':
    case 'military_police':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>\`; // shield`;
    mapArea = mapArea.replace(
      "case 'post_office': return `<svg",
      `${policeSvg}\n    case 'post_office': return \`<svg`
    );
    fs.writeFileSync('src/components/MapArea.tsx', mapArea);
}

// 5. PropertyDetailsCard.tsx
let card = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

if (!card.includes("'police_station'")) {
    card = card.replace(
      "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket, Waves, Pizza, UtensilsCrossed } from 'lucide-react';",
      "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket, Waves, Pizza, UtensilsCrossed, Shield } from 'lucide-react';"
    );
    
    card = card.replace(
      "pizzeria: <Pizza className=\"w-5 h-5 text-red-500\" />\n};",
      "pizzeria: <Pizza className=\"w-5 h-5 text-red-500\" />,\n  police: <Shield className=\"w-5 h-5 text-blue-500\" />,\n  police_station: <Shield className=\"w-5 h-5 text-blue-500\" />,\n  military_police: <Shield className=\"w-5 h-5 text-blue-500\" />\n};"
    );
    
    card = card.replace(
      "'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station', 'club', 'snack_bar', 'pizzeria'",
      "'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station', 'club', 'snack_bar', 'pizzeria', 'police', 'police_station', 'military_police'"
    );
    fs.writeFileSync('src/components/PropertyDetailsCard.tsx', card);
}
