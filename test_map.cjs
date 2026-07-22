const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

if(!code.includes("import { MapContainer")) {
  code = code.replace(
    "import { X, Save, Plus, Trash2, UploadCloud, ImageIcon, MapPin, Search, Loader2 } from 'lucide-react';",
    "import { X, Save, Plus, Trash2, UploadCloud, ImageIcon, MapPin, Search, Loader2 } from 'lucide-react';\nimport { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';\nimport L from 'leaflet';"
  );
}

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
