const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// 1. Wrap with scrollable flex-1 div
code = code.replace(
  /<div className=\{\`absolute z-\[500\] bg-gray-50\/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 \$\{isExpanded \? 'top-20 left-4 right-4 bottom-4' : 'top-20 right-4 w-96 max-h-\[calc\(100vh-6rem\)\]'\}\`\}>\s*<div className="relative group">/,
  `<div className={\`absolute z-[500] bg-gray-50/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 \${isExpanded ? 'top-20 left-4 right-4 bottom-4' : 'top-20 right-4 w-96 max-h-[calc(100vh-6rem)]'}\`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col w-full scroll-smooth">
      <div className="relative group shrink-0">`
);

// 2. Add extra closing div before the end
const lastClosingDivs = `      </div>
      )}
    </div>
  );
};`;
const newClosingDivs = `      </div>
      )}
      </div>
    </div>
  );
};`;
code = code.replace(lastClosingDivs, newClosingDivs);

// 3. Update image to be clickable and not cropped when expanded
const oldImg = /<img\s+src=\{property\.images && property\.images\.length > 0 \? property\.images\[currentImageIndex\] : property\.image\}\s+alt=\{property\.title\}\s+className=\{\`w-full object-cover transition-opacity duration-300 \$\{isExpanded \? 'h-96 rounded-b-xl' : 'h-56 rounded-b-3xl'\}\`\}\s*\/>/;
const newImg = `<img 
          src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : property.image} 
          alt={property.title} 
          onClick={() => {
            if (isExpanded && property.images && property.images.length > 1) {
              setCurrentImageIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1));
            }
          }}
          className={\`w-full transition-all duration-500 \${isExpanded ? 'h-[50vh] min-h-[400px] object-contain bg-gray-200 cursor-pointer' : 'h-56 object-cover rounded-b-3xl'}\`}
        />`;
code = code.replace(oldImg, newImg);

// 4. Remove overflow-y-auto and flex-1 from inner panels
code = code.replace(
  /<div className="p-6 overflow-y-auto flex-1 animate-in fade-in">/g, 
  `<div className="p-6 animate-in fade-in">`
);

code = code.replace(
  /<div className=\{\`p-6 overflow-y-auto flex-1 animate-in fade-in \$\{isExpanded \? 'grid grid-cols-2 gap-8' : ''\}\`\}>/,
  `<div className={\`p-6 animate-in fade-in \${isExpanded ? 'grid grid-cols-2 gap-8' : ''}\`}>`
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
