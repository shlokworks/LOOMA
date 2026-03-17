import React, { useEffect, useState } from "react";
import useCryptoStore from "../store/useCryptoStore";
import CryptoCard from "../components/CryptoCard";

const Markets = () => {
  const { loadCoins, coins } = useCryptoStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadCoins();
  }, []);

  const filtered = coins.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Markets</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search coin..."
        className="w-full md:w-1/2 border p-2 mb-6 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filtered.map((coin) => (
          <CryptoCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
};

export default Markets;
