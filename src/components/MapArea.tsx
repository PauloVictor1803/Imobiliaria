import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Property, PointOfInterest } from '../types';
import { isYouTubeUrl, getYouTubeThumbnail } from '../lib/youtube';

interface MapAreaProps {
  properties: Property[];
  selectedProperty?: Property;
  selectedPropertyId: string | null;
  onPropertySelect: (id: string) => void;
  globalPois: PointOfInterest[];
  showPOIs: boolean;
  activePoiTypes: string[];
}

// Custom icon creator function
const createCustomIcon = (property: Property, isSelected: boolean) => {
  const isSold = property.isSold;
  const borderColor = isSold ? (isSelected ? 'border-red-600' : 'border-red-400') : (isSelected ? 'border-blue-500' : 'border-white');
  const arrowColor = isSold ? (isSelected ? 'border-t-red-600' : 'border-t-red-400') : (isSelected ? 'border-t-blue-500' : 'border-t-white');

  return L.divIcon({
    className: 'custom-marker-icon z-50',
    html: `
      <div class="relative group cursor-pointer" style="width: ${isSelected ? '64px' : '48px'}; height: ${isSelected ? '64px' : '48px'}; transition: all 0.3s ease;">
        <div class="absolute inset-0 bg-white rounded-full shadow-md border-4 ${borderColor} flex items-center justify-center overflow-hidden z-10">
          <img src="${isYouTubeUrl(property.image) ? getYouTubeThumbnail(property.image) : property.image}" alt="${property.title}" class="w-full h-full object-cover ${isSold ? 'opacity-50 grayscale' : ''}" />
        </div>
        ${isSold ? `<div class="absolute -top-1 -right-4 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-sm border border-white">VENDIDO</div>` : ''}
        <div class="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] ${arrowColor}"></div>
      </div>
    `,
    iconSize: [isSelected ? 64 : 48, isSelected ? 74 : 58],
    iconAnchor: [isSelected ? 32 : 24, isSelected ? 74 : 58],
  });
};

const getPoiIconColor = (type: string) => {
  switch (type) {
    case 'supermarket': return '#3b82f6'; // blue-500
    case 'school': return '#9333ea'; // purple-600
    case 'kindergarten': return '#d946ef'; // fuchsia-500
    case 'park': return '#059669'; // emerald-600
    case 'center': return '#22c55e'; // green-500
    case 'pharmacy': return '#ef4444'; // red-500
    case 'restaurant': return '#f97316'; // orange-500
    case 'hospital': return '#ef4444'; // red-500
    case 'bar': return '#f97316'; // orange-500
    case 'hotel': return '#ec4899'; // pink-500
    case 'cemetery': return '#64748b'; // slate-500
    case 'event': return '#a855f7'; // purple-500
    case 'gas_station': return '#eab308'; // yellow-500
    case 'bank': return '#0ea5e9'; // sky-500
    case 'gym': return '#f43f5e'; // rose-500
    case 'mall': return '#8b5cf6'; // violet-500
    case 'museum': return '#d946ef'; // fuchsia-500
    case 'bus_station': return '#14b8a6'; // teal-500
    case 'cafe': return '#84cc16'; // lime-500
    case 'bakery': return '#f59e0b'; // amber-500
    case 'church': return '#6366f1'; // indigo-500
    case 'airport': return '#3b82f6';
    case 'atm': return '#22c55e';
    case 'beauty_salon': return '#ec4899';
    case 'book_store': return '#8b5cf6';

    case 'clothing_store': return '#ec4899';
    case 'convenience_store': return '#f59e0b';
    case 'dentist': return '#06b6d4';
    case 'doctor': return '#ef4444';
    case 'electronics_store': return '#8b5cf6';
    case 'fire_station': return '#ef4444';
    case 'library': return '#8b5cf6';
    case 'movie_theater': return '#f43f5e';
    case 'night_club': return '#a855f7';
    case 'pet_store': return '#14b8a6';
    case 'police': 
    case 'police_station':
    case 'military_police': return '#3b82f6';
    case 'post_office': return '#eab308';
    case 'shoe_store': return '#ec4899';
    case 'spa': return '#ec4899';
    case 'stadium': 
    case 'soccer_field': return '#10b981';
    case 'store': return '#8b5cf6';
    case 'subway_station': return '#3b82f6';
    case 'tourist_attraction': return '#f43f5e';
    case 'train_station': return '#3b82f6';
    case 'veterinary_care': return '#14b8a6';
    case 'zoo': return '#10b981';
    case 'university': return '#4f46e5'; // indigo-600
    case 'ambulance': return '#ef4444'; // red-500
    case 'health_center': return '#10b981'; // emerald-500
    case 'grocery_store': return '#f59e0b'; // amber-500

    case 'club': return '#06b6d4'; // cyan-500
    case 'snack_bar': return '#fb923c'; // orange-400
    case 'pizzeria': return '#ef4444'; // red-500
    default: return '#64748b'; // slate-500 as safe fallback
  }
};

