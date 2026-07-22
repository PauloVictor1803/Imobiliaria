const fs = require('fs');

let content = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

content = content.replace(
  'interface PropertyDetailsCardProps {\n  property: Property;\n  onClose: () => void;\n  onEdit?: () => void;\n  isAdmin?: boolean;\n}',
  'interface PropertyDetailsCardProps {\n  property: Property;\n  onClose: () => void;\n  onEdit?: () => void;\n  isAdmin?: boolean;\n  activePoiTypes: string[];\n  setActivePoiTypes: (types: string[]) => void;\n}'
);

content = content.replace(
  'export const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ property, onClose, onEdit, isAdmin }) => {',
  'export const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ property, onClose, onEdit, isAdmin, activePoiTypes, setActivePoiTypes }) => {'
);

content = content.replace(
  /const \[activeTypes, setActiveTypes\] = useState<string\[\]>\(\[\s*[^\]]*\s*\]\);/,
  ''
);

content = content.replace(/activeTypes/g, 'activePoiTypes');
content = content.replace(/setActiveTypes/g, 'setActivePoiTypes');

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', content);
