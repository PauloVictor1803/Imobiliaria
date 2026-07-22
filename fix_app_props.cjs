const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find <PropertyDetailsCard
// We need to add activePoiTypes={activePoiTypes} setActivePoiTypes={setActivePoiTypes}

const oldCard = `<PropertyDetailsCard
            property={selectedProperty}
            onClose={() => setSelectedPropertyId(null)}
            onEdit={
              isAuthenticatedAdmin
                ? () => setEditingProperty(selectedProperty)
                : undefined
            }
            isAdmin={isAuthenticatedAdmin}
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
          />`;

content = content.replace(oldCard, newCard);

fs.writeFileSync('src/App.tsx', content);
