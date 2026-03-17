import React, { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import { useMusicStore } from "../store/useMusicStore";

const Songs = () => {
  const { songs, loadAll } = useMusicStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artistName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Songs</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search songs..."
        className="border p-2 rounded w-full md:w-1/2 mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Songs List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default Songs;
