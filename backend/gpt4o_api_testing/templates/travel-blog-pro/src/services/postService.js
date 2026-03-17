import postsData from "../mock/posts.json";

let posts = [...postsData];

export const postService = {
  getAll: () => posts,

  getById: (id) => posts.find((p) => String(p.id) === String(id)),

  create: (post) => {
    const newPost = {
      id: posts.length + 1,
      ...post,
      date: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return newPost;
  },

  update: (id, updatedData) => {
    posts = posts.map((p) =>
      p.id === id ? { ...p, ...updatedData } : p
    );
  },
};
