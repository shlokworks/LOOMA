import users from "../mock/users.json";

export const userService = {
  getAll: () => users,
  getById: (id) => users.find((u) => u.id === id),
};
