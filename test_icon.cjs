const fs = require('fs');

const type1 = 'restaurant';
const type2 = 'police';

const color1 = '#f97316';
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;

const color2 = '#3b82f6';
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;

function render(name, color, svg) {
  return `
      <div class="flex items-center gap-1.5 cursor-pointer" style="transform: translate(-10px, -10px); min-width: 150px;">
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style="background-color: ${color}; flex-shrink: 0;">
          ${svg}
        </div>
        <div class="text-xs font-bold pointer-events-none" style="color: ${color}; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0px 2px 2px rgba(0,0,0,0.1); line-height: 1.1;">
          ${name}
        </div>
      </div>
    `;
}

console.log("Restaurant:", render("Churrascaria", color1, svg1));
console.log("Police:", render("Polícia Militar", color2, svg2));
