import React from "react";
import { Link } from "react-router-dom";

const AlbumCard = ({ album, artist }) => {
  return (
    <Link to={`/album/${album.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md cursor-pointer transition">
        <img 
          src={album.image}
          alt={album.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
        <h3 className="font-semibold text-lg">{album.title}</h3>
        <p className="text-gray-500 text-sm">{artist.name}</p>
      </div>
    </Link>
  );
};

export default AlbumCard;
