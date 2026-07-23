import {
  ShoppingCart,
  GraduationCap,
  TreePine,
  MapPin,
  Plus,
  Settings,
  CheckSquare,
  Square,
  X,
  Utensils,
  DollarSign,
  Dumbbell,
  Store,
  Plane,
  Coffee,
  BriefcaseMedical,
  ShoppingBag,
  Edit2,
  BedDouble,
  Bath,
  Car,
  Sofa,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Fuel,
  ShoppingBasket,
  Waves,
  Pizza,
  UtensilsCrossed,
  Shield,
  Goal,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Property, POIType } from "../types";
import { PointOfInterest } from "../types";
import { ALL_POI_TYPES } from "./SettingsPanel";

interface PropertyDetailsCardProps {
  property: Property;
  onClose: () => void;
  onEdit?: () => void;
  isAdmin?: boolean;
  activePoiTypes: string[];
  globalPois?: PointOfInterest[];
  setActivePoiTypes: (types: string[]) => void;
}

const poiIconMap: Record<string, React.ReactNode> = {
  supermarket: <ShoppingCart className="w-5 h-5 text-red-500" />,
  school: <GraduationCap className="w-5 h-5 text-purple-600" />,
  park: <TreePine className="w-5 h-5 text-emerald-600" />,
  center: <MapPin className="w-5 h-5 text-green-500" />,
  pharmacy: <Plus className="w-5 h-5 text-red-500" />,
  restaurant: <Utensils className="w-5 h-5 text-orange-500" />,
  hospital: <BriefcaseMedical className="w-5 h-5 text-red-600" />,
  health_center: <BriefcaseMedical className="w-5 h-5 text-emerald-600" />,
  bank: <DollarSign className="w-5 h-5 text-green-600" />,
  gym: <Dumbbell className="w-5 h-5 text-blue-500" />,
  store: <Store className="w-5 h-5 text-indigo-500" />,
  airport: <Plane className="w-5 h-5 text-sky-500" />,
  cafe: <Coffee className="w-5 h-5 text-amber-600" />,
  university: <GraduationCap className="w-5 h-5 text-indigo-600" />,
  mall: <ShoppingBag className="w-5 h-5 text-violet-500" />,
  gas_station: <Fuel className="w-5 h-5 text-yellow-500" />,
  convenience_store: <ShoppingBasket className="w-5 h-5 text-amber-500" />,
  club: <Waves className="w-5 h-5 text-cyan-500" />,
  snack_bar: <UtensilsCrossed className="w-5 h-5 text-orange-400" />,
  pizzeria: <Pizza className="w-5 h-5 text-red-500" />,
  police: <Shield className="w-5 h-5 text-blue-500" />,
  police_station: <Shield className="w-5 h-5 text-blue-500" />,
  military_police: <Shield className="w-5 h-5 text-blue-500" />,
  stadium: <Goal className="w-5 h-5 text-emerald-500" />,
  soccer_field: <Goal className="w-5 h-5 text-emerald-500" />,
};

const getPoiIcon = (type: string) => {
  return poiIconMap[type] || <MapPin className="w-5 h-5 text-gray-500" />;
};

function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const formatDistance = (meters: number) => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

