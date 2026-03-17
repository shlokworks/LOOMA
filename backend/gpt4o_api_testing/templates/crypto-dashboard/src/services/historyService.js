import history from "../mock/history.json";

const historyService = {
  get7DayHistory: (coinId) => history[coinId] || [],

  // future extension: candles, 24h, 1h, YTD, All time
  getHistoryRange: (coinId, days) => {
    const data = history[coinId];
    if (!data) return [];
    return data.slice(-days);
  }
};

export default historyService;
