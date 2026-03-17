import React from "react";
import PostList from "../components/PostList";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero Section */}
      <div className="mb-12">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Hero"
          className="w-full h-[420px] object-cover rounded-xl"
        />

        <h1 className="text-5xl font-extrabold mt-8 tracking-tight leading-tight">
          Discover Stunning Journeys  
        </h1>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl">
          Dive into stories from around the world written by passionate travelers.
        </p>
      </div>

      {/* Latest Posts */}
      <PostList />
    </div>
  );
}