const getPoiSvg = (type: string) => {
  switch (type) {
    case 'supermarket': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
    case 'school': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a2 2 0 0 1-.019 3.836L12 18.6l-9.4-3.842a2 2 0 0 1-.019-3.836l9.2-4.045a2.1 2.1 0 0 1 1.95 0l9.2 4.045z"/><path d="M14 14.2v3.744a4 4 0 0 1-4 0V14.2"/><path d="M20 11.2v3.74a4 4 0 0 1-4 0V11.2"/><path d="M4 11.2v3.74a4 4 0 0 1 4 0V11.2"/><path d="M21.42 10.922l-9.2-4.045a2.1 2.1 0 0 0-1.95 0l-9.2 4.045a2 2 0 0 0 .019 3.836L12 18.6l9.4-3.842a2 2 0 0 0 .019-3.836z"/><path d="M22 10v6"/></svg>`;
    case 'park': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 14 3 3.32C20.88 18.28 20.32 19 19.14 19H4.86c-1.18 0-1.74-.72-.86-1.68L7 14"/><path d="m14 10 3 3.32c.88.96.32 1.68-.86 1.68H7.86c-1.18 0-1.74-.72-.86-1.68L10 10"/><path d="m11 6 3 3.32c.88.96.32 1.68-.86 1.68H7.86c-1.18 0-1.74-.72-.86-1.68L10 6"/><path d="M12 2v4"/><path d="M12 19v3"/></svg>`;
    case 'pharmacy': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`;
    case 'restaurant': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
    case 'hospital': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5Z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>`;
    case 'bar': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 15h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2"/><path d="M2 9v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M6 21v-6"/><path d="M10 21v-6"/><path d="M2 21h12"/></svg>`;
    case 'hotel': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`;
    case 'cemetery': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M9 6h6"/><path d="M5 22h14"/><path d="M7 22v-8a5 5 0 0 1 10 0v8"/></svg>`;
    case 'event': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
    case 'gas_station': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="4" y1="9" x2="20" y2="9"></line><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"></path></svg>`;
    case 'bank': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="22" y1="12" x2="2" y2="12"></line><path d="M15 15h4v4h-4z"></path><path d="M5 15h4v4H5z"></path><path d="M15 5h4v4h-4z"></path><path d="M5 5h4v4H5z"></path></svg>`; // placeholder icon
    case 'gym': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.8 11.2a5 5 0 0 0-7.6 0"/><path d="M5.2 11.2a5 5 0 0 0 7.6 0"/><path d="M6 18h12"/><path d="M12 18v4"/><path d="m18 14 3-3-3-3"/><path d="m6 14-3-3 3-3"/></svg>`; // dumbbell approx
    case 'mall': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>`; // shopping cart
    case 'museum': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16A2 2 0 0 0 22 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path><line x1="8" y1="6" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="18"></line><line x1="12" y1="6" x2="12" y2="18"></line></svg>`; // classical building / column approx
    case 'bus_station': 
    case 'subway_station': 
    case 'train_station': 
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2l.64-2.54c.24-.96.36-1.92.36-2.9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4.56c0 .98.12 1.94.36 2.9L4 17h2"></path><path d="M14 17h-4"></path><path d="M15 6h-6"></path><path d="M15 10h-6"></path><path d="M7.5 14h.01"></path><path d="M16.5 14h.01"></path><path d="M8 22v-5"></path><path d="M16 22v-5"></path></svg>`;
    case 'cafe': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>`;
    case 'stadium':
    case 'soccer_field':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><path d="M12 12h.01"/></svg>`; // Goal/Ball approx (Dribbble)
    case 'bakery': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7 3-3 3 3"></path><path d="m15 7 3-3 3 3"></path><path d="m3 13 3-3 3 3"></path><path d="m15 13 3-3 3 3"></path><path d="m3 19 3-3 3 3"></path><path d="m15 19 3-3 3 3"></path></svg>`; // somewhat bread/waves
    case 'church': return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M8 6h8"/><path d="m18 22 2-2-4-8-4-8-4 8-4 8 2 2h10Z"/></svg>`; // church / chapel approx
    case 'book_store':
    case 'library':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>`; // book
    case 'clothing_store':
    case 'shoe_store':
    case 'convenience_store':
    case 'electronics_store':
    case 'pet_store':
    case 'grocery_store':
    case 'store':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`; // shopping bag
    case 'dentist':
    case 'doctor':
    case 'veterinary_care':
    case 'health_center':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5Z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>`; // health cross
    case 'atm':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`; // credit card
    case 'airport':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3 6 3.1-4 4-3.6-1.2-1.7 1.7L4 20l2.5-1.3 1.7-1.7-1.2-3.6 4-4 3.1 6 3-1.2c.5-.2.8-.6.7-1.1Z"/></svg>`; // plane
    case 'university':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4-8 4-8-4Z"/><path d="M18 10v6"/><path d="M4 10v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"/><path d="M12 10v11"/></svg>`; // graduation cap
    case 'ambulance':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/><path d="M14 8h4.54a2 2 0 0 1 1.76 1.05l2.4 4.53V18h-2"/><circle cx="17.5" cy="17.5" r="2.5"/><circle cx="4.5" cy="17.5" r="2.5"/><path d="M10 8v4"/></svg>`; // ambulance approx
    case 'snack_bar':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 11v3"/><path d="M12 11v3"/><path d="M8 11v3"/><path d="M5 14h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z"/><path d="M5 11h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2Z"/></svg>`; // sandwich
    case 'pizzeria':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>`; // pizza
    case 'club':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6 0 1.2-.2 1.7-.6C4.8 4.7 5.9 4 7 4s2.2.7 3.3 1.4C10.8 5.8 11.4 6 12 6s1.2-.2 1.7-.6C14.8 4.7 15.9 4 17 4s2.2.7 3.3 1.4C21.4 5.8 22 6 22 6"/><path d="M2 12c.6 0 1.2-.2 1.7-.6C4.8 10.7 5.9 10 7 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 10.7 15.9 10 17 10s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/><path d="M2 18c.6 0 1.2-.2 1.7-.6C4.8 16.7 5.9 16 7 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C14.8 16.7 15.9 16 17 16s2.2.7 3.3 1.4c.5.4 1.1.6 1.7.6"/></svg>`; // waves
    default: return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`; // Map pin fallback
  }
};

const createPoiIcon = (poi: PointOfInterest) => {
  const color = getPoiIconColor(poi.type);
  const svg = getPoiSvg(poi.type);
  
  return L.divIcon({
    className: 'custom-poi-icon z-40',
    html: `
      <div class="flex items-center gap-1.5 cursor-pointer" style="min-width: 150px;">
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style='background-color: ${color}; flex-shrink: 0;'>
          ${svg}
        </div>
        <div class="text-xs font-bold pointer-events-none" style='color: ${color}; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0px 2px 2px rgba(0,0,0,0.1); line-height: 1.1;'>
          ${poi.name}
        </div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle map flying when selection changes
const MapController: React.FC<{
  selectedProperty: Property | undefined;
  defaultCenter: [number, number];
}> = ({ selectedProperty, defaultCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, 16);
      
      // Convert target lat/lng to pixel coordinates
      const targetPoint = map.project([selectedProperty.lat, selectedProperty.lng], targetZoom);
      
      // Shift the map center 200px to the right so the marker appears visually centered
      // in the clear space to the left of the PropertyDetailsCard
      targetPoint.x += 200;
      
      // Convert back to lat/lng
      const targetLatLng = map.unproject(targetPoint, targetZoom);

      map.flyTo(targetLatLng, targetZoom, {
        duration: 1.5
      });
    } else {
      map.flyTo(defaultCenter, 14, { duration: 1.5 });
    }
  }, [selectedProperty, map, defaultCenter]);

  return null;
};

