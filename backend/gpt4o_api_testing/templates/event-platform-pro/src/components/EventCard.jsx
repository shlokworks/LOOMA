import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <Link
      to={`/event/${event.id}`}
      className="block group bg-white rounded-xl shadow-sm hover:shadow-xl transition border"
    >
      <div className="h-56 overflow-hidden rounded-t-xl">
        <img
          src={event.cover}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold group-hover:text-blue-600 transition">
          {event.title}
        </h2>

        <p className="text-gray-500 mt-1">{event.location}</p>

        <p className="text-gray-600 mt-3 line-clamp-2 text-sm">
          {event.description}
        </p>
      </div>
    </Link>
  );
}
