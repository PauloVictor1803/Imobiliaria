const fs = require('fs');
let code = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

const target = "    case 'clothing_store':";
const policeSvg = `    case 'police':
    case 'police_station':
    case 'military_police':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>\`; // shield`;

if (!code.includes("case 'military_police':\n      return")) {
    code = code.replace(target, policeSvg + '\n' + target);
    fs.writeFileSync('src/components/MapArea.tsx', code);
}
