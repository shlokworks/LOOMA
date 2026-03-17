import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventService } from "../services/eventService";
import TicketModal from "../components/TicketModal";

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    setEvent(eventService.getById(id));
  }, [id]);

  if (!event) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <img
        src={event.cover}
        alt={event.title}
        className="w-full h-[420px] object-cover rounded-xl mb-6"
      />

      <h1 className="text-5xl font-extrabold">{event.title}</h1>
      <p className="text-gray-500 mt-2 text-lg">{event.location}</p>

      <p className="text-gray-700 text-lg mt-6 leading-relaxed">
        {event.description}
      </p>

      <TicketModal event={event} />
    </div>
  );
}
