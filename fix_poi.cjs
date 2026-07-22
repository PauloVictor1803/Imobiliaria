const fs = require('fs');

let content = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// Add globalPois to props
content = content.replace(
  'isAdmin?: boolean;\n  activePoiTypes: string[];',
  'isAdmin?: boolean;\n  activePoiTypes: string[];\n  globalPois?: PointOfInterest[];'
);

content = content.replace(
  'activePoiTypes,\n  setActivePoiTypes,\n}) => {',
  'activePoiTypes,\n  setActivePoiTypes,\n  globalPois = GLOBAL_POIS,\n}) => {'
);

content = content.replace(/GLOBAL_POIS/g, 'globalPois');

// But make sure the import is still there if fallback is used
fs.writeFileSync('src/components/PropertyDetailsCard.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
const oldCard = `<PropertyDetailsCard
            property={selectedProperty}
            onClose={() => setSelectedPropertyId(null)}
            onEdit={
              isAuthenticatedAdmin
                ? () => setEditingProperty(selectedProperty)
                : undefined
            }
            isAdmin={isAuthenticatedAdmin}
            activePoiTypes={activePoiTypes}
            setActivePoiTypes={setActivePoiTypes}
          />`;

const newCard = `<PropertyDetailsCard
            property={selectedProperty}
            onClose={() => setSelectedPropertyId(null)}
            onEdit={
              isAuthenticatedAdmin
                ? () => setEditingProperty(selectedProperty)
                : undefined
            }
            isAdmin={isAuthenticatedAdmin}
            activePoiTypes={activePoiTypes}
            setActivePoiTypes={setActivePoiTypes}
            globalPois={realPois}
          />`;
appContent = appContent.replace(oldCard, newCard);
fs.writeFileSync('src/App.tsx', appContent);
