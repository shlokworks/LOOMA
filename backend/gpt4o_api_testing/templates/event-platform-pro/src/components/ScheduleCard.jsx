import React from "react";

export default function ScheduleCard({ event }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="text-gray-500">{event.location}</p>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
      </div>
    </div>
  );
}
