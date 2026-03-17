import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import router from "./router";
import useJobStore from "./store/useJobStore";

const App = () => {
  const { loadJobs, loadCompanies, loadCategories } = useJobStore();

  useEffect(() => {
    loadJobs();
    loadCompanies();
    loadCategories();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
