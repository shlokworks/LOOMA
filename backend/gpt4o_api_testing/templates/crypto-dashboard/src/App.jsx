import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import useCryptoStore from "./store/useCryptoStore";

const App = () => {
  const { simulateLivePrices, loadCoins, loadAlerts, loadHistory, loadPortfolio } = useCryptoStore();

  useEffect(() => {
    // Load initial data
    loadCoins();
    loadAlerts();
    loadHistory();
    loadPortfolio();

    // Start simulated WebSocket updates
    simulateLivePrices();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
