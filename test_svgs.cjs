const fs = require('fs');
const lines = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

// Match everything inside getPoiSvg
const match = lines.match(/const getPoiSvg = \(type: string\) => \{([\s\S]*?)};\n/);
if (match) {
  const code = match[1];
  const svgs = code.match(/`<svg[^`]+`/g) || [];
  let broken = false;
  svgs.forEach(s => {
    if (s.includes('</div>') || !s.includes('</svg>')) {
      console.log("BROKEN SVG FOUND:", s);
      broken = true;
    }
    // Check if SVG has mismatched quotes or something
  });
  if (!broken) console.log("All svgs look okay");
} else {
  console.log("Could not find getPoiSvg");
}
