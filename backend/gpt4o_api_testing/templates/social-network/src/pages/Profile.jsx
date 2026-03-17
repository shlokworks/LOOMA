import React, { useEffect, useState } from "react";
import users from "../mocks/users.json";
import PostCard from "../components/PostCard";
import { getFeed } from "../services/feedService";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || users[0];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const feed = getFeed();
    const userPosts = feed.filter((post) => post.userId === user.id);
    setPosts(userPosts);
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-20">

      {/* Cover */}
      <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"></div>

      {/* Profile Header */}
      <div className="px-6 -mt-16 flex items-center gap-6">
        <img
          src={user.avatar}
          className="w-32 h-32 rounded-full border-4 border-white object-cover shadow"
        />

        <div>
          <h2 className="text-3xl font-bold dark:text-white">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-300">{user.username}</p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio}</p>

          <div className="flex gap-6 mt-4 text-sm dark:text-gray-300">
            <span className="font-semibold">{user.followers}</span> Followers
            <span className="font-semibold">{user.following}</span> Following
            <span className="font-semibold">{posts.length}</span> Posts
          </div>

          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Posts */}
      <h3 className="text-xl font-bold mt-10 mb-4 dark:text-white">Posts</h3>
      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
