// src/services/favoritesService.js
const KEY = "music_player_favorites_v1";

const load = () => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
};

const save = (arr) => {
  localStorage.setItem(KEY, JSON.stringify(arr));
};

const favoritesService = {
  getAll: () => load(),

  isFavorite: (songId) => {
    const fav = load();
    return fav.includes(songId);
  },

  add: (songId) => {
    const fav = load();
    if (!fav.includes(songId)) {
      fav.push(songId);
      save(fav);
    }
    return fav;
  },

  remove: (songId) => {
    let fav = load();
    fav = fav.filter(id => id !== songId);
    save(fav);
    return fav;
  },

  toggle: (songId) => {
    const fav = load();
    if (fav.includes(songId)) {
      return favoritesService.remove(songId);
    } else {
      return favoritesService.add(songId);
    }
  }
};

export default favoritesService;
