import React from "react";

const PortfolioCard = ({ holding, coin }) => {
  if (!coin) return null;

  const totalValue = coin.price * holding.amount;

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{coin.name}</h3>
        <p className="text-gray-500 text-sm">{holding.amount} {coin.symbol.toUpperCase()}</p>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold">${totalValue.toLocaleString()}</p>
        <p className="text-sm text-gray-400">(${coin.price} each)</p>
      </div>
    </div>
  );
};

export default PortfolioCard;
