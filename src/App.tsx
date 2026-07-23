/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { MapArea } from "./components/MapArea";
import { DashboardCard } from "./components/DashboardCard";
import { PropertyDetailsCard } from "./components/PropertyDetailsCard";
import { SearchBar } from "./components/SearchBar";
import { TopActions } from "./components/TopActions";
import { SettingsPanel } from "./components/SettingsPanel";
import { MyProperties } from "./components/MyProperties";
import { EditPropertyModal } from "./components/EditPropertyModal";
import { Login } from "./components/Login";
import { Menu } from "lucide-react";
import { POIType, Property, FilterOptions, PointOfInterest } from "./types";
import { supabase } from "./lib/supabase";
import { fetchRealPOIs } from "./lib/overpass";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return new URLSearchParams(window.location.search).get("client") !== "true";
  });

  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAuthenticatedAdmin = isAdmin && !!session;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Remove the useEffect that forced activeTab to 'properties'

  const [filters, setFilters] = useState<FilterOptions>({
    bedrooms: null,
    bathrooms: null,
    garages: null,
    hasLeisureArea: null,
    hideSold: null,
  });

  // Future Supabase state
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const hasLoadedSettings = React.useRef(false);
  const isInitialMount = React.useRef(true);

  const [realPois, setRealPois] = useState<PointOfInterest[]>(() => {
    const saved = localStorage.getItem("__POI_CACHE__");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pois && Array.isArray(parsed.pois)) {
          return parsed.pois;
        }
      } catch (e) {
        console.error("Failed to parse local POI cache:", e);
      }
    }
    return [];
  });

  const [lastPoisUpdate, setLastPoisUpdate] = useState<string>(() => {
    const saved = localStorage.getItem("__POI_CACHE__");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.last_updated || "";
      } catch (e) {}
    }
    return "";
  });

  const [isUpdatingPois, setIsUpdatingPois] = useState(false);

  const updatePoisFromOverpass = async () => {
    if (isUpdatingPois) return;
    setIsUpdatingPois(true);
    try {
      console.log("Fetching fresh POIs from Overpass API...");
      const pois = await fetchRealPOIs(-16.78, -43.9, -16.68, -43.8);
      if (pois && pois.length > 0) {
        const timestamp = new Date().toISOString();
        setRealPois(pois);
        setLastPoisUpdate(timestamp);

        // Save to local storage
        localStorage.setItem(
          "__POI_CACHE__",
          JSON.stringify({ pois, last_updated: timestamp })
        );

        // Save to Supabase
        const payload = {
          title: "__POI_CACHE__",
          description: JSON.stringify({ last_updated: timestamp }),
          price: 0,
          cost: 0,
          area: 0,
          style: "poi_cache",
          image: "",
          lat: 0,
          lng: 0,
          poi: pois,
        };

        const { data: existing, error: selectError } = await supabase
          .from("properties")
          .select("id")
          .eq("title", "__POI_CACHE__")
          .limit(1);

        if (selectError) throw selectError;

        if (existing && existing.length > 0) {
          const { error: updateError } = await supabase
            .from("properties")
            .update(payload)
            .eq("id", existing[0].id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("properties")
            .insert([payload]);
          if (insertError) throw insertError;
        }
        console.log("POIs successfully updated from Overpass API, saved to Supabase and LocalStorage!");
      }
    } catch (err) {
      console.error("Failed to update POIs from Overpass API:", err);
    } finally {
      setIsUpdatingPois(false);
    }
  };

  const syncPoisFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("title", "__POI_CACHE__")
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const poiRow = data[0];
        const pois = poiRow.poi || [];
        let last_updated = "";
        try {
          const meta = JSON.parse(poiRow.description || "{}");
          last_updated = meta.last_updated || "";
        } catch (e) {}

        setRealPois(pois);
        if (last_updated) {
          setLastPoisUpdate(last_updated);
        }

        localStorage.setItem(
          "__POI_CACHE__",
          JSON.stringify({ pois, last_updated })
        );

        // Check if 7 days have passed
        if (last_updated) {
          const lastDate = new Date(last_updated);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 7) {
            console.log("POI data is older than 7 days, auto-updating...");
            updatePoisFromOverpass();
          }
        } else {
          updatePoisFromOverpass();
        }
      } else {
        console.log("No POI Cache row in Supabase, initiating initial fetch...");
        updatePoisFromOverpass();
      }
    } catch (err) {
      console.error("Error fetching POI Cache from Supabase, using local fallback:", err);
      // We already loaded from localStorage in state initialization.
      // But if we have absolutely nothing, try fetching from Overpass API
      if (realPois.length === 0) {
        console.log("No local fallback found either. Fetching from Overpass API directly...");
        updatePoisFromOverpass();
      }
    }
  };

  useEffect(() => {
    syncPoisFromSupabase();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsPropertiesLoading(true);
      const { data, error } = await supabase.from("properties").select("*");

      if (error) {
        console.error("Error fetching properties from Supabase:", error);
        return;
      }

      // Transform data if necessary
      let formattedProperties = (data || []).map((p) => ({
        ...p,
        poi: p.poi || [],
      }));

      const settingsProp = formattedProperties.find(
        (p) => p.title === "__APP_SETTINGS__",
      );
      if (settingsProp) {
        try {
          const settings = JSON.parse(settingsProp.description);
          if (settings.activePoiTypes)
            setActivePoiTypes(settings.activePoiTypes);
          if (typeof settings.showSoldProperties !== "undefined")
            setShowSoldProperties(settings.showSoldProperties);
        } catch (e) {}
      }

      // Update realPois from DB cache row if we fetch properties and it is fresher
      const poiCacheProp = formattedProperties.find(
        (p) => p.title === "__POI_CACHE__",
      );
      if (poiCacheProp) {
        const pois = poiCacheProp.poi || [];
        let last_updated = "";
        try {
          const meta = JSON.parse(poiCacheProp.description || "{}");
          last_updated = meta.last_updated || "";
        } catch (e) {}
        if (pois.length > 0) {
          setRealPois(pois);
          if (last_updated) {
            setLastPoisUpdate(last_updated);
          }
          localStorage.setItem(
            "__POI_CACHE__",
            JSON.stringify({ pois, last_updated })
          );
        }
      }

      // Filter out settings and POI Cache rows from visible properties list
      formattedProperties = formattedProperties.filter(
        (p) => p.title !== "__APP_SETTINGS__" && p.title !== "__POI_CACHE__",
      );

      setProperties(formattedProperties);
      hasLoadedSettings.current = true;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsPropertiesLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Settings state
  const [showPOIs, setShowPOIs] = useState(() => {
    const saved = localStorage.getItem("showPOIs");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("showPOIs", JSON.stringify(showPOIs));
  }, [showPOIs]);

  const [showSoldProperties, setShowSoldProperties] = useState(() => {
    const saved = localStorage.getItem("showSoldProperties");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "showSoldProperties",
      JSON.stringify(showSoldProperties),
    );
  }, [showSoldProperties]);
  const [activePoiTypes, setActivePoiTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem("activePoiTypes");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return [
      "supermarket",
      "school",
      "park",
      "center",
      "pharmacy",
      "restaurant",
      "hospital",
      "bar",
      "hotel",
      "event",
      "cemetery",
      "gas_station",
      "bank",
      "gym",
      "mall",
      "museum",
      "bus_station",
      "cafe",
      "bakery",
      "church",
      "airport",
      "atm",
      "beauty_salon",
      "book_store",
      "clothing_store",
      "convenience_store",
      "dentist",
      "doctor",
      "electronics_store",
      "fire_station",
      "library",
      "movie_theater",
      "night_club",
      "pet_store",
      "police",
      "post_office",
      "shoe_store",
      "spa",
      "stadium",
      "store",
      "subway_station",
      "tourist_attraction",
      "train_station",
      "veterinary_care",
      "zoo",
      "university",
      "ambulance",
      "health_center",
      "grocery_store",
      "kindergarten",
      "club",
      "snack_bar",
      "pizzeria",
      "police_station",
      "military_police",
      "stadium",
      "soccer_field",
    ];
  });

  useEffect(() => {
    localStorage.setItem("activePoiTypes", JSON.stringify(activePoiTypes));
  }, [activePoiTypes]);

  const handleSaveSettings = async (isAutoSave = false) => {
    try {
      setIsSavingSettings(true);
      const settingsData = {
        activePoiTypes,
        showPOIs,
        showSoldProperties,
      };

      const payload = {
        title: "__APP_SETTINGS__",
        description: JSON.stringify(settingsData),
        price: 0,
        cost: 0,
        area: 0,
        style: "settings",
        image: "",
        lat: 0,
        lng: 0,
        poi: [],
      };

      // Check if it already exists
      const { data: existing } = await supabase
        .from("properties")
        .select("id")
        .eq("title", "__APP_SETTINGS__")
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from("properties")
          .update(payload)
          .eq("id", existing[0].id);
      } else {
        await supabase.from("properties").insert([payload]);
      }

      if (!isAutoSave) {
        /* alert('Configurações salvas com sucesso!'); */
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erro ao salvar configurações.");
    } finally {
      setIsSavingSettings(false);
    }
  };

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

  const filteredProperties = React.useMemo(() => {
    return properties.filter((p) => {
      // If not admin, the global showSoldProperties toggle controls visibility
      if (!isAdmin && !showSoldProperties && p.isSold) return false;
      // If admin, they use the specific "hideSold" filter from SearchBar
      if (isAdmin && filters.hideSold && p.isSold) return false;

      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch);

      const matchesBedrooms =
        filters.bedrooms === null ||
        (p.bedrooms !== undefined &&
          (filters.bedrooms === 4
            ? p.bedrooms >= 4
            : p.bedrooms === filters.bedrooms));
      const matchesBathrooms =
        filters.bathrooms === null ||
        (p.bathrooms !== undefined &&
          (filters.bathrooms === 4
            ? p.bathrooms >= 4
            : p.bathrooms === filters.bathrooms));
      const matchesGarages =
        filters.garages === null ||
        (p.garages !== undefined &&
          (filters.garages === 4
            ? p.garages >= 4
            : p.garages === filters.garages));
      const matchesLeisure =
        filters.hasLeisureArea === null ||
        p.hasLeisureArea === filters.hasLeisureArea;

      return (
        matchesSearch &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesGarages &&
        matchesLeisure
      );
    });
  }, [properties, searchQuery, filters, showSoldProperties, isAdmin]);

  const selectedProperty = React.useMemo(
    () => properties.find((p) => p.id === selectedPropertyId),
    [properties, selectedPropertyId],
  );

  const handleSaveProperty = useCallback(async (propertyToSave: Property) => {
    try {
      const isNew = propertyToSave.id.startsWith("new-");
      const propertyData = { ...propertyToSave };
      if (isNew) {
        delete (propertyData as any).id; // Let Supabase generate the ID, or use uuid
        const { data, error } = await supabase
          .from("properties")
          .insert([propertyData])
          .select();

        if (error) throw error;
        if (data) {
          setProperties((prev) => [...prev, data[0]]);
        }
      } else {
        const { data, error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", propertyToSave.id)
          .select();

        if (error) throw error;
        if (data) {
          setProperties((prev) =>
            prev.map((p) => (p.id === propertyToSave.id ? data[0] : p)),
          );
        }
      }
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Erro ao salvar imóvel.");
    }
  }, []);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAuthenticatedAdmin}
        onAddProperty={() =>
          setEditingProperty({
            id: `new-${Date.now()}`,
            title: "",
            description: "",
            price: 0,
            cost: 0,
            area: 0,
            style: "",
            image: "",
            images: [],
            bedrooms: 0,
            bathrooms: 0,
            garages: 0,
            kitchens: 0,
            livingRooms: 0,
            hasLeisureArea: false,
            isSold: false,
            lat: -16.735,
            lng: -43.861,
            poi: [],
          })
        }
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        session={session}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 relative h-full">
        {/* Mobile Menu Button */}
        <button
          className={`md:hidden absolute top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors ${showLoginModal ? "hidden" : ""}`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        {activeTab === "settings" ? (
          <SettingsPanel
            showPOIs={showPOIs}
            setShowPOIs={setShowPOIs}
            activePoiTypes={activePoiTypes}
            setActivePoiTypes={setActivePoiTypes}
            showSoldProperties={showSoldProperties}
            setShowSoldProperties={setShowSoldProperties}
            onClose={() => setActiveTab("dashboard")}
            isAdmin={isAuthenticatedAdmin}
            isUpdatingPois={isUpdatingPois}
            onRefreshPois={updatePoisFromOverpass}
            lastPoisUpdate={lastPoisUpdate}
          />
        ) : activeTab === "properties" ? (
          <MyProperties
            properties={properties}
            onPropertySelect={setSelectedPropertyId}
            setActiveTab={setActiveTab}
            onEditProperty={setEditingProperty}
            onSaveProperty={handleSaveProperty}
            isAdmin={isAuthenticatedAdmin}
            showSoldProperties={showSoldProperties}
            setShowSoldProperties={setShowSoldProperties}
          />
        ) : (
          <>
            {/* Top Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              isAdmin={isAuthenticatedAdmin}
              className="absolute top-4 left-[4.5rem] md:left-4 z-30 right-4 md:right-auto md:max-w-md w-auto"
            />
          </>
        )}

        {/* Dashboard/Sales Panel */}
        {activeTab === "sales" && isAuthenticatedAdmin && (
          <DashboardCard properties={properties} setActiveTab={setActiveTab} />
        )}

        {/* Top Actions (Notifications & Logout) */}
        <div className="hidden md:block">
          <TopActions
            onLogout={handleLogout}
            onLoginClick={() => setShowLoginModal(true)}
            session={session}
          />
        </div>

        {/* Map Area */}
        <MapArea
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          selectedPropertyId={selectedPropertyId}
          onPropertySelect={setSelectedPropertyId}
          globalPois={realPois}
          showPOIs={showPOIs}
          activePoiTypes={activePoiTypes}
        />

        {/* Floating Property Details Sidebar */}
        {selectedProperty && (
          <PropertyDetailsCard
            property={selectedProperty}
            onClose={() => setSelectedPropertyId(null)}
            onEdit={
              isAuthenticatedAdmin
                ? () => setEditingProperty(selectedProperty)
                : undefined
            }
            isAdmin={isAuthenticatedAdmin}
            activePoiTypes={activePoiTypes}
            setActivePoiTypes={setActivePoiTypes}
            globalPois={realPois}
          />
        )}

        {/* Edit Property Modal */}
        {editingProperty && isAuthenticatedAdmin && (
          <EditPropertyModal
            property={editingProperty}
            onClose={() => setEditingProperty(null)}
            onSave={handleSaveProperty}
          />
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <Login
            onClose={() => setShowLoginModal(false)}
            onLogin={() => {
              setShowLoginModal(false);
              fetchProperties();
            }}
          />
        )}
      </main>
    </div>
  );
}
