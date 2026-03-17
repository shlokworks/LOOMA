import locations from "../mock/locations.json";
import propertyTypes from "../mock/propertyTypes.json";

const filterService = {
  getLocations: () => {
    return locations;
  },

  getPropertyTypes: () => {
    return propertyTypes;
  },

  // Optional helper: calculate min/max price range dynamically
  getPriceRange: (properties) => {
    if (!properties || properties.length === 0) return { min: 0, max: 0 };

    const prices = properties.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },
};

export default filterService;
