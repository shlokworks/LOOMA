import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import StoryCard from "../components/StoryCard";
import CreatePostBox from "../components/CreatePostBox";
import users from "../mocks/users.json";
import { getFeed } from "../services/feedService";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const feed = getFeed();
    setPosts(feed);
  }, []);

  const handleNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 px-4">

      {/* Stories Section */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {users.slice(0, 8).map((user) => (
          <StoryCard key={user.id} user={user} />
        ))}
      </div>

      {/* Create Post */}
      <CreatePostBox onPost={handleNewPost} />

      {/* Feed Posts */}
      <h1 className="text-xl font-bold mb-3 dark:text-white">Latest Posts</h1>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
