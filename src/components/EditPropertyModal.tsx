import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types';
import { X, Save, Plus, Trash2, UploadCloud, ImageIcon, MapPin, Search, Loader2, GripVertical, Youtube } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { isYouTubeUrl, getYouTubeThumbnail } from '../lib/youtube';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


interface EditPropertyModalProps {
  property: Property;
  onClose: () => void;
  onSave: (updatedProperty: Property) => Promise<void>;
}


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

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState<Property>(property);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<string[]>(property.images || (property.image ? [property.image] : []));
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [coordinatesInput, setCoordinatesInput] = useState(`${property.lat}, ${property.lng}`);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setFormData(property);
    setImages(property.images || (property.image ? [property.image] : []));
  }, [property]);

  
  const formatBRL = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === '') return '';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue);
  };

    const formatPhotonAddress = (properties: any, query: string) => {
    const parts = [];
    if (properties.name) parts.push(properties.name);
    
    if (properties.housenumber) {
      parts.push(properties.housenumber);
    } else {
      const match = query.match(/\b\d+\b/);
      if (match) {
        parts.push(match[0]);
      }
    }
    
    if (properties.street && properties.street !== properties.name) parts.push(properties.street);
    if (properties.district) parts.push(properties.district);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);
    return parts.join(', ');
  };

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    try {
      // Use Photon API which is much better for natural language and partial addresses in Brazil
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      
      if (data && data.features) {
        const formattedResults = data.features
          .filter((f: any) => f.geometry && f.geometry.coordinates)
          .map((f: any) => ({
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            display_name: formatPhotonAddress(f.properties, query)
          }));
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
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
    const coordMatch = val.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    const urlMatch = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const placeMatch = val.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    const searchMatch = val.match(/search\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    
    let lat, lng;
    if (placeMatch) {
      lat = parseFloat(placeMatch[1]);
      lng = parseFloat(placeMatch[2]);
    } else if (searchMatch) {
      lat = parseFloat(searchMatch[1]);
      lng = parseFloat(searchMatch[2]);
    } else if (urlMatch) {
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
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      const timeout = window.setTimeout(() => {
        searchAddress(val);
      }, 600);
      searchTimeoutRef.current = timeout;
    }
  };

  const handleSelectAddress = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setFormData(prev => ({ ...prev, lat, lng }));
    setCoordinatesInput(result.display_name);
    setShowResults(false);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    setCoordinatesInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      setFormData(prev => ({ ...prev, [name]: 0 }));
      return;
    }
    const numericValue = parseInt(digits, 10) / 100;
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      const numericFields = ['price', 'cost', 'area', 'bedrooms', 'bathrooms', 'garages', 'kitchens', 'livingRooms'];
      setFormData(prev => ({
        ...prev,
        [name]: numericFields.includes(name) ? Number(value) : value
      }));
    }
  };

    const processFiles = (files: File[]) => {
    const remainingSlots = 10 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          if (prev.length < 10 && !prev.includes(reader.result as string)) {
            return [...prev, reader.result as string];
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleAddUrl = () => {
    if (newUrl.trim() && images.length < 10) {
      setImages(prev => [...prev, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    if (images.length < 10) {
      setImages([...images, '']);
    }
  };

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
    // Needed for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;
    
    const newImages = [...images];
    const draggedItem = newImages[draggedImageIndex];
    
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setDraggedImageIndex(index);
    setImages(newImages);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const finalImages = images.filter(img => img.trim() !== '');
    const finalData = {
      ...formData,
      image: finalImages.length > 0 ? finalImages[0] : formData.image,
      images: finalImages
    };
    
    try {
      // Simulate API call for future Supabase integration
      await new Promise(resolve => setTimeout(resolve, 500));
      await onSave(finalData);
      onClose();
    } catch (error) {
      console.error("Failed to save property", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Editar Imóvel</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Atual</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input 
                      type="text" 
                      name="price"
                      value={formatBRL(formData.price)} 
                      onChange={handleCurrencyChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Antigo (Opcional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input 
                      type="text" 
                      name="oldPrice"
                      value={formData.oldPrice ? formatBRL(formData.oldPrice) : ''} 
                      onChange={handleCurrencyChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Compra</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input 
                      type="text" 
                      name="cost"
                      value={formatBRL(formData.cost)} 
                      onChange={handleCurrencyChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estilo (ex: Moderno)</label>
                  <input 
                    type="text" 
                    name="style" 
                    value={formData.style} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
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
              
              <div className="relative">
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
                
                <p className="text-xs text-gray-500 mt-1 mb-3">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Rua)</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ex: Av. Paulista"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input 
                    type="text" 
                    name="addressNumber" 
                    value={formData.addressNumber || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ex: 1000"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input 
                    type="text" 
                    name="neighborhood" 
                    value={formData.neighborhood || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ex: Bela Vista"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900 border-b pb-2">Cômodos & Características</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                  <input 
                    type="number" 
                    name="bedrooms" 
                    value={formData.bedrooms || ''} 
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                  <input 
                    type="number" 
                    name="bathrooms" 
                    value={formData.bathrooms || ''} 
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garagens (vagas)</label>
                  <input 
                    type="number" 
                    name="garages" 
                    value={formData.garages || ''} 
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cozinhas</label>
                  <input 
                    type="number" 
                    name="kitchens" 
                    value={formData.kitchens || ''} 
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salas</label>
                  <input 
                    type="number" 
                    name="livingRooms" 
                    value={formData.livingRooms || ''} 
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="hasLeisureArea"
                    name="hasLeisureArea"
                    type="checkbox"
                    checked={formData.hasLeisureArea || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasLeisureArea" className="ml-2 text-sm font-medium text-gray-700">
                    Possui Área de Lazer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="isSold"
                    name="isSold"
                    type="checkbox"
                    checked={formData.isSold || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isSold" className="ml-2 text-sm font-medium text-gray-700">
                    Imóvel Vendido
                  </label>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Imagens ({images.length}/10)</h3>
                </div>
                
                {images.length < 10 && (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors mb-4 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className="text-sm text-gray-600 mb-1">Arraste imagens aqui ou</p>
                    <label className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800">
                      clique para fazer upload
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <input 
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Ou adicione via URL (https://...)"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                  />
                  <button 
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!newUrl.trim() || images.length >= 10}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
                  {images.map((img, index) => {
                    const isYT = isYouTubeUrl(img);
                    return (
                    <div 
                      key={index} 
                      className={`relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center cursor-move transition-transform ${draggedImageIndex === index ? 'scale-95 opacity-50' : ''}`}
                      draggable
                      onDragStart={(e) => handleImageDragStart(e, index)}
                      onDragOver={(e) => handleImageDragOver(e, index)}
                      onDragEnd={handleImageDragEnd}
                    >
                      {img ? (
                        <>
                          <img src={isYT ? getYouTubeThumbnail(img) : img} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover" />
                          {isYT && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="bg-white/90 p-1.5 rounded-full">
                                <Youtube className="w-6 h-6 text-red-600" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                      
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-sm z-10 pointer-events-none">
                        {index + 1}
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <div className="p-1.5 bg-white text-gray-700 rounded-full shadow-sm cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-1.5 bg-white text-red-500 hover:bg-red-50 rounded-full shadow-sm transition-colors"
                          title="Remover Imagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )})}
                  {images.length === 0 && (
                    <div className="col-span-full py-4 text-center">
                      <p className="text-xs text-gray-500 italic">Nenhuma imagem adicionada.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors flex items-center disabled:opacity-70"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};
