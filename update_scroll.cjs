const fs = require('fs');
let code = fs.readFileSync('src/components/PropertyDetailsCard.tsx', 'utf8');

// 1. Wrap the image and content in a scrollable div
const oldWrapperStart = `<div className="relative group">`;
const newWrapperStart = `<div className="flex-1 overflow-y-auto w-full flex flex-col scroll-smooth">
      <div className="relative group shrink-0">`;
code = code.replace(oldWrapperStart, newWrapperStart);

// We need to close the new div before the final closing div
// The easiest way is to find the return statement's closing
// Wait, the card has multiple views (settings open vs not).
// Let's look at the structure.
