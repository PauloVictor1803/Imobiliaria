const fs = require('fs');

let data = fs.readFileSync('src/data.ts', 'utf8');

const newPois = `
  { id: 'g60', type: 'event', name: 'Praça da Matriz', distance: '', lat: -16.722, lng: -43.864 },
  { id: 'g61', type: 'event', name: 'Praça dos Jatobás', distance: '', lat: -16.735, lng: -43.875 },
  { id: 'g62', type: 'event', name: 'Praça Coronel Ribeiro', distance: '', lat: -16.725, lng: -43.866 },
  { id: 'g63', type: 'event', name: 'Praça Pio XII', distance: '', lat: -16.727, lng: -43.858 },
  { id: 'g64', type: 'park', name: 'Parque das Mangueiras', distance: '', lat: -16.738, lng: -43.862 },
  { id: 'g65', type: 'park', name: 'Parque da Sapucaia', distance: '', lat: -16.760, lng: -43.860 },
  { id: 'g66', type: 'park', name: 'Parque Estadual da Lapa Grande', distance: '', lat: -16.705, lng: -43.900 },
`;

if (!data.includes("'Parque das Mangueiras'")) {
    data = data.replace(
      "  { id: 'g59', type: 'school', name: 'IFNMG', distance: '', lat: -16.745, lng: -43.880 },",
      "  { id: 'g59', type: 'school', name: 'IFNMG', distance: '', lat: -16.745, lng: -43.880 }," + newPois
    );
    fs.writeFileSync('src/data.ts', data);
}
