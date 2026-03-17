import React from "react";
import { Link } from "react-router-dom";

const ArtistCard = ({ artist }) => {
  return (
    <Link to={`/artist/${artist.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer text-center">
        <img 
          src={artist.image} 
          alt={artist.name}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
        />
        <h3 className="font-semibold">{artist.name}</h3>
        <p className="text-gray-500 text-sm">{artist.genre}</p>
      </div>
    </Link>
  );
};

export default ArtistCard;
