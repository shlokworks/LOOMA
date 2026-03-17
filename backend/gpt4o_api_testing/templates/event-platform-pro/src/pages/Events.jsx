import React from "react";
import EventFilters from "../components/EventFilters";
import EventList from "../components/EventList";

export default function Events() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold mb-6">All Events</h1>

      <EventFilters />
      <div className="mt-8">
        <EventList />
      </div>
    </div>
  );
}
