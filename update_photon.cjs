const fs = require('fs');
let code = fs.readFileSync('src/components/EditPropertyModal.tsx', 'utf8');

const photonLogic = `  const formatPhotonAddress = (properties: any) => {
    const parts = [];
    if (properties.name) parts.push(properties.name);
    if (properties.housenumber) parts.push(properties.housenumber);
    if (properties.street && properties.street !== properties.name) parts.push(properties.street);
    if (properties.district) parts.push(properties.district);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);
    return parts.join(', ');
  };

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    try {
      // Use Photon API which is much better for natural language and partial addresses in Brazil
      const response = await fetch(\`https://photon.komoot.io/api/?q=\${encodeURIComponent(query)}&limit=5\`);
      const data = await response.json();
      
      if (data && data.features) {
        const formattedResults = data.features.map((f: any) => ({
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
          display_name: formatPhotonAddress(f.properties)
        }));
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsSearching(false);
    }
  };`;

const searchRegex = /  const searchAddress = async \(query: string\) => \{[\s\S]*?  \};\n/m;
code = code.replace(searchRegex, photonLogic + '\n');

fs.writeFileSync('src/components/EditPropertyModal.tsx', code);
