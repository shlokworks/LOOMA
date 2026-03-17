import React from "react";
import EventList from "../components/EventList";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <div className="mb-12">
        <img
          src="https://images.unsplash.com/photo-1540574163026-643ea20ade25"
          className="w-full h-[420px] object-cover rounded-xl"
          alt="Conference"
        />
        <h1 className="text-5xl font-extrabold mt-8 tracking-tight">
          Discover Events That Inspire
        </h1>
        <p className="text-gray-600 text-lg mt-3 max-w-2xl">
          Explore conferences, workshops, and meetups happening near you.
        </p>
      </div>

      {/* Featured Events */}
      <EventList />
    </div>
  );
}
