const fs = require('fs');
let code = fs.readFileSync('src/components/MyProperties.tsx', 'utf8');

// Imports
code = code.replace(
  "import { Property } from '../types';",
  "import { Property, FilterOptions } from '../types';\nimport { SearchBar } from './SearchBar';"
);
code = code.replace(
  "import React from 'react';",
  "import React, { useState } from 'react';"
);

// Add state and filtering
const filteringLogic = `  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    bedrooms: null,
    bathrooms: null,
    garages: null,
    hasLeisureArea: null
  });

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesBedrooms = filters.bedrooms === null || (p.bedrooms !== undefined && (filters.bedrooms === 4 ? p.bedrooms >= 4 : p.bedrooms === filters.bedrooms));
    const matchesBathrooms = filters.bathrooms === null || (p.bathrooms !== undefined && (filters.bathrooms === 4 ? p.bathrooms >= 4 : p.bathrooms === filters.bathrooms));
    const matchesGarages = filters.garages === null || (p.garages !== undefined && (filters.garages === 4 ? p.garages >= 4 : p.garages === filters.garages));
    const matchesLeisure = filters.hasLeisureArea === null || p.hasLeisureArea === filters.hasLeisureArea;

    return matchesSearch && matchesBedrooms && matchesBathrooms && matchesGarages && matchesLeisure;
  });

  return (`;

code = code.replace(
  "export const MyProperties: React.FC<MyPropertiesProps> = ({ properties, onPropertySelect, setActiveTab, onEditProperty }) => {\n  return (",
  "export const MyProperties: React.FC<MyPropertiesProps> = ({ properties, onPropertySelect, setActiveTab, onEditProperty }) => {\n" + filteringLogic
);

// Add SearchBar UI and change properties to filteredProperties
const headerUI = `<div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Casas</h1>
          <div className="relative z-10">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              className="relative w-full"
            />
          </div>
        </div>
        
        {filteredProperties.length === 0 ? (`;

code = code.replace(
  /<div className="max-w-6xl mx-auto w-full">\s*<h1 className="text-3xl font-bold text-gray-900 mb-8">Minhas Casas<\/h1>\s*\{properties\.length === 0 \? \(/,
  headerUI
);

// Change `properties.map` to `filteredProperties.map`
code = code.replace(
  "{properties.map((property) => (",
  "{filteredProperties.map((property) => ("
);

fs.writeFileSync('src/components/MyProperties.tsx', code);
