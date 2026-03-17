import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Markets from "./pages/Markets";
import CoinDetails from "./pages/CoinDetails";
import Portfolio from "./pages/Portfolio";
import Alerts from "./pages/Alerts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/markets", element: <Markets /> },
      { path: "/coin/:id", element: <CoinDetails /> },
      { path: "/portfolio", element: <Portfolio /> },
      { path: "/alerts", element: <Alerts /> }
    ]
  }
]);

export default router;
