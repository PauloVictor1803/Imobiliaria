import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  CheckSquare,
  Square,
  Search,
  X,
} from "lucide-react";
import { POIType } from "../types";

interface SettingsPanelProps {
  showPOIs: boolean;
  setShowPOIs: (val: boolean) => void;
  activePoiTypes: string[];
  setActivePoiTypes: (types: string[]) => void;
  showSoldProperties: boolean;
  setShowSoldProperties: (val: boolean) => void;
  onClose?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isAdmin?: boolean;
  isUpdatingPois?: boolean;
  onRefreshPois?: () => Promise<void>;
  lastPoisUpdate?: string;
}

export const ALL_POI_TYPES: { type: POIType; label: string }[] = [
  { type: "supermarket", label: "Supermercados" },
  { type: "school", label: "Escolas / Colégios" },
  { type: "kindergarten", label: "Creches / CEMEI" },
  { type: "park", label: "Parques" },
  { type: "pharmacy", label: "Farmácias / Drogarias" },
  { type: "restaurant", label: "Restaurantes" },
  { type: "hospital", label: "Hospitais / Saúde" },
  { type: "bar", label: "Bares" },
  { type: "hotel", label: "Hotéis" },
  { type: "cemetery", label: "Cemitérios" },
  { type: "event", label: "Praças / Eventos" },
  { type: "center", label: "Centros Comerciais" },
  { type: "gas_station", label: "Postos de Gasolina" },
  { type: "bank", label: "Bancos" },
  { type: "gym", label: "Academias" },
  { type: "mall", label: "Shoppings" },
  { type: "museum", label: "Museus / Cultura" },
  { type: "bus_station", label: "Rodoviárias / Pontos" },
  { type: "cafe", label: "Cafeterias" },
  { type: "bakery", label: "Padarias" },
  { type: "church", label: "Igrejas / Templos" },
  { type: "airport", label: "Aeroportos" },
  { type: "atm", label: "Caixas Eletrônicos" },
  { type: "beauty_salon", label: "Salões de Beleza / Barbearias" },
  { type: "book_store", label: "Livrarias" },
  { type: "clothing_store", label: "Lojas de Roupas" },
  { type: "convenience_store", label: "Lojas de Conveniência" },
  { type: "dentist", label: "Dentistas" },
  { type: "doctor", label: "Médicos / Clínicas" },
  { type: "electronics_store", label: "Lojas de Eletrônicos" },
  { type: "fire_station", label: "Corpo de Bombeiros" },
  { type: "library", label: "Bibliotecas" },
  { type: "movie_theater", label: "Cinemas" },
  { type: "night_club", label: "Casas Noturnas" },
  { type: "pet_store", label: "Pet Shops" },
  { type: "police", label: "Polícia" },
  { type: "police_station", label: "Postos Policiais" },
  { type: "military_police", label: "Batalhões da PM" },
  { type: "post_office", label: "Correios" },
  { type: "shoe_store", label: "Lojas de Calçados" },
  { type: "spa", label: "Spas" },
  { type: "stadium", label: "Estádios / Ginásios" },
  { type: "soccer_field", label: "Arenas / Campos de Futebol" },
  { type: "store", label: "Lojas em Geral" },
  { type: "subway_station", label: "Estações de Metrô" },
  { type: "tourist_attraction", label: "Atrações Turísticas" },
  { type: "train_station", label: "Estações de Trem" },
  { type: "veterinary_care", label: "Veterinários" },
  { type: "zoo", label: "Zoológicos" },
  { type: "university", label: "Universidades / Faculdades" },
  { type: "ambulance", label: "SAMU / Ambulâncias" },
  { type: "health_center", label: "Postos de Saúde" },
  { type: "grocery_store", label: "Mercearias / Quitandas" },
  { type: "club", label: "Clubes / Piscinas" },
  { type: "snack_bar", label: "Lanchonetes / Hotdogs / Fast Food" },
  { type: "pizzeria", label: "Pizzarias" },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  showPOIs,
  setShowPOIs,
  activePoiTypes,
  setActivePoiTypes,
  showSoldProperties,
  setShowSoldProperties,
  onClose,
  onSave,
  isSaving,
  isAdmin = false,
  isUpdatingPois = false,
  onRefreshPois,
  lastPoisUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllPois, setShowAllPois] = useState(false);

  const filteredTypes = ALL_POI_TYPES.filter((t) =>
    t.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayedTypes = (searchTerm || showAllPois) ? filteredTypes : filteredTypes.slice(0, 10);

  const allTypesIds = ALL_POI_TYPES.map((t) => t.type);

  const toggleAll = () => {
    if (activePoiTypes.length === allTypesIds.length) {
      setActivePoiTypes([]);
    } else {
      setActivePoiTypes(allTypesIds);
    }
  };

  const toggleType = (type: string) => {
    if (activePoiTypes.includes(type)) {
      setActivePoiTypes(activePoiTypes.filter((t) => t !== type));
    } else {
      setActivePoiTypes([...activePoiTypes, type]);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[400] md:hidden"
        onClick={onClose}
      />
      <div className="fixed md:absolute inset-y-0 right-0 md:inset-auto md:top-4 md:left-4 z-[500] bg-white rounded-none md:rounded-xl shadow-2xl p-6 w-80 md:w-[400px] border-l md:border border-gray-100 max-h-screen md:max-h-[calc(100vh-2rem)] flex flex-col md:translate-x-0 animate-in slide-in-from-right md:slide-in-from-left-4 transition-transform">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">
              Configurações do Mapa
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {/* Hide Sold Toggle */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <label
              className="text-sm font-semibold text-gray-800 cursor-pointer select-none"
              htmlFor="toggle-hide-sold"
            >
              Mostrar imóveis vendidos ao cliente?
            </label>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${showSoldProperties ? "bg-blue-600" : "bg-gray-300"}`}
              onClick={() => setShowSoldProperties(!showSoldProperties)}
              id="toggle-hide-sold"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showSoldProperties ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
          </div>

          {/* Global Toggle */}
          <div className="flex items-center justify-between mb-8">
            <label
              className="text-sm font-semibold text-gray-800 cursor-pointer select-none"
              htmlFor="toggle-pois"
            >
              Mostrar Ícones no mapa?
            </label>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${showPOIs ? "bg-blue-600" : "bg-gray-300"}`}
              onClick={() => setShowPOIs(!showPOIs)}
              id="toggle-pois"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPOIs ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
          </div>

          {showPOIs && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Filtros de Pontos de Interesse
              </h3>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Select All / None */}
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={toggleAll}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {activePoiTypes.length === allTypesIds.length
                    ? "Desmarcar Todos"
                    : "Marcar Todos"}
                </button>
                <span className="text-xs text-gray-400">
                  {activePoiTypes.length} ativos
                </span>
              </div>

              {/* List */}
              <div className="space-y-2 mt-2">
                {displayedTypes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma categoria encontrada.
                  </p>
                ) : (
                  <>
                    {displayedTypes.map((item) => {
                      const isActive = activePoiTypes.includes(item.type);
                      return (
                        <div
                          key={item.type}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => toggleType(item.type)}
                        >
                          <span className="text-sm text-gray-700 select-none">
                            {item.label}
                          </span>
                          {isActive ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      );
                    })}
                    {!searchTerm && !showAllPois && filteredTypes.length > 10 && (
                      <button
                        onClick={() => setShowAllPois(true)}
                        className="w-full py-2 mt-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Visualizar todas as categorias
                      </button>
                    )}
                    {!searchTerm && showAllPois && filteredTypes.length > 10 && (
                      <button
                        onClick={() => setShowAllPois(false)}
                        className="w-full py-2 mt-2 text-sm text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Ocultar categorias
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {isAdmin && onRefreshPois && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Mapa de Comércios (Admin)
              </h3>
              <p className="text-xs text-gray-500 mb-1 leading-relaxed">
                Os pontos de interesse (escolas, hospitais, mercados) são atualizados automaticamente a cada 7 dias para garantir melhor performance no aplicativo.
              </p>
              <p className="text-xs text-gray-400 mb-3 font-medium">
                {lastPoisUpdate 
                  ? `Última atualização: ${new Date(lastPoisUpdate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Nenhuma atualização registrada."}
              </p>
              <button
                onClick={onRefreshPois}
                disabled={isUpdatingPois}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                {isUpdatingPois ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Atualizando Pontos do Mapa...
                  </>
                ) : (
                  "Forçar Atualização Manual"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
