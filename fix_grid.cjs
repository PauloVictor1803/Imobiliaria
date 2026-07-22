const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

code = code.replace(
  '<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 border-b border-gray-200 pb-6">',
  '<div className={`grid grid-cols-2 ${isExpanded ? \'md:grid-cols-4\' : \'\'} gap-4 mb-6 border-b border-gray-200 pb-6`}>'
);

code = code.replace(
  '<p className="text-sm font-bold text-gray-900">{formatCurrency(property.price)}</p>',
  '<p className="text-sm font-bold text-gray-900 truncate" title={formatCurrency(property.price)}>{formatCurrency(property.price)}</p>'
);

code = code.replace(
  '<p className="text-sm font-bold text-gray-900">{property.style}</p>',
  '<p className="text-sm font-bold text-gray-900 truncate" title={property.style}>{property.style}</p>'
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
