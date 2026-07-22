const fs = require('fs');
let code = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

const target = `    case 'ambulance':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/><path d="M14 8h4.54a2 2 0 0 1 1.76 1.05l2.4 4.53V18h-2"/><circle cx="17.5" cy="17.5" r="2.5"/><circle cx="4.5" cy="17.5" r="2.5"/><path d="M10 8v4"/></svg>\`; // ambulance approx`;

const newCode = `    case 'ambulance':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/><path d="M14 8h4.54a2 2 0 0 1 1.76 1.05l2.4 4.53V18h-2"/><circle cx="17.5" cy="17.5" r="2.5"/><circle cx="4.5" cy="17.5" r="2.5"/><path d="M10 8v4"/></svg>\`; // ambulance approx
    case 'snack_bar':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 11v3"/><path d="M12 11v3"/><path d="M8 11v3"/><path d="M5 14h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z"/><path d="M5 11h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2Z"/></svg>\`; // sandwich
    case 'pizzeria':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>\`; // pizza
    case 'club':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6 0 1.2-.2 1.7-.6C4.8 4.7 5.9 4 7 4s2.2.7 3.3 1.4C10.8 5.8 11.4 6 12 6s1.2-.2 1.7-.6C14.8 4.7 15.9 4 17 4s2.2.7 3.3 1.4C21.4 5.8 22 6 22 6"/><path d="M2 12c.6 0 1.2-.2 1.7-.6C4.8 10.7 5.9 10 7 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 10.7 15.9 10 17 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/><path d="M2 18c.6 0 1.2-.2 1.7-.6C4.8 16.7 5.9 16 7 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 16.7 15.9 16 17 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/></svg>\`; // waves`;

code = code.replace(target, newCode);

fs.writeFileSync('src/components/MapArea.tsx', code);
