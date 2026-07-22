const fs = require('fs');
let code = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

const target = "    case 'clothing_store':";

const newStadiumSvg = `    case 'stadium':
    case 'soccer_field':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><path d="M12 12h.01"/></svg>\`; // Goal/Ball approx (Dribbble)`;

// It will find the clothing_store in getPoiSvg because the one in getPoiIconColor is just a simple string. Wait, getPoiIconColor also has 'clothing_store'.
// Let's use a better target in getPoiSvg
const betterTarget = "    case 'bakery': return `<svg xmlns";

code = code.replace(betterTarget, newStadiumSvg + '\n' + betterTarget);

fs.writeFileSync('src/components/MapArea.tsx', code);
