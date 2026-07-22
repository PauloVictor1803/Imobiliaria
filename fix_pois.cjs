const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';",
  "import { ShoppingCart, GraduationCap, TreePine, MapPin, Plus, Settings, CheckSquare, Square, X, Utensils, DollarSign, Dumbbell, Store, Plane, Coffee, BriefcaseMedical, ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight, Maximize2, Minimize2, Fuel, ShoppingBasket } from 'lucide-react';"
);

// Update poiIconMap
const oldMap = `  mall: <ShoppingBag className="w-5 h-5 text-violet-500" />
};`;
const newMap = `  mall: <ShoppingBag className="w-5 h-5 text-violet-500" />,
  gas_station: <Fuel className="w-5 h-5 text-yellow-500" />,
  convenience_store: <ShoppingBasket className="w-5 h-5 text-amber-500" />
};`;
code = code.replace(oldMap, newMap);

// Update activeTypes state
const oldState = `  const [activeTypes, setActiveTypes] = useState<string[]>([
    'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym'
  ]);`;
const newState = `  const [activeTypes, setActiveTypes] = useState<string[]>([
    'supermarket', 'school', 'park', 'hospital', 'pharmacy', 'restaurant', 'bank', 'gym', 'cafe', 'convenience_store', 'gas_station'
  ]);`;
code = code.replace(oldState, newState);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
