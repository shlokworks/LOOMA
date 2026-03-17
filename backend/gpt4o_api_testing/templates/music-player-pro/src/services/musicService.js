// src/services/musicService.js
import songs from "../mock/songs.json";
import artists from "../mock/artists.json";
import albums from "../mock/albums.json";
import playlists from "../mock/playlists.json";

const musicService = {
  getAllSongs: () => songs,
  getSongById: (id) => songs.find(s => s.id === id),
  getAllArtists: () => artists,
  getArtistById: (id) => artists.find(a => a.id === id),
  getAllAlbums: () => albums,
  getAlbumById: (id) => albums.find(al => al.id === id),
  getAllPlaylists: () => playlists,
  getPlaylistById: (id) => playlists.find(p => p.id === id),

  // search songs by title or artist name (case-insensitive)
  searchSongs: (q) => {
    if (!q) return songs;
    const qq = q.toLowerCase();
    return songs.filter(s => 
      s.title.toLowerCase().includes(qq) ||
      // attach artist name check (best-effort)
      (artists.find(a => a.id === s.artistId)?.name || "").toLowerCase().includes(qq)
    );
  },

  // enrich a song with artistName & albumName (useful if services used outside store)
  enrichSong: (song) => {
    if (!song) return null;
    const artist = artists.find(a => a.id === song.artistId);
    const album = albums.find(al => al.id === song.albumId);
    return {
      ...song,
      artistName: artist?.name || "Unknown Artist",
      albumName: album?.title || "Single"
    };
  }
};

export default musicService;
