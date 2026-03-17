import React from "react";
import { postService } from "../services/postService";
import PostCard from "./PostCard";

export default function PostList() {
  const posts = postService.getAll();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
