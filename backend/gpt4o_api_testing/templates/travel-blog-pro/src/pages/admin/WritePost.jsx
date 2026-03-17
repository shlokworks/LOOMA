import React, { useState } from "react";
import { postService } from "../../services/postService";

export default function WritePost() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    postService.create({ title, cover, content, author: "Admin" });
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Write New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Cover Image URL"
          className="w-full p-3 border rounded-lg"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />

        <textarea
          rows="8"
          placeholder="Content"
          className="w-full p-3 border rounded-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Publish Post
        </button>
      </form>
    </div>
  );
}
