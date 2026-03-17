import posts from "../mocks/posts.json";
import users from "../mocks/users.json";

export const getFeed = () => {
  // Join posts + user info
  return posts.map((post) => {
    const user = users.find((u) => u.id === post.userId);
    return { ...post, user };
  });
};

export const createPost = (content, userId = 1) => {
  const newPost = {
    id: posts.length + 1,
    userId,
    content,
    likes: 0,
    comments: 0,
    timestamp: new Date().toISOString(),
  };
  
  return newPost; // Just return, don't mutate
};