import users from "../mocks/users.json";
import { getFeed } from "./feedService";

export const getUserById = (id) => users.find((u) => u.id === id);

export const getAllUsers = () => users;

export const getUserPosts = (id) => {
  const feed = getFeed();
  return feed.filter((p) => p.userId === id);
};

export const getUserStats = (id) => {
  const user = getUserById(id);
  return {
    followers: user.followers,
    following: user.following,
    posts: getUserPosts(id).length,
  };
};

export const updateUserBio = (id, bio) => {
  console.log("Simulated update →", id, bio);
  return { success: true };
};
