import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";

// Public Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Speakers from "./pages/Speakers";
import Schedule from "./pages/Schedule";
import Tickets from "./pages/Tickets";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";


// Organizer Pages
import Dashboard from "./pages/organizer/Dashboard";
import EventsList from "./pages/organizer/EventsList";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import Attendees from "./pages/organizer/Attendees";

const router = createBrowserRouter([
  // 🌍 PUBLIC ROUTES
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/events", element: <Events /> },
      { path: "/event/:id", element: <Event /> },
      { path: "/speakers", element: <Speakers /> },
      { path: "/schedule", element: <Schedule /> },
      { path: "/tickets", element: <Tickets /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> }
    ]
  },

  // 🛠️ ORGANIZER ROUTES
  {
    path: "/organizer",
    element: <OrganizerLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "events", element: <EventsList /> },
      { path: "create", element: <CreateEvent /> },
      { path: "edit/:id", element: <EditEvent /> },
      { path: "attendees", element: <Attendees /> }
    ]
  }
]);

export default router;
