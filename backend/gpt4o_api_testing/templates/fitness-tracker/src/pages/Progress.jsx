import React from "react";
import { useTrackerStore } from "../store/useTrackerStore";
import ProgressChart from "../components/ProgressChart";
import { getBurnChartData, getIntakeChartData } from "../services/statsService";

export default function Progress() {
  const weeklyBurn = useTrackerStore((s) => s.getWeeklyBurnStats());
  const weeklyIntake = useTrackerStore((s) => s.getWeeklyIntakeStats());

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProgressChart
          title="Calories Burned (Weekly)"
          data={getBurnChartData(weeklyBurn)}
        />

        <ProgressChart
          title="Calories Consumed (Weekly)"
          data={getIntakeChartData(weeklyIntake)}
        />
      </div>
    </div>
  );
}
