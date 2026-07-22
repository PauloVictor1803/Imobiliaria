const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// Remove grid-cols-2
code = code.replace(
  /<div className=\{\`p-6 animate-in fade-in \$\{isExpanded \? 'grid grid-cols-2 gap-8' : ''\}\`\}>/,
  `<div className={\`p-6 animate-in fade-in \${isExpanded ? 'max-w-3xl mx-auto w-full' : ''}\`}>`
);

// Remove the column split for POIs
code = code.replace(
  /<\/div>\s*<div className=\{\`\$\{isExpanded \? 'border-l border-gray-200 pl-8' : ''\}\`\}>\s*<p className="text-sm font-bold text-gray-900 mb-4">Pontos de Interesse:<\/p>/,
  `</div>
          <div className="mt-8">
          <p className="text-sm font-bold text-gray-900 mb-4 text-center">Pontos de Interesse:</p>`
);

// We need to ensure that `Pontos de Interesse` and the radar are nicely centered.
// The radar is already `relative flex justify-center items-center h-56 my-2`

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
