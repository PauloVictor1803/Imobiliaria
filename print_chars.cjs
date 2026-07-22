const fs = require('fs');
const lines = fs.readFileSync('src/components/MapArea.tsx', 'utf8').split('\n');
const targetLine = lines[167]; // index 167 is line 168
console.log(targetLine);
for (let i = 0; i < targetLine.length; i++) {
  console.log(targetLine[i], targetLine.charCodeAt(i));
}
