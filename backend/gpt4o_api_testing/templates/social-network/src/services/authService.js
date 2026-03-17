export const loginUser = (email, password) => {
  if (email && password) {
    localStorage.setItem("auth", "true");
    return { success: true };
  }
  return { success: false, message: "Invalid credentials" };
};

export const logoutUser = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
};

export const registerUser = (name, email, password) => {
  return { success: true };
};
