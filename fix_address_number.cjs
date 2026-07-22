const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

const oldFormatPhotonAddress = `  const formatPhotonAddress = (properties: any) => {
    const parts = [];
    if (properties.name) parts.push(properties.name);
    if (properties.housenumber) parts.push(properties.housenumber);
    if (properties.street && properties.street !== properties.name) parts.push(properties.street);
    if (properties.district) parts.push(properties.district);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);
    return parts.join(', ');
  };`;

const newFormatPhotonAddress = `  const formatPhotonAddress = (properties: any, query: string) => {
    const parts = [];
    if (properties.name) parts.push(properties.name);
    
    if (properties.housenumber) {
      parts.push(properties.housenumber);
    } else {
      const match = query.match(/\\b\\d+\\b/);
      if (match) {
        parts.push(match[0]);
      }
    }
    
    if (properties.street && properties.street !== properties.name) parts.push(properties.street);
    if (properties.district) parts.push(properties.district);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);
    return parts.join(', ');
  };`;

code = code.replace(oldFormatPhotonAddress, newFormatPhotonAddress);

code = code.replace(
  "display_name: formatPhotonAddress(f.properties)",
  "display_name: formatPhotonAddress(f.properties, query)"
);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
