import React, { useState } from 'react';
import { Property, FilterOptions } from '../types';
import { SearchBar } from './SearchBar';
import { MapPin, DollarSign, Maximize, TrendingUp, Edit2, BedDouble, Bath, Car, ChevronLeft, ChevronRight, ChefHat, Sofa, TreePine, Plus, ArrowLeft, Eye, EyeOff } from 'lucide-react';


const PropertyImageSlider: React.FC<{ property: Property, onSelect: () => void }> = ({ property, onSelect }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  
  return (
    <div 
      className="h-48 w-full overflow-hidden relative group/slider"
      onClick={onSelect}
    >
      <img 
        src={images[currentIndex]} 
        alt={property.title}
        className={`w-full h-full object-cover transition-transform hover:scale-105 duration-500 ${property.isSold ? 'opacity-50 grayscale' : ''}`}
      />
      {property.isSold && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="bg-red-600 text-white font-black text-2xl px-6 py-2 rounded-lg tracking-widest shadow-lg border-2 border-white">
            VENDIDO
          </span>
        </div>
      )}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

interface MyPropertiesProps {
  properties: Property[];
  onPropertySelect: (id: string) => void;
  setActiveTab: (tab: string) => void;
  onEditProperty: (property: Property) => void;
  onSaveProperty?: (property: Property) => void;
  isAdmin?: boolean;
  showSoldProperties?: boolean;
  setShowSoldProperties?: (show: boolean) => void;
}

export const MyProperties: React.FC<MyPropertiesProps> = ({ 
  properties, 
  onPropertySelect, 
  setActiveTab, 
  onEditProperty, 
  onSaveProperty,
  isAdmin = true,
  showSoldProperties,
  setShowSoldProperties
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    bedrooms: null,
    bathrooms: null,
    garages: null,
    hasLeisureArea: null,
    hideSold: null
  });

  const filteredProperties = properties.filter(p => {
    // If Admin wants to hide sold properties via the SearchBar filter
    if (isAdmin && filters.hideSold && p.isSold) return false;
    // If client, we use the global showSoldProperties toggle
    if (!isAdmin && !showSoldProperties && p.isSold) return false;

    const titleStr = p.title || '';
    const descStr = p.description || '';
    
    const matchesSearch = titleStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          descStr.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesBedrooms = filters.bedrooms === null || (p.bedrooms !== undefined && (filters.bedrooms === 4 ? p.bedrooms >= 4 : p.bedrooms === filters.bedrooms));
    const matchesBathrooms = filters.bathrooms === null || (p.bathrooms !== undefined && (filters.bathrooms === 4 ? p.bathrooms >= 4 : p.bathrooms === filters.bathrooms));
    const matchesGarages = filters.garages === null || (p.garages !== undefined && (filters.garages === 4 ? p.garages >= 4 : p.garages === filters.garages));
    const matchesLeisure = filters.hasLeisureArea === null || p.hasLeisureArea === filters.hasLeisureArea;

    return matchesSearch && matchesBedrooms && matchesBathrooms && matchesGarages && matchesLeisure;
  }).sort((a, b) => {
    if (a.isSold === b.isSold) return 0;
    return a.isSold ? 1 : -1;
  });

  return (
    <div className="absolute inset-0 z-40 bg-gray-50 flex flex-col pt-20 pb-8 px-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3 md:pl-0 pl-16">
              <h1 className="text-3xl font-bold text-gray-900">Minhas Casas</h1>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer select-none" htmlFor="toggle-hide-sold-local">
                    Mostrar imóveis vendidos ao cliente?
                  </label>
                  <div 
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${showSoldProperties ? 'bg-blue-900' : 'bg-gray-300'}`}
                    onClick={() => setShowSoldProperties(!showSoldProperties)}
                    id="toggle-hide-sold-local"
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showSoldProperties ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
              </div>
            )}
            
            {isAdmin && (
              <button
                onClick={() => onEditProperty({
                  id: `new-${Date.now()}`,
                  title: '',
                  description: '',
                  price: 0,
                  cost: 0,
                  area: 0,
                  style: '',
                  image: '',
                  images: [],
                  bedrooms: 0,
                  bathrooms: 0,
                  garages: 0,
                  kitchens: 0,
                  livingRooms: 0,
                  hasLeisureArea: false,
          isSold: false,
                  lat: -16.735,
                  lng: -43.861,
                  poi: []
                })}
                className="md:hidden flex items-center justify-center bg-blue-900 text-white w-12 h-12 rounded-lg hover:bg-blue-800 transition-colors shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="relative z-50 flex items-center gap-3 w-full md:w-auto">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              isAdmin={isAdmin}
              className="relative w-full md:w-80"
            />
            {isAdmin && (
              <button
                onClick={() => onEditProperty({
                  id: `new-${Date.now()}`,
                  title: '',
                  description: '',
                  price: 0,
                  cost: 0,
                  area: 0,
                  style: '',
                  image: '',
                  images: [],
                  bedrooms: 0,
                  bathrooms: 0,
                  garages: 0,
                  kitchens: 0,
                  livingRooms: 0,
                  hasLeisureArea: false,
          isSold: false,
                  lat: -16.735,
                  lng: -43.861,
                  poi: []
                })}
                className="hidden md:flex items-center gap-2 bg-blue-900 text-white px-4 h-12 rounded-lg hover:bg-blue-800 transition-colors shadow-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Imóvel</span>
              </button>
            )}
          </div>
        </div>
        
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Nenhuma propriedade encontrada.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col group relative"
              >
                
                <PropertyImageSlider 
                  property={property} 
                  onSelect={() => {
                    onPropertySelect(property.id);
                    setActiveTab('dashboard'); // go back to map view
                  }} 
                />

                
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProperty(property);
                      }}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-colors"
                      title="Editar Imóvel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {onSaveProperty && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveProperty({ ...property, isSold: !property.isSold });
                        }}
                        className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md transition-colors ${property.isSold ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-600 hover:bg-red-50'}`}
                        title={property.isSold ? "Marcar como Disponível" : "Marcar como Vendido/Bloqueado"}
                      >
                        {property.isSold ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                )}

                <div 
                  className="p-5 flex flex-col flex-1 cursor-pointer"
                  onClick={() => {
                    onPropertySelect(property.id);
                    setActiveTab('dashboard'); // go back to map view
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2 whitespace-nowrap">
                      {property.style}
                    </span>
                  </div>
                  {(property.address || property.neighborhood) && (
                    <div className="flex items-start gap-1 text-xs text-gray-500 mb-2 truncate">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className="truncate">
                        {property.address}
                        {property.addressNumber ? `, ${property.addressNumber}` : ''}
                        {property.neighborhood ? ` - ${property.neighborhood}` : ''}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                    {property.description}
                  </p>
                  
                  
                  <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center" title="Área">
                      <Maximize className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{property.area} m²</span>
                    </div>
                    {property.bedrooms !== undefined && (
                      <div className="flex items-center" title="Quartos">
                        <BedDouble className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms !== undefined && (
                      <div className="flex items-center" title="Banheiros">
                        <Bath className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.garages !== undefined && (
                      <div className="flex items-center" title="Garagens">
                        <Car className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{property.garages}</span>
                      </div>
                    )}
                    {property.kitchens !== undefined && (
                      <div className="flex items-center" title="Cozinhas">
                        <ChefHat className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{property.kitchens}</span>
                      </div>
                    )}
                    {property.livingRooms !== undefined && (
                      <div className="flex items-center" title="Salas">
                        <Sofa className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{property.livingRooms}</span>
                      </div>
                    )}
                    {property.hasLeisureArea && (
                      <div className="flex items-center text-emerald-600" title="Área de Lazer">
                        <TreePine className="w-4 h-4 mr-1" />
                        <span>Área de Lazer</span>
                      </div>
                    )}
                  </div>
                             <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-2">
                      {property.oldPrice && property.oldPrice > property.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">Antes:</span>
                          <span className="text-xs font-medium text-gray-400 line-through">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.oldPrice)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Preço Atual</p>
                        <p className="text-lg font-bold text-gray-900 leading-none">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col justify-end items-end">
                        <p className="text-xs text-gray-500 mb-1">Lucro Est.</p>
                        <p className="text-sm font-bold text-emerald-600 flex items-center justify-end">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price - property.cost)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
