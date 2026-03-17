import React, { useEffect } from "react";
import { useMusicStore } from "../store/useMusicStore";
import SongCard from "../components/SongCard";
import AlbumCard from "../components/AlbumCard";
import PlaylistCard from "../components/PlaylistCard";

const Home = () => {
  const { songs, playlists, albums, loadAll } = useMusicStore();

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to Music Player Pro</h1>

      {/* Featured Songs */}
      <h2 className="text-xl font-semibold mb-3">Top Songs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {songs.slice(0, 6).map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      {/* Featured Playlists */}
      <h2 className="text-xl font-semibold mb-3">Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Albums */}
      <h2 className="text-xl font-semibold mb-3">Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} artist={{ name: album.artistName }} />
        ))}
      </div>
    </div>
  );
};

export default Home;
