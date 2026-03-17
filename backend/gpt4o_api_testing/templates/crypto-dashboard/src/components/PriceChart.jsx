import React from "react";

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No chart data</p>;

  const max = Math.max(...data);
  const min = Math.min(...data);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">7-Day Price Chart</h2>

      <svg width="100%" height="200" className="overflow-visible">
        <polyline
          fill="none"
          stroke="blue"
          strokeWidth="3"
          points={data
            .map((v, i) => `${i * 50},${200 - ((v - min) / (max - min)) * 180}`)
            .join(" ")}
        />
      </svg>
    </div>
  );
};

export default PriceChart;
