const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      const formattedProperties = (data || []).map(p => ({
        ...p,
        poi: p.poi || []
      }));
      setProperties(formattedProperties);`;

const replacement = `      let formattedProperties = (data || []).map(p => ({
        ...p,
        poi: p.poi || []
      }));
      
      const settingsProp = formattedProperties.find(p => p.title === '__APP_SETTINGS__');
      if (settingsProp) {
        try {
          const settings = JSON.parse(settingsProp.description);
          if (settings.activePoiTypes) setActivePoiTypes(settings.activePoiTypes);
          if (typeof settings.showPOIs !== 'undefined') setShowPOIs(settings.showPOIs);
          if (typeof settings.showSoldProperties !== 'undefined') setShowSoldProperties(settings.showSoldProperties);
        } catch(e) {}
        formattedProperties = formattedProperties.filter(p => p.title !== '__APP_SETTINGS__');
      }
      
      setProperties(formattedProperties);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
