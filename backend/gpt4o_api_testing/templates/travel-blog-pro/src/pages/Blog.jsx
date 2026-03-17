import React from "react";
import PostList from "../components/PostList";

export default function Blog() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold mb-6 tracking-tight">All Posts</h1>
      <PostList />
    </div>
  );
}
