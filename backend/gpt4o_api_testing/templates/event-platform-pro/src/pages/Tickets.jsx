import React from "react";
import EventList from "../components/EventList";

export default function Tickets() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-6">Get Tickets</h1>

      <EventList />
    </div>
  );
}
