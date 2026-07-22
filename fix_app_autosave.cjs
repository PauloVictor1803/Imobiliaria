const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert a ref to track initial load
content = content.replace(
  'const [isSavingSettings, setIsSavingSettings] = useState(false);',
  'const [isSavingSettings, setIsSavingSettings] = useState(false);\n  const hasLoadedSettings = React.useRef(false);\n  const isInitialMount = React.useRef(true);'
);

const autoSaveCode = `
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!hasLoadedSettings.current) return;
    if (isAuthenticatedAdmin) {
      // Create a timeout to avoid saving too often on rapid changes
      const timeout = setTimeout(() => {
        handleSaveSettings(true); // pass true to indicate it's auto-save
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [activePoiTypes, showPOIs, showSoldProperties, isAuthenticatedAdmin]);
`;

// Also update handleSaveSettings to not show alert for auto-saves
content = content.replace(
  'const handleSaveSettings = async () => {',
  'const handleSaveSettings = async (isAutoSave = false) => {'
);
content = content.replace(
  "alert('Configurações salvas com sucesso!');",
  "if (!isAutoSave) { /* alert('Configurações salvas com sucesso!'); */ }"
);

content = content.replace(
  'const filteredProperties = React.useMemo(() => {',
  autoSaveCode + '\n  const filteredProperties = React.useMemo(() => {'
);

// We need to set hasLoadedSettings.current = true after fetch
content = content.replace(
  'setProperties(formattedProperties);\n    } catch (error) {',
  'setProperties(formattedProperties);\n      hasLoadedSettings.current = true;\n    } catch (error) {'
);

fs.writeFileSync('src/App.tsx', content);
