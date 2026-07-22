export type POIType = 'supermarket' | 'school' | 'park' | 'center' | 'pharmacy' | 'restaurant' | 'hospital' | 'bar' | 'hotel' | 'event' | 'cemetery' | 'gas_station' | 'bank' | 'gym' | 'mall' | 'museum' | 'bus_station' | 'cafe' | 'bakery' | 'church' | 'airport' | 'atm' | 'beauty_salon' | 'book_store' | 'clothing_store' | 'convenience_store' | 'dentist' | 'doctor' | 'electronics_store' | 'fire_station' | 'library' | 'movie_theater' | 'night_club' | 'pet_store' | 'police' | 'post_office' | 'shoe_store' | 'spa' | 'stadium' | 'store' | 'subway_station' | 'tourist_attraction' | 'train_station' | 'veterinary_care' | 'zoo' | 'university' | 'ambulance' | 'health_center' | 'grocery_store' | 'kindergarten' | 'club' | 'snack_bar' | 'pizzeria' | 'police_station' | 'military_police' | 'soccer_field';

export interface PointOfInterest {
  id: string;
  type: POIType;
  name: string;
  distance: string; // e.g., '1.2km'
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  cost: number; // to calculate profit
  area: number;
  style: string;
  image: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  kitchens?: number;
  livingRooms?: number;
  hasLeisureArea?: boolean;
  isSold?: boolean;
  address?: string;
  addressNumber?: string;
  neighborhood?: string;
  lat: number;
  lng: number;
  poi: PointOfInterest[];
}

export interface FilterOptions {
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  hasLeisureArea: boolean | null;
  hideSold: boolean | null;
}
