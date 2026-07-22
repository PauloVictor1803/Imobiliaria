const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldFilteredProperties = `  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesBedrooms = filters.bedrooms === null || (p.bedrooms !== undefined && (filters.bedrooms === 4 ? p.bedrooms >= 4 : p.bedrooms === filters.bedrooms));
    const matchesBathrooms = filters.bathrooms === null || (p.bathrooms !== undefined && (filters.bathrooms === 4 ? p.bathrooms >= 4 : p.bathrooms === filters.bathrooms));
    const matchesGarages = filters.garages === null || (p.garages !== undefined && (filters.garages === 4 ? p.garages >= 4 : p.garages === filters.garages));
    const matchesLeisure = filters.hasLeisureArea === null || p.hasLeisureArea === filters.hasLeisureArea;

    return matchesSearch && matchesBedrooms && matchesBathrooms && matchesGarages && matchesLeisure;
  });`;

const newFilteredProperties = `  const filteredProperties = React.useMemo(() => {
    return properties.filter(p => {
      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch = p.title.toLowerCase().includes(lowerSearch) || 
                            p.description.toLowerCase().includes(lowerSearch);
                            
      const matchesBedrooms = filters.bedrooms === null || (p.bedrooms !== undefined && (filters.bedrooms === 4 ? p.bedrooms >= 4 : p.bedrooms === filters.bedrooms));
      const matchesBathrooms = filters.bathrooms === null || (p.bathrooms !== undefined && (filters.bathrooms === 4 ? p.bathrooms >= 4 : p.bathrooms === filters.bathrooms));
      const matchesGarages = filters.garages === null || (p.garages !== undefined && (filters.garages === 4 ? p.garages >= 4 : p.garages === filters.garages));
      const matchesLeisure = filters.hasLeisureArea === null || p.hasLeisureArea === filters.hasLeisureArea;

      return matchesSearch && matchesBedrooms && matchesBathrooms && matchesGarages && matchesLeisure;
    });
  }, [properties, searchQuery, filters]);`;

code = code.replace(oldFilteredProperties, newFilteredProperties);

const oldSelectedProperty = `  const selectedProperty = filteredProperties.find(p => p.id === selectedPropertyId);`;
const newSelectedProperty = `  const selectedProperty = React.useMemo(() => filteredProperties.find(p => p.id === selectedPropertyId), [filteredProperties, selectedPropertyId]);`;

code = code.replace(oldSelectedProperty, newSelectedProperty);

const oldUseState = `import React, { useState } from 'react';`;
const newUseState = `import React, { useState, useMemo, useCallback } from 'react';`;

code = code.replace(oldUseState, newUseState);

const oldHandleUpdateProperty = `  const handleUpdateProperty = async (updatedProperty: Property) => {
    // In the future, this will be a Supabase update call
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };`;

const newHandleUpdateProperty = `  const handleUpdateProperty = useCallback(async (updatedProperty: Property) => {
    // In the future, this will be a Supabase update call
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  }, []);`;

code = code.replace(oldHandleUpdateProperty, newHandleUpdateProperty);

fs.writeFileSync('src/App.tsx', code);
