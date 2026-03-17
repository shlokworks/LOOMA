import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import PostsList from "./pages/admin/PostsList";
import WritePost from "./pages/admin/WritePost";
import EditPost from "./pages/admin/EditPost";

const router = createBrowserRouter([
  // 🌍 Public Layout
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/blog", element: <Blog /> },
      { path: "/post/:id", element: <Post /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/login", element: <Login /> }
    ]
  },

  // 🛠️ Admin Layout
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "posts", element: <PostsList /> },
      { path: "write", element: <WritePost /> },
      { path: "edit/:id", element: <EditPost /> }
    ]
  }
], {
  basename: "/"  // Added basename to fix routing
});

export default router;