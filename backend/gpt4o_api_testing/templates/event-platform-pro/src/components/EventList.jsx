import React from "react";
import { eventService } from "../services/eventService";
import EventCard from "./EventCard";

export default function EventList() {
  const events = eventService.getAll();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} />
      ))}
    </div>
  );
}