const poiIconCache: Record<string, L.DivIcon> = {};
const getCachedPoiIcon = (poi: PointOfInterest) => {
  if (!poiIconCache[poi.id]) {
    poiIconCache[poi.id] = createPoiIcon(poi);
  }
  return poiIconCache[poi.id];
};

const propertyIconCache: Record<string, L.DivIcon> = {};
const getCachedPropertyIcon = (property: Property, isSelected: boolean) => {
  const key = `${property.id}-${isSelected}`;
  if (!propertyIconCache[key]) {
    propertyIconCache[key] = createCustomIcon(property, isSelected);
  }
  return propertyIconCache[key];
};

const POIMarkers: React.FC<{ pois: PointOfInterest[] }> = ({ pois }) => {
  const map = useMap();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    const updateBounds = () => setBounds(map.getBounds().pad(0.5)); // Pad bounds slightly to pre-load
    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);
    updateBounds(); // Initial bounds
    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map]);

  if (!bounds) return null;

  const renderablePOIs = pois.filter(poi => bounds.contains([poi.lat, poi.lng]));

  return (
    <>
      {renderablePOIs.map(poi => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={getCachedPoiIcon(poi)}
        />
      ))}
    </>
  );
};

const defaultCenter: [number, number] = [-16.735, -43.861]; // Montes Claros default

