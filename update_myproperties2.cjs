const fs = require('fs');
let code = fs.readFileSync('src/components/MyProperties.tsx', 'utf8');

code = code.replace(
  "import { MapPin, DollarSign, Maximize, TrendingUp, Edit2, BedDouble, Bath, Car, ChevronLeft, ChevronRight } from 'lucide-react';",
  "import { MapPin, DollarSign, Maximize, TrendingUp, Edit2, BedDouble, Bath, Car, ChevronLeft, ChevronRight, ChefHat, Sofa, TreePine } from 'lucide-react';"
);

const oldFlexBox = /<div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">.*?<\/div>\s*<div className="flex justify-between items-center mt-auto">/s;

const newFlexBox = `
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
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
                        <span>Lazer</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto">
`;

code = code.replace(oldFlexBox, newFlexBox);
fs.writeFileSync('src/components/MyProperties.tsx', code);
