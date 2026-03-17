/**
 * Generate weekly stats for charts
 * Using store prepared functions
 */
export const getBurnChartData = (weeklyStats) => {
  return {
    labels: weeklyStats.map((s) => s.day),
    datasets: [
      {
        label: "Calories Burned",
        data: weeklyStats.map((s) => s.value),
        borderWidth: 2
      }
    ]
  };
};

export const getIntakeChartData = (weeklyStats) => {
  return {
    labels: weeklyStats.map((s) => s.day),
    datasets: [
      {
        label: "Calories Consumed",
        data: weeklyStats.map((s) => s.value),
        borderWidth: 2
      }
    ]
  };
};
