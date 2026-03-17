import React from "react";
import { eventService } from "../../services/eventService";

export default function EventsList() {
  const events = eventService.getAll();

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">All Events</h1>

      <div className="space-y-4">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">{ev.title}</h2>
            <p className="text-gray-500">{ev.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
