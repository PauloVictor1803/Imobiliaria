const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// Add Maximize2, Minimize2 to imports
code = code.replace(
  "ChevronLeft, ChevronRight } from 'lucide-react';",
  "ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';"
);

// Add isExpanded state
code = code.replace(
  "const [currentImageIndex, setCurrentImageIndex] = useState(0);",
  "const [currentImageIndex, setCurrentImageIndex] = useState(0);\n  const [isExpanded, setIsExpanded] = useState(false);"
);

// Update wrapper classes
const oldWrapper = /<div className="absolute top-20 right-4 z-\[400\] bg-gray-50\/95 backdrop-blur-md rounded-2xl shadow-2xl w-96 border border-gray-200 overflow-hidden flex flex-col max-h-\[calc\(100vh-6rem\)\]">/;
const newWrapper = `<div className={\`absolute z-[500] bg-gray-50/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 \${isExpanded ? 'top-20 left-4 right-4 bottom-4' : 'top-20 right-4 w-96 max-h-[calc(100vh-6rem)]'}\`}>`;
code = code.replace(oldWrapper, newWrapper);

// Change image container to flex behavior when expanded to allow scrolling or filling
// Wait, if we just let the image fill, we should probably change its classes depending on isExpanded
const oldImageRegex = /<img \s*src=\{property\.images && property\.images\.length > 0 \? property\.images\[currentImageIndex\] : property\.image\} \s*alt=\{property\.title\} \s*className="w-full h-56 object-cover rounded-b-3xl transition-opacity duration-300"\s*\/>/;
const newImage = `<img 
          src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : property.image} 
          alt={property.title} 
          className={\`w-full object-cover transition-opacity duration-300 \${isExpanded ? 'h-96 rounded-b-xl' : 'h-56 rounded-b-3xl'}\`}
        />`;
code = code.replace(oldImageRegex, newImage);

// Add Expand button
const imageControlsRegex = /<div className="absolute top-3 right-3 flex gap-2">/;
const newControls = `<div className="absolute top-3 left-3 flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-colors"
            title={isExpanded ? "Restaurar" : "Expandir"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">`;
code = code.replace(imageControlsRegex, newControls);

// Change layout when expanded so content is readable
// Currently it's a flex col with flex-1 overflow-y-auto on the content
// Let's make the content grid when expanded
const oldContentStart = /<div className="p-6 flex-1 overflow-y-auto">/;
const newContentStart = `<div className={\`p-6 flex-1 overflow-y-auto \${isExpanded ? 'grid grid-cols-2 gap-8' : ''}\`}>
          <div className="space-y-6">`;
code = code.replace(oldContentStart, newContentStart);

// We need to close this div in the right place. We'll find where "Pontos de Interesse:" is and split there if expanded.
const oldPoiSection = /<div>\s*<p className="text-sm font-bold text-gray-900 mb-4">Pontos de Interesse:<\/p>/;
const newPoiSection = `</div>
          <div className={\`\${isExpanded ? 'border-l border-gray-200 pl-8' : ''}\`}>
          <p className="text-sm font-bold text-gray-900 mb-4">Pontos de Interesse:</p>`;
code = code.replace(oldPoiSection, newPoiSection);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
