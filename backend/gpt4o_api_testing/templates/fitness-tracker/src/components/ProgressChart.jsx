import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ProgressChart({ title, data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 100 }
          }
        }
      }
    });
  }, [data]);

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
