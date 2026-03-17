import React, { useEffect } from "react";
import { useMusicStore } from "../store/useMusicStore";
import ArtistCard from "../components/ArtistCard";

const Artists = () => {
  const { artists, loadAll } = useMusicStore();

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Artists</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default Artists;
