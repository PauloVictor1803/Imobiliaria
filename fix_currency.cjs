const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

const helpers = `
  const formatBRL = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === '') return '';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digits = value.replace(/\\D/g, '');
    if (!digits) {
      setFormData(prev => ({ ...prev, [name]: 0 }));
      return;
    }
    const numericValue = parseInt(digits, 10) / 100;
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };
`;

code = code.replace(
  "const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {",
  helpers + "\n  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {"
);

// Replace price input
const oldPriceInput = `<input 
                      type="number" 
                      name="price"
                      step="0.01"
                      value={formData.price || ''} 
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />`;

const newPriceInput = `<input 
                      type="text" 
                      name="price"
                      value={formatBRL(formData.price)} 
                      onChange={handleCurrencyChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />`;
code = code.replace(oldPriceInput, newPriceInput);

// Replace cost input
const oldCostInput = `<input 
                      type="number" 
                      name="cost"
                      step="0.01"
                      value={formData.cost || ''} 
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />`;

const newCostInput = `<input 
                      type="text" 
                      name="cost"
                      value={formatBRL(formData.cost)} 
                      onChange={handleCurrencyChange}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />`;
code = code.replace(oldCostInput, newCostInput);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
