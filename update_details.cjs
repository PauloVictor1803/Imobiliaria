const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// Add ChevronLeft, ChevronRight to imports
code = code.replace(
  "ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat } from 'lucide-react';",
  "ShoppingBag, Edit2, BedDouble, Bath, Car, Sofa, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';"
);

// Add currentImageIndex state
code = code.replace(
  "const [activeTypes, setActiveTypes] = useState<string[]>([",
  "const [currentImageIndex, setCurrentImageIndex] = useState(0);\n  const [activeTypes, setActiveTypes] = useState<string[]>(["
);

// We need to reset currentImageIndex when property changes
// Actually, it's recreated if `key` changes, or we can use a `useEffect`
code = code.replace(
  "const visiblePois = useMemo(() => {",
  "React.useEffect(() => {\n    setCurrentImageIndex(0);\n  }, [property.id]);\n\n  const visiblePois = useMemo(() => {"
);

// Find the image section
const imageSectionRegex = /<img\s+src=\{property\.images && property\.images\.length > 0 \? property\.images\[0\] : property\.image\}\s+alt=\{property\.title\}\s+className="w-full h-56 object-cover rounded-b-3xl"\s+\/>/g;

const newImageSection = `
        <img 
          src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : property.image} 
          alt={property.title} 
          className="w-full h-56 object-cover rounded-b-3xl transition-opacity duration-300"
        />
        {property.images && property.images.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
              }}
              className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1));
              }}
              className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {currentImageIndex + 1}/{property.images.length}
            </div>
          </>
        )}
`;

code = code.replace(imageSectionRegex, newImageSection);

// Remove the old image indicator
code = code.replace(
  /\{property\.images && property\.images\.length > 1 && \(\s*<div className="absolute bottom-4 left-1\/2 -translate-x-1\/2 bg-black\/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">\s*1\/\{property\.images\.length\}\s*<\/div>\s*\)\}/g,
  ""
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
