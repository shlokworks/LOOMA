import React, { useState } from "react";
import { eventService } from "../../services/eventService";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    eventService.create({
      title,
      cover,
      location,
      description
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Event Title"
          className="w-full border p-3 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Cover Image URL"
          className="w-full border p-3 rounded-lg"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-3 rounded-lg"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <textarea
          rows="6"
          placeholder="Event Description"
          className="w-full border p-3 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Create Event
        </button>
      </form>
    </div>
  );
}
