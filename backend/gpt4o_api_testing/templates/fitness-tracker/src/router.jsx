import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Goals from "./pages/Goals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "workouts", element: <Workouts /> },
      { path: "nutrition", element: <Nutrition /> },
      { path: "progress", element: <Progress /> },
      { path: "goals", element: <Goals /> }
    ]
  }
]);

export default router;
