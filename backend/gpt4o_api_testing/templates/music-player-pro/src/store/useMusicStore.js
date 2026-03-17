import { create } from "zustand";

import songsData from "../mock/songs.json";
import artistsData from "../mock/artists.json";
import albumsData from "../mock/albums.json";
import playlistsData from "../mock/playlists.json";

const FAVORITES_KEY = "music_player_favorites_v1";

/* Load favorites from LS */
const loadFavorites = () => {
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
};

/* Save favorites */
const saveFavorites = (data) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
};

export const useMusicStore = create((set, get) => ({
  /* ==========================================================
     STATE
  ========================================================== */
  songs: [],
  albums: [],
  artists: [],
  playlists: [],
  favorites: loadFavorites(),

  currentSong: null,
  isPlaying: false,
  progress: 0,
  duration: 0,

  queue: [],
  queueIndex: 0,

  /* ==========================================================
     LOAD ALL (songs + artists + albums + playlists)
  ========================================================== */
  loadAll: () => {
    // Attach artistName & albumName to songs
    const enrichedSongs = songsData.map((s) => {
      const artist = artistsData.find((a) => a.id === s.artistId);
      const album = albumsData.find((al) => al.id === s.albumId);

      return {
        ...s,
        artistName: artist ? artist.name : "Unknown Artist",
        albumName: album ? album.title : "Single"
      };
    });

    set({
      songs: enrichedSongs,
      artists: artistsData,
      albums: albumsData.map((al) => ({
        ...al,
        artistName: artistsData.find((a) => a.id === al.artistId)?.name || "Unknown"
      })),
      playlists: playlistsData
    });
  },

  /* ==========================================================
     PLAY SONG
  ========================================================== */
  playSong: (songId) => {
    const { songs } = get();
    const song = songs.find((s) => s.id === songId);

    if (!song) return;

    set({
      currentSong: song,
      isPlaying: true,
      progress: 0,
      duration: song.duration,
      queue: songs.map((s) => s.id), // full queue
      queueIndex: songs.findIndex((s) => s.id === songId)
    });
  },

  /* ==========================================================
     TOGGLE PLAY
  ========================================================== */
  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
  },

  /* ==========================================================
     SEEK (update progress from audio)
  ========================================================== */
  seek: (time) => {
    set({ progress: time });
  },

  /* ==========================================================
     NEXT SONG
  ========================================================== */
  playNext: () => {
    const { queue, queueIndex, songs } = get();
    const nextIndex = (queueIndex + 1) % queue.length;
    const nextId = queue[nextIndex];

    get().playSong(nextId);
    set({ queueIndex: nextIndex });
  },

  /* ==========================================================
     PREVIOUS SONG
  ========================================================== */
  playPrev: () => {
    const { queue, queueIndex } = get();
    const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    const prevId = queue[prevIndex];

    get().playSong(prevId);
    set({ queueIndex: prevIndex });
  },

  /* ==========================================================
     FAVORITES SYSTEM
  ========================================================== */
  toggleFavorite: (songId) => {
    const { favorites, songs } = get();

    const exists = favorites.includes(songId);
    let updated;

    if (exists) {
      updated = favorites.filter((id) => id !== songId);
    } else {
      updated = [...favorites, songId];
    }

    saveFavorites(updated);

    set({
      favorites: updated,
      favoriteSongs: updated.map((id) => songs.find((s) => s.id === id))
    });
  },

  /* Get favorite songs directly */
  favoriteSongs: [],

  refreshFavorites: () => {
    const { songs, favorites } = get();
    set({
      favoriteSongs: favorites.map((id) => songs.find((s) => s.id === id))
    });
  }
}));
