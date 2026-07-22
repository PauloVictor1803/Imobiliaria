const fs = require('fs');
let code = fs.readFileSync('src/components/MapArea.tsx', 'utf8');

const oldColors = `    case 'university': return '#4f46e5'; // indigo-600
    case 'club':
      return \`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6 0 1.2-.2 1.7-.6C4.8 4.7 5.9 4 7 4s2.2.7 3.3 1.4C10.8 5.8 11.4 6 12 6s1.2-.2 1.7-.6C14.8 4.7 15.9 4 17 4s2.2.7 3.3 1.4C21.4 5.8 22 6 22 6"/><path d="M2 12c.6 0 1.2-.2 1.7-.6C4.8 10.7 5.9 10 7 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 10.7 15.9 10 17 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/><path d="M2 18c.6 0 1.2-.2 1.7-.6C4.8 16.7 5.9 16 7 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 16.7 15.9 16 17 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/></svg>\`; // waves
    case 'ambulance': return '#ef4444'; // red-500
    case 'health_center': return '#10b981'; // emerald-500
    case 'grocery_store':
    case 'snack_bar': return '#f59e0b'; // amber-500
    case 'club': return '#06b6d4'; // cyan-500
    case 'snack_bar': return '#fb923c'; // orange-400
    case 'pizzeria': return '#ef4444'; // red-500
    default: return '#64748b'; // slate-500 as safe fallback`;

const newColors = `    case 'university': return '#4f46e5'; // indigo-600
    case 'ambulance': return '#ef4444'; // red-500
    case 'health_center': return '#10b981'; // emerald-500
    case 'grocery_store': return '#f59e0b'; // amber-500
    case 'club': return '#06b6d4'; // cyan-500
    case 'snack_bar': return '#fb923c'; // orange-400
    case 'pizzeria': return '#ef4444'; // red-500
    default: return '#64748b'; // slate-500 as safe fallback`;

code = code.replace(oldColors, newColors);

fs.writeFileSync('src/components/MapArea.tsx', code);