export const MapArea: React.FC<MapAreaProps> = ({ 
  properties, 
  selectedProperty,
  selectedPropertyId, 
  onPropertySelect,
  globalPois,
  showPOIs,
  activePoiTypes
}) => {
  const visiblePOIs = React.useMemo(() => {
    if (!showPOIs) return [];
    return globalPois.filter(poi => activePoiTypes.includes(poi.type));
  }, [showPOIs, globalPois, activePoiTypes]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={14} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        preferCanvas={true}
      >
        {/* Using a clean, muted map style similar to Google Maps roadmap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        
        <MapController 
          selectedProperty={selectedProperty} 
          defaultCenter={defaultCenter}
        />

        <POIMarkers pois={visiblePOIs} />

        {React.useMemo(() => properties.map(property => {
          const isSelected = property.id === selectedPropertyId;
          return (
            <React.Fragment key={property.id}>
              <Marker
                position={[property.lat, property.lng]}
                icon={getCachedPropertyIcon(property, isSelected)}
                eventHandlers={{
                  click: () => onPropertySelect(property.id)
                }}
              />
            </React.Fragment>
          );
        }), [properties, selectedPropertyId, onPropertySelect])}

        {selectedProperty && !properties.find(p => p.id === selectedProperty.id) && (
          <Marker
            key={`selected-${selectedProperty.id}`}
            position={[selectedProperty.lat, selectedProperty.lng]}
            icon={getCachedPropertyIcon(selectedProperty, true)}
            eventHandlers={{
              click: () => onPropertySelect(selectedProperty.id)
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
