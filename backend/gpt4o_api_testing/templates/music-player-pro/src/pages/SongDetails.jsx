import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMusicStore } from "../store/useMusicStore";

const SongDetails = () => {
  const { id } = useParams();
  const { songs, loadAll, playSong } = useMusicStore();

  const [song, setSong] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setSong(songs.find((s) => s.id === id) || null);
  }, [songs, id]);

  if (!song) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <img src={song.image} className="w-full h-80 object-cover rounded mb-6" />

      <h1 className="text-3xl font-bold">{song.title}</h1>
      <p className="text-gray-500 text-lg">{song.artistName}</p>

      <button
        onClick={() => playSong(song.id)}
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded"
      >
        Play Song
      </button>

      <p className="mt-6 text-gray-600">
        Duration: {Math.floor(song.duration / 60)}:
        {(song.duration % 60).toString().padStart(2, "0")}
      </p>
    </div>
  );
};

export default SongDetails;
