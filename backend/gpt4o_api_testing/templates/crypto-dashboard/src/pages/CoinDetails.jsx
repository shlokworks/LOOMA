import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCryptoStore from "../store/useCryptoStore";
import PriceChart from "../components/PriceChart";

const CoinDetails = () => {
  const { id } = useParams();
  const { loadCoins, coins, getHistory } = useCryptoStore();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    const found = coins.find((c) => c.id === id);
    setCoin(found || null);
  }, [coins, id]);

  if (!coin) return <p>Loading coin data...</p>;

  const history = getHistory(coin.id);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{coin.name}</h1>
      <p className="text-gray-500 uppercase">{coin.symbol}</p>

      {/* Price */}
      <div className="mt-4">
        <p className="text-4xl font-bold">${coin.price.toLocaleString()}</p>
        <p
          className={`text-lg font-semibold mt-2 ${
            coin.change24h >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {coin.change24h}% (24h)
        </p>
      </div>

      {/* Chart */}
      <div className="mt-6">
        <PriceChart data={history} />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Market Cap</p>
          <p className="font-bold text-xl">${coin.marketCap.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">24h Volume</p>
          <p className="font-bold text-xl">${coin.volume24h.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Rank</p>
          <p className="font-bold text-xl">{coin.rank}</p>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
