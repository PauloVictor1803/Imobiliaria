const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes("'soccer_field'")) {
    types = types.replace(
      "'military_police';",
      "'military_police' | 'soccer_field';"
    );
    fs.writeFileSync('src/types.ts', types);
}

// 2. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes("'soccer_field'")) {
    app = app.replace(
      "'military_police'",
      "'military_police', 'stadium', 'soccer_field'"
    );
    fs.writeFileSync('src/App.tsx', app);
}

// 3. SettingsPanel.tsx
let settings = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');
if (!settings.includes("'soccer_field'")) {
    settings = settings.replace(
      "{ type: 'stadium', label: 'Estádios' },",
      "{ type: 'stadium', label: 'Estádios' },\n  { type: 'soccer_field', label: 'Campos de Futebol' },"
    );
    fs.writeFileSync('src/components/SettingsPanel.tsx', settings);
}

// 4. MapArea.tsx
let mapArea = fs.readFileSync('src/components/MapArea.tsx', 'utf8');
if (!mapArea.includes("'soccer_field':")) {
    mapArea = mapArea.replace(
      "case 'stadium': return '#10b981';",
      "case 'stadium': \n    case 'soccer_field': return '#10b981';"
    );
    const stadiumSvg = `case 'stadium':
    case 'soccer_field':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><path d="M12 12h.01"/></svg>\`; // Goal/Ball approx (Dribbble)`;
    mapArea = mapArea.replace(
      "case 'club':",
      `${stadiumSvg}\n    case 'club':`
    );
    fs.writeFileSync('src/components/MapArea.tsx', mapArea);
}

// 5. PropertyDetailsCard.tsx
let card = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

if (!card.includes("'soccer_field'")) {
    card = card.replace(
      "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket, Waves, Pizza, UtensilsCrossed, Shield } from 'lucide-react';",
      "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket, Waves, Pizza, UtensilsCrossed, Shield, Goal } from 'lucide-react';"
    );
    
    card = card.replace(
      "military_police: <Shield className=\"w-5 h-5 text-blue-500\" />\n};",
      "military_police: <Shield className=\"w-5 h-5 text-blue-500\" />,\n  stadium: <Goal className=\"w-5 h-5 text-emerald-500\" />,\n  soccer_field: <Goal className=\"w-5 h-5 text-emerald-500\" />\n};"
    );
    
    card = card.replace(
      "'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station', 'club', 'snack_bar', 'pizzeria', 'police', 'police_station', 'military_police'",
      "'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station', 'club', 'snack_bar', 'pizzeria', 'police', 'police_station', 'military_police', 'stadium', 'soccer_field'"
    );
    fs.writeFileSync('src/components/PropertyDetailsCard.tsx', card);
}
