const fs = require('fs');
let content = fs.readFileSync('src/lib/overpass.ts', 'utf8');

const queryMatch = /const query = `([\s\S]*?)`;/;

const newQuery = `const query = \`
    [out:json][timeout:25];
    (
      nwr["amenity"~"hospital|university|school|college|kindergarten|restaurant|cafe|fast_food|bar|pub|pharmacy|bank|police|clinic|fuel|place_of_worship|dentist|veterinary"](\${south},\${west},\${north},\${east});
      nwr["shop"~"supermarket|bakery|mall|clothes|shoes|convenience|pet"](\${south},\${west},\${north},\${east});
      nwr["leisure"~"park|pitch|stadium|sports_centre|fitness_centre|fitness_station|square"](\${south},\${west},\${north},\${east});
      nwr["tourism"~"hotel|hostel|museum|attraction"](\${south},\${west},\${north},\${east});
      nwr["highway"~"pedestrian"](\${south},\${west},\${north},\${east});
      nwr["place"~"square"](\${south},\${west},\${north},\${east});
    );
    out center;
  \`;`;

content = content.replace(queryMatch, newQuery);

const loopMatch = /if \(el\.tags\?\.amenity\) \{([\s\S]*?)else if \(\s*el\.tags\?\.place === "square"/;

const newLoop = `if (el.tags?.amenity) {
      const am = el.tags.amenity;
      if (am === "university" || am === "college") type = "university";
      else if (am === "school") type = "school";
      else if (am === "kindergarten") type = "kindergarten";
      else if (am === "hospital" || am === "clinic") type = "hospital";
      else if (am === "restaurant") type = "restaurant";
      else if (am === "cafe") type = "cafe";
      else if (am === "fast_food") type = "snack_bar";
      else if (am === "bar" || am === "pub") type = "bar";
      else if (am === "pharmacy") type = "pharmacy";
      else if (am === "bank") type = "bank";
      else if (am === "police") type = "police_station";
      else if (am === "fuel") type = "gas_station";
      else if (am === "place_of_worship") type = "church";
      else if (am === "dentist") type = "dentist";
      else if (am === "veterinary") type = "veterinary_care";
    } else if (el.tags?.shop) {
      const shop = el.tags.shop;
      if (shop === "supermarket") type = "supermarket";
      else if (shop === "bakery") type = "bakery";
      else if (shop === "mall") type = "mall";
      else if (shop === "clothes") type = "clothing_store";
      else if (shop === "shoes") type = "shoe_store";
      else if (shop === "convenience") type = "convenience_store";
      else if (shop === "pet") type = "pet_store";
    } else if (el.tags?.leisure) {
      const leisure = el.tags.leisure;
      if (leisure === "park") type = "park";
      else if (
        leisure === "pitch" ||
        leisure === "stadium" ||
        leisure === "sports_centre"
      )
        type = "stadium";
      else if (leisure === "fitness_centre" || leisure === "fitness_station")
        type = "gym";
    } else if (el.tags?.tourism) {
      const tourism = el.tags.tourism;
      if (tourism === "hotel" || tourism === "hostel") type = "hotel";
      else if (tourism === "museum") type = "museum";
      else if (tourism === "attraction") type = "tourist_attraction";
    } else if (
      el.tags?.place === "square"`;

content = content.replace(loopMatch, newLoop);

fs.writeFileSync('src/lib/overpass.ts', content);
