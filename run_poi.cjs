const fs = require('fs');

const file = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

// just extract the getPoiIconColor and createPoiIcon using regex or something similar
const matchColor = file.match(/const getPoiIconColor = \(type: string\) => \{([\s\S]*?)};\n/);
const matchSvg = file.match(/const getPoiSvg = \(type: string\) => \{([\s\S]*?)};\n/);

eval(matchColor[0]);
eval(matchSvg[0]);

const poi = { id: 'g50', type: 'restaurant', name: 'Churrascaria', distance: '', lat: -16.740, lng: -43.860 };
const color = getPoiIconColor(poi.type);
console.log("Color is: [" + color + "]", "length is: " + color.length);
for(let i=0; i<color.length; i++) console.log(color.charCodeAt(i));

