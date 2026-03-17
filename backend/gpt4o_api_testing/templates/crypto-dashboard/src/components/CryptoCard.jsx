import React from "react";
import { Link } from "react-router-dom";

const CryptoCard = ({ coin }) => {
  const isPositive = coin.change24h >= 0;

  return (
    <Link to={`/coin/${coin.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 cursor-pointer">
        
        {/* Top: Name + Symbol */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{coin.name}</h3>
          <span className="text-gray-500 uppercase text-sm">{coin.symbol}</span>
        </div>

        {/* Price */}
        <p className="mt-2 text-2xl font-bold">
          ${coin.price.toLocaleString()}
        </p>

        {/* 24h Change */}
        <p className={`mt-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "+" : ""}{coin.change24h}% (24h)
        </p>

        {/* Sparkline */}
        <div className="mt-3">
          <svg width="100%" height="40">
            <polyline
              fill="none"
              stroke={isPositive ? "green" : "red"}
              strokeWidth="2"
              points={coin.sparkline
                .map((v, i) => `${i * 20},${40 - (v / Math.max(...coin.sparkline)) * 40}`)
                .join(" ")}
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;
