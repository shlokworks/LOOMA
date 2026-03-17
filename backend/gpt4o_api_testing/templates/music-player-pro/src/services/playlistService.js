// src/services/playlistService.js
import playlistsMock from "../mock/playlists.json";

const USER_KEY = "music_player_user_playlists_v1";

const loadUserPlaylists = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveUserPlaylists = (data) => {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};

const playlistService = {
  // read-only combined list (mock playlists first, then user playlists)
  getAll: () => {
    const user = loadUserPlaylists();
    return [...playlistsMock, ...user];
  },

  getById: (id) => {
    const combined = playlistService.getAll();
    return combined.find(p => p.id === id);
  },

  createPlaylist: ({ name, image = "", songIds = [] }) => {
    const user = loadUserPlaylists();
    const newPL = {
      id: `user_${Date.now()}`,
      name,
      image: image || `https://via.placeholder.com/200?text=${encodeURIComponent(name)}`,
      songIds
    };
    const updated = [...user, newPL];
    saveUserPlaylists(updated);
    return newPL;
  },

  addSongToPlaylist: (playlistId, songId) => {
    const user = loadUserPlaylists();
    const idx = user.findIndex(p => p.id === playlistId);
    if (idx === -1) {
      // can't modify mock playlists — return false
      return false;
    }
    if (!user[idx].songIds.includes(songId)) {
      user[idx].songIds.push(songId);
      saveUserPlaylists(user);
      return true;
    }
    return false;
  },

  removeSongFromPlaylist: (playlistId, songId) => {
    const user = loadUserPlaylists();
    const idx = user.findIndex(p => p.id === playlistId);
    if (idx === -1) return false;
    user[idx].songIds = user[idx].songIds.filter(id => id !== songId);
    saveUserPlaylists(user);
    return true;
  },

  deletePlaylist: (playlistId) => {
    const user = loadUserPlaylists();
    const updated = user.filter(p => p.id !== playlistId);
    saveUserPlaylists(updated);
    return true;
  },

  // returns combined user+mock playlists
  getCombined: () => playlistService.getAll()
};

export default playlistService;
