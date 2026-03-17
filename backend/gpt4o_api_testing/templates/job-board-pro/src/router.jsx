import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import SavedJobs from "./pages/SavedJobs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/job/:id", element: <JobDetails /> },
      { path: "/companies", element: <Companies /> },
      { path: "/company/:id", element: <CompanyDetails /> },
      { path: "/saved", element: <SavedJobs /> }
    ]
  }
]);

export default router;
