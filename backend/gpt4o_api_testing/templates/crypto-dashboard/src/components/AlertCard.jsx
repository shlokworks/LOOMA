import React from "react";

const AlertCard = ({ alert, coin, deleteAlert }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between">
      <div>
        <h3 className="font-bold">{coin.name}</h3>
        <p className="text-gray-500 text-sm">
          Trigger: ${alert.targetPrice.toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => deleteAlert(alert.id)}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Remove
      </button>
    </div>
  );
};

export default AlertCard;
