import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/courses", element: <Courses /> },
      { path: "/course/:id", element: <CourseDetails /> },
      { path: "/lesson/:id", element: <Lesson /> },
      { path: "/quiz/:id", element: <Quiz /> },
      { path: "/profile", element: <Profile /> },
      { path: "/dashboard", element: <Dashboard /> }
    ]
  }
]);

export default router;
