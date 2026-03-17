import React, { useEffect } from "react";
import useCryptoStore from "../store/useCryptoStore";
import PortfolioCard from "../components/PortfolioCard";

const Portfolio = () => {
  const { loadCoins, coins, portfolio, loadPortfolio } = useCryptoStore();

  useEffect(() => {
    loadCoins();
    loadPortfolio();
  }, []);

  const totalValue = portfolio.holdings.reduce((sum, h) => {
    const coin = coins.find((c) => c.id === h.coinId);
    return sum + (coin ? coin.price * h.amount : 0);
  }, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>

      <div className="bg-white p-5 rounded shadow mb-6">
        <p className="text-gray-500">Total Value</p>
        <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
      </div>

      <div className="space-y-4">
        {portfolio.holdings.map((h) => {
          const coin = coins.find((c) => c.id === h.coinId);
          return <PortfolioCard key={h.coinId} holding={h} coin={coin} />;
        })}
      </div>
    </div>
  );
};

export default Portfolio;
