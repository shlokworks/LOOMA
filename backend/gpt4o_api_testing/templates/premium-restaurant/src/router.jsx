import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ItemDetails from "./pages/ItemDetails";
import Reservation from "./pages/Reservation";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },           // ⬅ CORRECT HOME ROUTE
      { path: "menu", element: <Menu /> },          // ⬅ REMOVE LEADING SLASH
      { path: "menu/:id", element: <ItemDetails /> },
      { path: "reservation", element: <Reservation /> },
      { path: "cart", element: <Cart /> },
      { path: "order", element: <Order /> },
      { path: "about", element: <About /> }
    ]
  }
]);

export default router;
