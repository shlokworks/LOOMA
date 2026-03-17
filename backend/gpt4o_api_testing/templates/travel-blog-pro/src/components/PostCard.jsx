import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="block group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition"
    >
      {/* Image */}
      <div className="h-64 w-full overflow-hidden">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-2xl font-extrabold group-hover:text-blue-600 transition">
          {post.title}
        </h2>

        <p className="text-gray-500 text-sm mt-2">{post.author}</p>

        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
          {post.content}
        </p>
      </div>
    </Link>
  );
}
