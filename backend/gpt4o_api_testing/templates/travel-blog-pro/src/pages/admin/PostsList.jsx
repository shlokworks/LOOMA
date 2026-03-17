import React from "react";
import { postService } from "../../services/postService";

export default function PostsList() {
  const posts = postService.getAll();

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">All Posts</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500">{post.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
