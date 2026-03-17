const FAVORITES_KEY = "real_estate_favorites";

const favoritesService = {
  load: () => {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (favorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },

  add: (id) => {
    const favorites = favoritesService.load();
    if (!favorites.includes(id)) {
      favorites.push(id);
      favoritesService.save(favorites);
    }
    return favorites;
  },

  remove: (id) => {
    let favorites = favoritesService.load();
    favorites = favorites.filter((f) => f !== id);
    favoritesService.save(favorites);
    return favorites;
  },
};

export default favoritesService;
