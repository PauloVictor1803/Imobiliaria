const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

// 1. Add state
code = code.replace(
  'const [newUrl, setNewUrl] = useState("");',
  `const [newUrl, setNewUrl] = useState("");
  const [coordinatesInput, setCoordinatesInput] = useState(\`\${property.lat}, \${property.lng}\`);`
);

// 2. Add handleCoordinatesChange
const handlers = `  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoordinatesInput(val);
    
    // Try to parse Google Maps URL or just lat,lng coordinates
    // Match either standard Google Maps URL patterns or comma-separated coordinates
    let lat, lng;
    
    // First try to parse as coordinates "lat, lng"
    const coordMatch = val.match(/(-?\\d+(\\.\\d+)?)[,\\s]+(-?\\d+(\\.\\d+)?)/);
    
    // Also check for Google Maps URL like "https://www.google.com/maps/@-16.732,-43.865,15z" or "place/.../@-16.732,-43.865"
    const urlMatch = val.match(/@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)/);
    
    if (urlMatch) {
      lat = parseFloat(urlMatch[1]);
      lng = parseFloat(urlMatch[2]);
    } else if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[3]);
    }

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      setFormData(prev => ({ ...prev, lat, lng }));
    }
  };`;

code = code.replace(
  'const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {',
  handlers + '\n\n  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {'
);

// 3. Add the field to UI
const oldArea = `                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                  <input 
                    type="number" 
                    name="area" 
                    value={formData.area || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>`;

const newAreaWithCoords = `                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                  <input 
                    type="number" 
                    name="area" 
                    value={formData.area || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização no Google Maps</label>
                <input 
                  type="text" 
                  value={coordinatesInput} 
                  onChange={handleCoordinatesChange}
                  placeholder="Cole as coordenadas (Ex: -16.73, -43.86) ou o link do Google Maps"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Cole o link do Google Maps ou clique com botão direito no mapa para copiar as coordenadas.</p>
              </div>`;

code = code.replace(oldArea, newAreaWithCoords);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
