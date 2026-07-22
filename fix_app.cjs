const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert isSavingSettings state
content = content.replace(
  'const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);',
  'const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);\n  const [isSavingSettings, setIsSavingSettings] = useState(false);'
);

// Define handleSaveSettings
const saveSettingsFunc = `
  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      const settingsData = {
        activePoiTypes,
        showPOIs,
        showSoldProperties
      };
      
      const payload = {
        title: '__APP_SETTINGS__',
        description: JSON.stringify(settingsData),
        price: 0,
        cost: 0,
        area: 0,
        style: 'settings',
        image: '',
        lat: 0,
        lng: 0,
        poi: []
      };

      // Check if it already exists
      const { data: existing } = await supabase
        .from('properties')
        .select('id')
        .eq('title', '__APP_SETTINGS__')
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from('properties')
          .update(payload)
          .eq('id', existing[0].id);
      } else {
        await supabase
          .from('properties')
          .insert([payload]);
      }
      
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSavingSettings(false);
    }
  };
`;

content = content.replace(
  'const filteredProperties = React.useMemo(() => {',
  saveSettingsFunc + '\n  const filteredProperties = React.useMemo(() => {'
);

// Pass to SettingsPanel
content = content.replace(
  /activePoiTypes=\{activePoiTypes\}\n\s*setActivePoiTypes=\{setActivePoiTypes\}\n\s*showSoldProperties=\{showSoldProperties\}\n\s*setShowSoldProperties=\{setShowSoldProperties\}\n\s*\/>/g,
  'activePoiTypes={activePoiTypes}\n            setActivePoiTypes={setActivePoiTypes}\n            showSoldProperties={showSoldProperties}\n            setShowSoldProperties={setShowSoldProperties}\n            onSave={handleSaveSettings}\n            isSaving={isSavingSettings}\n          />'
);

fs.writeFileSync('src/App.tsx', content);
