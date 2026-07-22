const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

// 1. Add UploadCloud and ImageIcon imports
code = code.replace(
  "import { X, Save, Plus, Trash2 } from 'lucide-react';",
  "import { X, Save, Plus, Trash2, UploadCloud, ImageIcon } from 'lucide-react';"
);

// 2. Add isDragging state
code = code.replace(
  "const [images, setImages] = useState<string[]>(property.images || (property.image ? [property.image] : []));",
  `const [images, setImages] = useState<string[]>(property.images || (property.image ? [property.image] : []));
  const [isDragging, setIsDragging] = useState(false);
  const [newUrl, setNewUrl] = useState("");`
);

// 3. Add drag and drop functions
const dragFunctions = `  const processFiles = (files: File[]) => {
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
  };`;

code = code.replace(
  "const handleImageChange = (index: number, value: string) => {",
  dragFunctions + "\n\n  const handleImageChange = (index: number, value: string) => {"
);

// 4. Replace the image UI section
const oldImageUI = /<div className="border-t pt-4">[\s\S]*?<div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">/;

const newImageUI = `<div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Imagens ({images.length}/10)</h3>
                </div>
                
                {images.length < 10 && (
                  <div 
                    className={\`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors mb-4 \${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}\`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadCloud className={\`w-8 h-8 mb-2 \${isDragging ? 'text-blue-500' : 'text-gray-400'}\`} />
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
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {img ? (
                        <img src={img} alt={\`Imagem \${index + 1}\`} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                  ))}
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
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">`;

code = code.replace(oldImageUI, newImageUI);

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
