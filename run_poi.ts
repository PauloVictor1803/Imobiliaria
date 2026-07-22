import * as fs from 'fs';
const file = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

const matchColor = file.match(/const getPoiIconColor = \(type: string\) => \{([\s\S]*?)};\n/);
let colorCode = matchColor[0].replace('(type: string)', '(type)');
eval(colorCode);

const type = 'restaurant';
// @ts-ignore
const color = getPoiIconColor(type);
console.log("Color is: [" + color + "]", "length is: " + color.length);
