import coins from "../mock/crypto.json";

const cryptoService = {
  getAll: () => coins,

  getById: (id) => coins.find((c) => c.id === id),

  search: (query) => {
    const q = query.toLowerCase();
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  },

  topGainers: () => {
    return [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  },

  topLosers: () => {
    return [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 5);
  },

  sortByMarketCap: () => {
    return [...coins].sort((a, b) => b.marketCap - a.marketCap);
  }
};

export default cryptoService;
