import React from "react";
import { useMusicStore } from "../store/useMusicStore";
import SongCard from "../components/SongCard";

const Favorites = () => {
  const { favorites } = useMusicStore();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Favorite Songs</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">No favorite songs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
