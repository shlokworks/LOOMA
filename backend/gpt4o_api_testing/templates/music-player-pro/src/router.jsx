import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Songs from "./pages/Songs";
import SongDetails from "./pages/SongDetails";
import Albums from "./pages/Albums";
import AlbumDetails from "./pages/AlbumDetails";
import Artists from "./pages/Artists";
import ArtistDetails from "./pages/ArtistDetails";
import Favorites from "./pages/Favorites";
import PlaylistDetails from "./pages/PlaylistDetails"; // optional if you create this page

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/songs", element: <Songs /> },
      { path: "/song/:id", element: <SongDetails /> },
      { path: "/albums", element: <Albums /> },
      { path: "/album/:id", element: <AlbumDetails /> },
      { path: "/artists", element: <Artists /> },
      { path: "/artist/:id", element: <ArtistDetails /> },
      { path: "/favorites", element: <Favorites /> },
      // If you add a playlist details page (recommended), the route below will work
      { path: "/playlist/:id", element: <PlaylistDetails /> }
    ]
  }
]);

export default router;
