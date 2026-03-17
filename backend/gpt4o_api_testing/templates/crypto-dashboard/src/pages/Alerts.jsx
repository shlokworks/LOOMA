import React, { useEffect, useState } from "react";
import useCryptoStore from "../store/useCryptoStore";
import AlertCard from "../components/AlertCard";

const Alerts = () => {
  const { loadCoins, coins, alerts, addAlert, deleteAlert } = useCryptoStore();

  const [coinId, setCoinId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  useEffect(() => {
    loadCoins();
  }, []);

  const handleAdd = () => {
    if (!coinId || !targetPrice) return alert("Enter coin and target price");

    addAlert(coinId, Number(targetPrice));
    setTargetPrice("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Price Alerts</h1>

      {/* Add Alert */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Create Alert</h3>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="border p-2 rounded"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
          >
            <option value="">Select Coin</option>
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Target Price"
            className="border p-2 rounded"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Alert
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((a) => {
          const coin = coins.find((c) => c.id === a.coinId);
          return <AlertCard key={a.id} alert={a} coin={coin} deleteAlert={deleteAlert} />;
        })}
      </div>
    </div>
  );
};

export default Alerts;
