import users from "../mock/users.json";

const userService = {
  getAll: () => users,
  getById: (id) => users.find(u => u.id === id),
  getStudent: () => users.find(u => u.role === "student")
};

export default userService;
