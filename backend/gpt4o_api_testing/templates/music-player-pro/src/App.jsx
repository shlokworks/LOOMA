import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useMusicStore } from "./store/useMusicStore";

const App = () => {
  const loadAll = useMusicStore((s) => s.loadAll);

  useEffect(() => {
    loadAll();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
