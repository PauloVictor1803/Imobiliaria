const fs = require('fs');
let code = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

// Use useMemo for markers
const oldPropertiesMap = `{properties.map(property => {
          const isSelected = property.id === selectedPropertyId;
          return (
            <React.Fragment key={property.id}>
              <Marker
                position={[property.lat, property.lng]}
                icon={getCachedPropertyIcon(property, isSelected)}
                eventHandlers={{
                  click: () => onPropertySelect(property.id)
                }}
              />
            </React.Fragment>
          );
        })}`;

const newPropertiesMap = `{React.useMemo(() => properties.map(property => {
          const isSelected = property.id === selectedPropertyId;
          return (
            <React.Fragment key={property.id}>
              <Marker
                position={[property.lat, property.lng]}
                icon={getCachedPropertyIcon(property, isSelected)}
                eventHandlers={{
                  click: () => onPropertySelect(property.id)
                }}
              />
            </React.Fragment>
          );
        }), [properties, selectedPropertyId, onPropertySelect])}`;

code = code.replace(oldPropertiesMap, newPropertiesMap);

fs.writeFileSync('src/components/MapArea.tsx', code);
