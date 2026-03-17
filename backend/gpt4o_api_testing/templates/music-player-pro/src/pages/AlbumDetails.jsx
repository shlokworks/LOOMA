import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMusicStore } from "../store/useMusicStore";
import SongCard from "../components/SongCard";

const AlbumDetails = () => {
  const { id } = useParams();
  const { albums, songs, artists, loadAll } = useMusicStore();

  useEffect(() => {
    loadAll();
  }, []);

  const album = albums.find((a) => a.id === id);
  if (!album) return <p>Loading...</p>;

  const artist = artists.find((a) => a.id === album.artistId);
  const albumSongs = songs.filter((s) => s.albumId === id);

  return (
    <div className="max-w-5xl mx-auto">
      <img src={album.image} className="w-full h-80 object-cover rounded mb-6" />

      <h1 className="text-3xl font-bold">{album.title}</h1>
      <p className="text-gray-500">{artist.name} • {album.year}</p>

      <h2 className="text-xl font-semibold mt-6 mb-4">Songs</h2>

      <div className="space-y-4">
        {albumSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default AlbumDetails;
