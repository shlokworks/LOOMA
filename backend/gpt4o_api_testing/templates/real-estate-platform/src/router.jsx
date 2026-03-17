import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import Agents from "./pages/Agents";
import Favorites from "./pages/Favorites";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/listings", element: <Listings /> },
      { path: "/property/:id", element: <PropertyDetails /> },
      { path: "/agents", element: <Agents /> },
      { path: "/favorites", element: <Favorites /> },
    ],
  },
]);

export default router;
