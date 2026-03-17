import React from "react";
import { useMusicStore } from "../store/useMusicStore";

const SongCard = ({ song }) => {
  const { playSong } = useMusicStore();

  return (
    <div 
      onClick={() => playSong(song.id)}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer flex items-center gap-4 transition"
    >
      <img 
        src={song.image} 
        alt={song.title} 
        className="w-16 h-16 rounded object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{song.title}</h3>
        <p className="text-sm text-gray-500">{song.artistName}</p>
      </div>

      <span className="text-gray-500 text-sm">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}</span>
    </div>
  );
};

export default SongCard;
