import React from "react";
import { Link } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer text-center">
        <img 
          src={playlist.image} 
          className="w-full h-40 object-cover rounded mb-3"
        />
        <h3 className="text-lg font-semibold">{playlist.name}</h3>
      </div>
    </Link>
  );
};

export default PlaylistCard;
