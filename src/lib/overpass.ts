import { POIType, PointOfInterest } from "../types";

export const fetchRealPOIs = async (
  south: number,
  west: number,
  north: number,
  east: number,
): Promise<PointOfInterest[]> => {
  const query = `
    [out:json][timeout:25];
    (
      nwr["amenity"~"hospital|university|school|college|kindergarten|restaurant|cafe|fast_food|bar|pub|pharmacy|bank|police|clinic|fuel|place_of_worship|dentist|veterinary|marketplace|gym|health_center|doctors|social_facility|food_court|ice_cream|grave_yard"](${south},${west},${north},${east});
      nwr["healthcare"](${south},${west},${north},${east});
      nwr["shop"~"supermarket|bakery|mall|clothes|shoes|convenience|pet|wholesale|department_store|commercial|apparel|hardware|butcher|greengrocer|deli|kiosk|pastry|grocery|general|minimarket|variety_store"](${south},${west},${north},${east});
      nwr["leisure"~"park|pitch|stadium|sports_centre|fitness_centre|fitness_station|square|club|recreation_ground|sports_hall"](${south},${west},${north},${east});
      nwr["tourism"~"hotel|hostel|museum|attraction"](${south},${west},${north},${east});
      nwr["landuse"~"cemetery"](${south},${west},${north},${east});
      nwr["highway"~"pedestrian"](${south},${west},${north},${east});
      nwr["place"~"square"](${south},${west},${north},${east});
      nwr["club"](${south},${west},${north},${east});
      nwr["name"~"AABB|BNB|Clube|Ceanorte",i](${south},${west},${north},${east});
    );
    out center;
  `;

  const endpoints = [
    "/api/overpass-de",
    "/api/overpass-lz4",
    "/api/overpass-z",
    "/api/overpass-kumi",
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  let data;
  let lastError;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "data=" + encodeURIComponent(query),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch POIs from ${endpoint}`);
      }

      data = await response.json();
      break; // Success, exit the loop
    } catch (err) {
      console.warn(`Overpass API endpoint failed: ${endpoint}`, err);
      lastError = err;
    }
  }

  if (!data) {
    console.error("All Overpass API endpoints failed.");
    return []; // Return empty array to prevent crashing
  }
  const pois: PointOfInterest[] = [];

  data.elements.forEach((el: any) => {
    let type: POIType = "store";
    let name = el.tags?.name || "Local";

    if (el.tags?.amenity) {
      const am = el.tags.amenity;
      if (am === "university" || am === "college") type = "university";
      else if (am === "school") type = "school";
      else if (am === "kindergarten") type = "kindergarten";
      else if (
        am === "hospital" ||
        am === "clinic" ||
        am === "health_center" ||
        am === "doctors" ||
        am === "social_facility"
      )
        type = "hospital";
      else if (am === "restaurant" || am === "food_court") type = "restaurant";
      else if (am === "cafe" || am === "ice_cream") type = "cafe";
      else if (am === "fast_food") type = "snack_bar";
      else if (am === "bar" || am === "pub") type = "bar";
      else if (am === "pharmacy") type = "pharmacy";
      else if (am === "bank") type = "bank";
      else if (am === "police") type = "police_station";
      else if (am === "fuel") type = "gas_station";
      else if (am === "place_of_worship") type = "church";
      else if (am === "dentist") type = "dentist";
      else if (am === "veterinary") type = "veterinary_care";
      else if (am === "marketplace") type = "store";
      else if (am === "gym") type = "gym";
      else if (am === "grave_yard") type = "cemetery";
    } else if (el.tags?.healthcare) {
      type = "hospital";
    } else if (el.tags?.landuse === "cemetery") {
      type = "cemetery";
    } else if (el.tags?.shop) {
      const shop = el.tags.shop;
      if (shop === "supermarket") type = "supermarket";
      else if (shop === "bakery" || shop === "pastry") type = "bakery";
      else if (shop === "mall") type = "mall";
      else if (shop === "clothes" || shop === "apparel")
        type = "clothing_store";
      else if (shop === "shoes") type = "shoe_store";
      else if (shop === "convenience" || shop === "deli" || shop === "kiosk" || shop === "general" || shop === "minimarket" || shop === "variety_store")
        type = "convenience_store";
      else if (shop === "grocery" || shop === "greengrocer") type = "grocery_store";
      else if (shop === "pet") type = "pet_store";
      else if (shop === "hairdresser" || shop === "beauty") type = "beauty_salon";
      else if (
        shop === "wholesale" ||
        shop === "department_store" ||
        shop === "commercial"
      )
        type = "mall";
      else if (shop === "hardware" || shop === "butcher") type = "store";
    } else if (el.tags?.leisure || el.tags?.club) {
      const leisure = el.tags.leisure || el.tags.club;
      if (leisure === "park") type = "park";
      else if (leisure === "pitch" || leisure === "recreation_ground")
        type = "soccer_field";
      else if (
        leisure === "stadium" ||
        leisure === "sports_centre"
      )
        type = "stadium";
      else if (leisure === "fitness_centre" || leisure === "fitness_station")
        type = "gym";
      else if (leisure === "club" || el.tags?.club) type = "club";
    } else if (el.tags?.tourism) {
      const tourism = el.tags.tourism;
      if (tourism === "hotel" || tourism === "hostel") type = "hotel";
      else if (tourism === "museum") type = "museum";
      else if (tourism === "attraction") type = "tourist_attraction";
    } else if (el.tags?.name && /AABB|BNB|Clube/i.test(el.tags.name)) {
      type = "club";
    } else if (el.tags?.name && /Ceanorte/i.test(el.tags.name)) {
      type = "supermarket";
    } else if (
      el.tags?.place === "square" ||
      el.tags?.highway === "pedestrian"
    ) {
      type = "park"; // we can map squares to park so they appear green and nice
    }

    if (el.tags?.name) {
      pois.push({
        id: `op-${el.type}-${el.id}`,
        type,
        name: el.tags.name,
        distance: "", // dynamically calculated later if needed
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
      });
    }
  });

  return pois;
};
