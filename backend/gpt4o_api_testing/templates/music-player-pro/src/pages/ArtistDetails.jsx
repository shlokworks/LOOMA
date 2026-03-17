import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMusicStore } from "../store/useMusicStore";
import SongCard from "../components/SongCard";
import AlbumCard from "../components/AlbumCard";

const ArtistDetails = () => {
  const { id } = useParams();
  const { artists, albums, songs, loadAll } = useMusicStore();

  useEffect(() => {
    loadAll();
  }, []);

  const artist = artists.find((a) => a.id === id);
  if (!artist) return <p>Loading...</p>;

  const artistAlbums = albums.filter((al) => al.artistId === id);
  const artistSongs = songs.filter((s) => s.artistId === id);

  return (
    <div className="max-w-6xl mx-auto">
      <img 
        src={artist.image}
        className="w-40 h-40 rounded-full object-cover mb-6"
      />

      <h1 className="text-3xl font-bold">{artist.name}</h1>
      <p classh="text-gray-500">{artist.genre}</p>

      <h2 className="text-xl font-semibold mt-8 mb-4">Songs</h2>
      <div className="space-y-4">
        {artistSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artistAlbums.map((album) => (
          <AlbumCard 
            key={album.id}
            album={album}
            artist={artist}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtistDetails;
