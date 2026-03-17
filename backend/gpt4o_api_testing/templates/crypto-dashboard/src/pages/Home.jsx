import React, { useEffect } from "react";
import useCryptoStore from "../store/useCryptoStore";
import StatCard from "../components/StatCard";
import CryptoCard from "../components/CryptoCard";

const Home = () => {
  const { loadCoins, coins } = useCryptoStore();

  useEffect(() => {
    loadCoins();
  }, []);

  const top = coins.slice(0, 6);

  // Fake stats (can be computed later)
  const globalMarketCap = coins.reduce((sum, c) => sum + c.marketCap, 0);
  const totalVolume = coins.reduce((sum, c) => sum + c.volume24h, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          label="Global Market Cap"
          value={`$${(globalMarketCap / 1e12).toFixed(2)}T`}
        />
        <StatCard 
          label="24h Volume"
          value={`$${(totalVolume / 1e9).toFixed(2)}B`}
        />
        <StatCard 
          label="Coins Tracked"
          value={coins.length}
        />
      </div>

      {/* Trending */}
      <h2 className="text-2xl font-semibold mb-4">Trending Coins</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {top.map((coin) => (
          <CryptoCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
};

export default Home;
