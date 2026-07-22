const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// Remove Home as HomeIcon from the import statement
code = code.replace("BriefcaseMedical, Home as HomeIcon, ShoppingBag", "BriefcaseMedical, ShoppingBag");

fs.writeFileSync('src/components/PropertyDetailsCard.tsx', code);
