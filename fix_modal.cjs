const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

// Replace Preço Atual input
const oldPriceInput = `<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Atual (R$)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>`;

const newPriceInput = `<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Atual</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input 
                      type="number" 
                      name="price"
                      step="0.01"
                      value={formData.price || ''} 
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>`;
code = code.replace(oldPriceInput, newPriceInput);

// Replace Valor de Compra input
const oldCostInput = `<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Compra (R$)</label>
                  <input 
                    type="number" 
                    name="cost" 
                    value={formData.cost || ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>`;

const newCostInput = `<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Compra</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input 
                      type="number" 
                      name="cost"
                      step="0.01"
                      value={formData.cost || ''} 
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>`;
code = code.replace(oldCostInput, newCostInput);

// Update handleChange to support floats (Number(value) handles floats if they use standard . decimal, but input type="number" with step="0.01" allows it)
// We already have `Number(value)` so it should work fine for floats.

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
