import { create } from "zustand";

import coinsData from "../mock/crypto.json";
import historyData from "../mock/history.json";
import portfolioData from "../mock/portfolio.json";

// LocalStorage Keys
const ALERTS_KEY = "crypto_alerts_v1";
const PORTFOLIO_KEY = "crypto_portfolio_v1";

// Helper: Load LS or fallback
const loadLS = (key, fallback) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

// Helper: Save LS
const saveLS = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const useCryptoStore = create((set, get) => ({
  /* ==========================================
         STATE
  =========================================== */
  coins: [],
  history: {},
  portfolio: { balance: 0, holdings: [] },
  alerts: [],

  /* ==========================================
         LOADERS
  =========================================== */
  loadCoins: () => {
    // Load from mock JSON
    set({ coins: coinsData });
  },

  loadHistory: () => {
    set({ history: historyData });
  },

  loadPortfolio: () => {
    const stored = loadLS(PORTFOLIO_KEY, portfolioData);
    set({ portfolio: stored });
  },

  loadAlerts: () => {
    const stored = loadLS(ALERTS_KEY, []);
    set({ alerts: stored });
  },

  /* ==========================================
         GETTERS
  =========================================== */
  getHistory: (coinId) => {
    const h = get().history;
    return h[coinId] || [];
  },

  /* ==========================================
         PORTFOLIO MANAGEMENT
  =========================================== */
  addToPortfolio: (coinId, amount) => {
    let portfolio = get().portfolio;
    const existing = portfolio.holdings.find((h) => h.coinId === coinId);

    if (existing) {
      existing.amount += amount;
    } else {
      portfolio.holdings.push({ coinId, amount });
    }

    saveLS(PORTFOLIO_KEY, portfolio);
    set({ portfolio });
  },

  removeFromPortfolio: (coinId) => {
    let portfolio = get().portfolio;
    portfolio.holdings = portfolio.holdings.filter((h) => h.coinId !== coinId);
    saveLS(PORTFOLIO_KEY, portfolio);
    set({ portfolio });
  },

  /* ==========================================
         ALERT SYSTEM
  =========================================== */
  addAlert: (coinId, targetPrice) => {
    const alerts = get().alerts;
    const newAlert = {
      id: Date.now().toString(),
      coinId,
      targetPrice,
    };

    const updated = [...alerts, newAlert];
    saveLS(ALERTS_KEY, updated);
    set({ alerts: updated });
  },

  deleteAlert: (id) => {
    const updated = get().alerts.filter((a) => a.id !== id);
    saveLS(ALERTS_KEY, updated);
    set({ alerts: updated });
  },

  /* ==========================================
         WEBSOCKET-STYLE LIVE PRICE UPDATER
  =========================================== */
  simulateLivePrices: () => {
    setInterval(() => {
      const updatedCoins = get().coins.map((coin) => {
        // Random price variance ± 0.5%
        const variance = coin.price * 0.005;
        const randomChange = (Math.random() - 0.5) * variance;

        const newPrice = coin.price + randomChange;

        return {
          ...coin,
          price: Number(newPrice.toFixed(2)),
        };
      });

      set({ coins: updatedCoins });

      // Trigger alerts automatically
      get().checkAlerts();
    }, 4000); // Every 4 seconds
  },

  /* ==========================================
         ALERT CHECKING ENGINE
  =========================================== */
  checkAlerts: () => {
    const { alerts, coins } = get();

    alerts.forEach((alert) => {
      const coin = coins.find((c) => c.id === alert.coinId);
      if (!coin) return;

      if (coin.price >= alert.targetPrice) {
        alertUser(`${coin.name} has reached your target: $${alert.targetPrice}`);

        // Auto-delete the alert after triggering
        get().deleteAlert(alert.id);
      }
    });
  },
}));

/* ==========================================
     OPTIONAL ALERT SOUND / POPUP
=========================================== */
function alertUser(message) {
  console.log("ALERT:", message);
  alert(message);
}

export default useCryptoStore;
