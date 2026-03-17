import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postService } from "../services/postService";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(postService.getById(id));
  }, [id]);

  if (!post) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <img
        src={post.cover}
        alt={post.title}
        className="w-full h-[420px] object-cover rounded-xl mb-6"
      />

      <h1 className="text-5xl font-extrabold tracking-tight">{post.title}</h1>
      <p className="text-gray-500 mt-2">By {post.author}</p>

      <p className="text-lg mt-6 text-gray-700 leading-relaxed">{post.content}</p>
    </div>
  );
}
