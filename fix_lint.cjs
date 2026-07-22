const fs = require('fs');

let content = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

content = content.replace(
  'import { globalPois } from "../data";',
  'import { GLOBAL_POIS } from "../data";\nimport { PointOfInterest } from "../types";'
);

content = content.replace(
  'globalPois = globalPois,',
  'globalPois = GLOBAL_POIS,'
);

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', content);
