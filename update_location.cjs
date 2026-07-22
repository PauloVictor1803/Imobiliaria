const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { X, Save, Plus, Trash2, UploadCloud, ImageIcon } from 'lucide-react';",
  "import { X, Save, Plus, Trash2, UploadCloud, ImageIcon, MapPin, Search, Loader2 } from 'lucide-react';"
);

// Update state
code = code.replace(
  "const [coordinatesInput, setCoordinatesInput] = useState(`${property.lat}, ${property.lng}`);",
  `const [coordinatesInput, setCoordinatesInput] = useState(\`\${property.lat}, \${property.lng}\`);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);`
);

// Update handleCoordinatesChange and add search logic
const newHandlers = `  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    try {
      const response = await fetch(\`https://nominatim.openstreetmap.org/search?format=json&q=\${encodeURIComponent(query)}&limit=5&countrycodes=br\`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoordinatesInput(val);
    
    // Check if it's a map URL or coordinate format
    const coordMatch = val.match(/(-?\\d+(\\.\\d+)?)[,\\s]+(-?\\d+(\\.\\d+)?)/);
    const urlMatch = val.match(/@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)/);
    
    let lat, lng;
    if (urlMatch) {
      lat = parseFloat(urlMatch[1]);
      lng = parseFloat(urlMatch[2]);
    } else if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[3]);
    }

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      setFormData(prev => ({ ...prev, lat, lng }));
      setShowResults(false);
    } else {
      // If not coordinates/URL, search address (debounced)
      if (window.searchTimeout) clearTimeout(window.searchTimeout);
      const timeout = setTimeout(() => {
        searchAddress(val);
      }, 600);
      window.searchTimeout = timeout as any;
    }
  };

  const handleSelectAddress = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setFormData(prev => ({ ...prev, lat, lng }));
    setCoordinatesInput(result.display_name);
    setShowResults(false);
  };`;

code = code.replace(
  /  const handleCoordinatesChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?  \};/,
  newHandlers
);

// Update UI
const oldLocationUI = `              <div>
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

const newLocationUI = `              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização (Endereço, Coordenadas ou Link Maps)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400 w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={coordinatesInput} 
                    onChange={handleCoordinatesChange}
                    onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    placeholder="Digite a rua, bairro, coordenadas ou cole o link do Maps"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {showResults && (coordinatesInput.length >= 3) && (
                  <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 flex items-center justify-center text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        <span className="text-sm">Buscando endereço...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-1">
                        {searchResults.map((result, i) => (
                          <div 
                            key={i}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-start transition-colors"
                            onClick={() => handleSelectAddress(result)}
                          >
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 shrink-0" />
                            <span className="text-sm text-gray-700 line-clamp-2">{result.display_name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Nenhum endereço encontrado.
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  Digite para buscar ou cole o link do Google Maps para marcar no mapa.
                </p>
              </div>`;

code = code.replace(oldLocationUI, newLocationUI);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