export const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({
  property,
  onClose,
  onEdit,
  isAdmin,
  activePoiTypes,
  setActivePoiTypes,
  globalPois = [],
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [radius, setRadius] = useState(2000); // 2km default
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.id]);

  const visiblePois = useMemo(() => {
    return globalPois
      .filter((poi) => activePoiTypes.includes(poi.type))
      .map((poi) => {
        const dist = getDistanceInMeters(
          property.lat,
          property.lng,
          poi.lat,
          poi.lng,
        );
        return {
          ...poi,
          numericDistance: dist,
          formattedDistance: formatDistance(dist),
        };
      })
      .filter((poi) => poi.numericDistance <= radius)
      .sort((a, b) => a.numericDistance - b.numericDistance)
      .slice(0, 8); // Max 8 abstractly shown on circle
  }, [property.lat, property.lng, activePoiTypes, radius]);

  const allVisiblePois = useMemo(() => {
    return globalPois
      .filter((poi) => activePoiTypes.includes(poi.type))
      .map((poi) => {
        const dist = getDistanceInMeters(
          property.lat,
          property.lng,
          poi.lat,
          poi.lng,
        );
        return {
          ...poi,
          numericDistance: dist,
          formattedDistance: formatDistance(dist),
        };
      })
      .filter((poi) => poi.numericDistance <= radius)
      .sort((a, b) => a.numericDistance - b.numericDistance);
  }, [property.lat, property.lng, activePoiTypes, radius]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div
      className={`absolute z-40 bg-gray-50/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ${isExpanded ? "top-20 left-4 right-4 bottom-4" : "top-20 left-4 right-4 md:left-auto md:right-4 w-auto md:w-96 max-h-[calc(100vh-6rem)]"}`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col w-full scroll-smooth">
        <div className="relative group shrink-0">
          <img
            src={
              property.images && property.images.length > 0
                ? property.images[currentImageIndex]
                : property.image
            }
            alt={property.title}
            onClick={() => {
              if (isExpanded && property.images && property.images.length > 1) {
                setCurrentImageIndex((prev) =>
                  prev === property.images!.length - 1 ? 0 : prev + 1,
                );
              }
            }}
            className={`w-full transition-all duration-500 ${isExpanded ? "h-[50vh] min-h-[400px] object-contain bg-gray-200 cursor-pointer" : "h-56 object-cover rounded-b-3xl"} ${property.isSold ? "opacity-50 grayscale" : ""}`}
          />
          {property.isSold && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span className="bg-red-600 text-white font-black text-3xl px-8 py-3 rounded-xl tracking-widest shadow-2xl border-4 border-white">
                VENDIDO
              </span>
            </div>
          )}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? property.images!.length - 1 : prev - 1,
                  );
                }}
                className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === property.images!.length - 1 ? 0 : prev + 1,
                  );
                }}
                className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-20">
                {currentImageIndex + 1}/{property.images.length}
              </div>
            </>
          )}

          <div className="absolute top-3 left-3 flex gap-2 z-30">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors shadow-sm"
              title={isExpanded ? "Restaurar" : "Expandir"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="absolute top-3 right-3 flex gap-2 z-30">
            {onEdit && (
              <button
                onClick={onEdit}
                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition shadow-sm"
                title="Editar Imóvel"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition shadow-sm"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition shadow-sm"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>

        {isSettingsOpen ? (
          <div className="p-6 animate-in fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Configurar Pontos</h3>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Distância Máxima
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {formatDistance(radius)}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100m</span>
                <span>5km</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Ícones Visíveis
                </label>
                <button
                  onClick={() => {
                    if (activePoiTypes.length === ALL_POI_TYPES.length) {
                      setActivePoiTypes([]);
                    } else {
                      setActivePoiTypes(ALL_POI_TYPES.map((t) => t.type));
                    }
                  }}
                  className="text-xs text-blue-600 font-medium"
                >
                  {activePoiTypes.length === ALL_POI_TYPES.length
                    ? "Ocultar"
                    : "Todos"}
                </button>
              </div>
              <div className="space-y-1">
                {ALL_POI_TYPES.map((item) => {
                  const isActive = activePoiTypes.includes(item.type);
                  return (
                    <div
                      key={item.type}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      onClick={() => {
                        if (isActive) {
                          setActivePoiTypes(
                            activePoiTypes.filter((t) => t !== item.type),
                          );
                        } else {
                          setActivePoiTypes([...activePoiTypes, item.type]);
                        }
                      }}
                    >
                      <span className="text-sm text-gray-700 select-none">
                        {item.label}
                      </span>
                      {isActive ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`p-6 animate-in fade-in ${isExpanded ? "max-w-3xl mx-auto w-full" : ""}`}
          >
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {property.title}
              </h2>
              {(property.address || property.neighborhood) && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent([property.address, property.addressNumber].filter(Boolean).join(", ") + (property.neighborhood ? ` - ${property.neighborhood}, Montes Claros` : ", Montes Claros"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1 text-sm text-gray-500 mb-2 hover:text-blue-600 transition-colors"
                  title="Abrir no Google Maps"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    {property.address}
                    {property.addressNumber
                      ? `, ${property.addressNumber}`
                      : ""}
                    {property.neighborhood ? ` - ${property.neighborhood}` : ""}
                  </span>
                </a>
              )}
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {property.description}
              </p>

              <div
                className={`grid grid-cols-2 ${isExpanded ? "md:grid-cols-4" : ""} gap-4 mb-6 border-b border-gray-200 pb-6`}
              >
                <div className="col-span-2 sm:col-span-1">
                  <div className="grid grid-cols-2 gap-4">
                    {property.oldPrice &&
                      property.oldPrice > property.price && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            Antes:
                          </p>
                          <p
                            className="text-sm font-medium text-gray-500 line-through truncate"
                            title={`de ${formatCurrency(property.oldPrice)}`}
                          >
                            {formatCurrency(property.oldPrice)}
                          </p>
                        </div>
                      )}
                    <div className={(!property.oldPrice || property.oldPrice <= property.price) ? "col-span-2" : ""}>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Preço Atual:
                      </p>
                      <p
                        className="text-sm font-bold text-gray-900 truncate"
                        title={formatCurrency(property.price)}
                      >
                        {formatCurrency(property.price)}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Área:</p>
                  <p className="text-sm font-bold text-gray-900">
                    {property.area}m²
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Estilo:</p>
                  <p
                    className="text-sm font-bold text-gray-900 truncate"
                    title={property.style}
                  >
                    {property.style}
                  </p>
                </div>
                {property.bedrooms !== undefined && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Quartos
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {property.bedrooms}
                      </p>
                    </div>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Banheiros
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {property.bathrooms}
                      </p>
                    </div>
                  </div>
                )}
                {property.garages !== undefined && (
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Vagas</p>
                      <p className="text-sm font-bold text-gray-900">
                        {property.garages}
                      </p>
                    </div>
                  </div>
                )}
                {property.kitchens !== undefined && (
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Cozinhas
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {property.kitchens}
                      </p>
                    </div>
                  </div>
                )}
                {property.livingRooms !== undefined && (
                  <div className="flex items-center gap-2">
                    <Sofa className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Salas</p>
                      <p className="text-sm font-bold text-gray-900">
                        {property.livingRooms}
                      </p>
                    </div>
                  </div>
                )}
                {property.hasLeisureArea !== undefined && (
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Área de Lazer
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {property.hasLeisureArea ? "Sim" : "Não"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold text-gray-900 mb-4 text-center">
                Pontos de Interesse:
              </p>

              {/* Abstract representation of POI radius */}
              <div
                key={property.id}
                className="relative flex justify-center items-center h-56 my-2"
              >
                {/* Radar waves that settle as dashed rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Wave 1: Escapes and fades out */}
                  <motion.div
                    className="absolute w-64 h-64 rounded-full border-2 border-dashed border-blue-400"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: [0.2, 1], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Wave 2: Settles as outer ring (w-48) */}
                  <motion.div
                    className="absolute w-48 h-48 rounded-full border border-dashed border-gray-300"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: [0.2, 1.05, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  />
                  {/* Wave 3: Settles as inner ring (w-32) */}
                  <motion.div
                    className="absolute w-32 h-32 rounded-full border border-dashed border-gray-300"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: [0.2, 1.05, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
                  />
                </div>

                {/* Center Home Icon */}
                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center z-10 relative">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* POI Markers placed around the circle - abstract layout */}
                {visiblePois.length === 0 ? (
                  <div className="absolute mt-32 text-xs text-gray-400">
                    Nenhum ponto neste raio
                  </div>
                ) : (
                  visiblePois.map((p, idx) => {
                    // Distribute around the circle
                    const angle =
                      (idx / visiblePois.length) * Math.PI * 2 - Math.PI / 2;
                    const r = idx % 2 === 0 ? 56 : 76; // reduced radius to prevent touching edges
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;

                    return (
                      <motion.div
                        key={p.id}
                        className="absolute flex items-center justify-center group hover:z-50"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x, y }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                          delay: idx * 0.05,
                        }}
                      >
                        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 relative">
                          {getPoiIcon(p.type)}
                        </div>
                        <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded bottom-full mb-2 whitespace-nowrap transition-opacity pointer-events-none z-20">
                          {p.name} ({p.formattedDistance})
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="mt-6 mb-2 px-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Área de busca
                  </label>
                  <span className="text-sm font-bold text-blue-600">
                    {formatDistance(radius)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>100m</span>
                  <span>5km</span>
                </div>
              </div>

              {/* List fallback for clarity */}
              <div className="mt-4 space-y-3">
                {allVisiblePois.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Ajuste os filtros ou o raio para ver os locais próximos.
                  </p>
                )}
                {allVisiblePois.map((p) => (
                  <div key={p.id} className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 shrink-0">
                      {getPoiIcon(p.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.formattedDistance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// simple home icon for the center of POI visualization
function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
