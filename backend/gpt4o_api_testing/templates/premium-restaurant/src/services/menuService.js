import menu from "../mock/menu.json";

export const getAllMenuItems = () => menu;

export const getMenuByCategory = (category) => {
  if (category === "All") return menu;
  return menu.filter((item) => item.category === category);
};

export const getMenuItemById = (id) => {
  return menu.find((item) => item.id === Number(id)) || null;
};
