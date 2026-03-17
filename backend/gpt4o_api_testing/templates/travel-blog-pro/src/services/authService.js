import { users } from "../mock/users.json";

export const authService = {
  login: async (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error("Invalid credentials");

    return {
      token: "mock-token-123",
      user,
    };
  },
};
