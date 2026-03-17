import { create } from "zustand";
import propertiesData from "../mock/properties.json";
import agentsData from "../mock/agents.json";
import locationsData from "../mock/locations.json";
import propertyTypesData from "../mock/propertyTypes.json";

const useRealEstateStore = create((set, get) => ({
  /* ============================
     STATE
     ============================ */
  properties: [],
  filteredProperties: [],
  agents: [],
  locations: [],
  propertyTypes: [],
  favorites: [],

  /* ============================
     LOADERS
     ============================ */
  loadProperties: () => {
    const properties = propertiesData;
    set({ properties, filteredProperties: properties });
  },

  loadAgents: () => {
    set({ agents: agentsData });
  },

  loadFiltersData: () => {
    set({
      locations: locationsData,
      propertyTypes: propertyTypesData,
    });
  },

  /* ============================
     FILTER HANDLER
     ============================ */
applyFilters: (filters) => {
  const { properties } = get();

  let result = [...properties];

  // Location
  if (filters.location) {
    result = result.filter((p) => p.locationId === Number(filters.location));
  }

  // Property Type
  if (filters.type) {
    result = result.filter((p) => p.typeId === Number(filters.type));
  }

  // Price Range
  if (filters.minPrice) {
    result = result.filter((p) => p.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    result = result.filter((p) => p.price <= Number(filters.maxPrice));
  }

  set({ filteredProperties: result });
},

}));

export default useRealEstateStore;
