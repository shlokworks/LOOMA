import portfolioMock from "../mock/portfolio.json";

const KEY = "crypto_portfolio_v1";

const load = () => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : portfolioMock;
};

const save = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

const portfolioService = {
  getPortfolio: () => load(),

  addHolding: (coinId, amount) => {
    const portfolio = load();
    const existing = portfolio.holdings.find(h => h.coinId === coinId);

    if (existing) {
      existing.amount += amount;
    } else {
      portfolio.holdings.push({ coinId, amount });
    }

    save(portfolio);
    return portfolio;
  },

  removeHolding: (coinId) => {
    const portfolio = load();
    portfolio.holdings = portfolio.holdings.filter(h => h.coinId !== coinId);
    save(portfolio);
    return portfolio;
  },

  setBalance: (val) => {
    const portfolio = load();
    portfolio.balance = val;
    save(portfolio);
    return portfolio;
  }
};

export default portfolioService;
