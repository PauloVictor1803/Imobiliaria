const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

const mapComponents = `
const MiniMapUpdater = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const LocationPicker = ({ position, setPosition }: { position: [number, number], setPosition: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng.lat, e.latlng.lng);
    },
  });
  return <Marker position={position} />;
};
`;

code = code.replace(
  "export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property, onClose, onSave }) => {",
  mapComponents + "\nexport const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property, onClose, onSave }) => {"
);

const handleMapClick = `  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    setCoordinatesInput(\`\${lat.toFixed(6)}, \${lng.toFixed(6)}\`);
  };`;

code = code.replace(
  "  const handleCurrencyChange",
  handleMapClick + "\n\n  const handleCurrencyChange"
);

const oldLocationUI = `                <p className="text-xs text-gray-500 mt-1">
                  Digite para buscar ou cole o link do Google Maps para marcar no mapa.
                </p>
              </div>`;

const newLocationUI = `                <p className="text-xs text-gray-500 mt-1 mb-3">
                  Digite para buscar, cole o link do Google Maps, ou clique no mapa abaixo para ajustar.
                </p>
                <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
                  <MapContainer 
                    center={[formData.lat, formData.lng]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MiniMapUpdater lat={formData.lat} lng={formData.lng} />
                    <LocationPicker 
                      position={[formData.lat, formData.lng]} 
                      setPosition={handleMapClick} 
                    />
                  </MapContainer>
                </div>
              </div>`;

code = code.replace(oldLocationUI, newLocationUI);

// Fix Leaflet Default Icon issue for this component
const iconFix = `
// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
`;

code = code.replace(
  "import L from 'leaflet';",
  "import L from 'leaflet';\n" + iconFix
);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
