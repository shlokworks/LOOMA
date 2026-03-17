import React from "react";
import events from "../mock/events.json";
import ScheduleCard from "../components/ScheduleCard";

export default function Schedule() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-6">Event Schedule</h1>

      <div className="space-y-6">
        {events.map((ev) => (
          <ScheduleCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
