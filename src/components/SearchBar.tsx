import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterOptions } from '../types';

interface SearchBarProps {
  className?: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  isAdmin?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, filters, setFilters, isAdmin = false, className = "absolute top-4 left-4 z-[400]" }) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== null).length;

  return (
    <div className={className} ref={filterRef}>
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 flex items-center h-12 overflow-hidden">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar imóvel..." 
          className="flex-1 min-w-0 px-4 h-full text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`h-full px-3 transition-colors border-l border-gray-200 relative shrink-0 ${showFilters ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          {activeFiltersCount > 0 && (
            <span className="absolute top-2 right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <button className="bg-blue-900 text-white px-5 h-full flex items-center justify-center hover:bg-blue-800 transition-colors border-l border-blue-900 shrink-0">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            <button 
              onClick={() => setFilters({ bedrooms: null, bathrooms: null, garages: null, hasLeisureArea: null, hideSold: null })}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Limpar Todos
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
              <select 
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Qualquer quantidade</option>
                <option value="1">1 Quarto</option>
                <option value="2">2 Quartos</option>
                <option value="3">3 Quartos</option>
                <option value="4">4+ Quartos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
              <select 
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Qualquer quantidade</option>
                <option value="1">1 Banheiro</option>
                <option value="2">2 Banheiros</option>
                <option value="3">3 Banheiros</option>
                <option value="4">4+ Banheiros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas de Garagem</label>
              <select 
                value={filters.garages || ''}
                onChange={(e) => handleFilterChange('garages', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Qualquer quantidade</option>
                <option value="1">1 Vaga</option>
                <option value="2">2 Vagas</option>
                <option value="3">3 Vagas</option>
                <option value="4">4+ Vagas</option>
              </select>
            </div>
            
            <div className="flex items-center pt-2">
              <input
                id="filterLeisure"
                type="checkbox"
                checked={filters.hasLeisureArea || false}
                onChange={(e) => handleFilterChange('hasLeisureArea', e.target.checked ? true : null)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="filterLeisure" className="ml-2 text-sm font-medium text-gray-700">
                Possui Área de Lazer
              </label>
            </div>
            {isAdmin && (
              <div className="flex items-center pt-2">
                <input
                  id="filterHideSold"
                  type="checkbox"
                  checked={filters.hideSold || false}
                  onChange={(e) => handleFilterChange('hideSold', e.target.checked ? true : null)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="filterHideSold" className="ml-2 text-sm font-medium text-gray-700">
                  Ocultar imóveis vendidos
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
