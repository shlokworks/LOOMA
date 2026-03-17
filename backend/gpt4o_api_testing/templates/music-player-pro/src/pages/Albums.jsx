import React, { useEffect } from "react";
import { useMusicStore } from "../store/useMusicStore";
import AlbumCard from "../components/AlbumCard";

const Albums = () => {
  const { albums, artists, loadAll } = useMusicStore();

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Albums</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <AlbumCard 
            key={album.id}
            album={album}
            artist={artists.find((a) => a.id === album.artistId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Albums;
