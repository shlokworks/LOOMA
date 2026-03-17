import React, { useState } from "react";
import { useTrackerStore } from "../store/useTrackerStore";
import { getGoalProgress } from "../services/goalService";

export default function Goals() {
  const goals = useTrackerStore((s) => s.goals);
  const updateGoal = useTrackerStore((s) => s.updateGoal);
  const updateProgress = useTrackerStore((s) => s.updateProgress);

  const progress = getGoalProgress(goals);

  const [dailyBurn, setDailyBurn] = useState(goals.dailyBurnGoal);
  const [dailyCal, setDailyCal] = useState(goals.dailyCalorieGoal);

  const saveGoals = () => {
    updateGoal("dailyCalorieGoal", dailyCal);
    updateGoal("dailyBurnGoal", dailyBurn);
    updateProgress();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Fitness Goals</h2>

      <div className="bg-white shadow p-6 rounded-xl mb-8">
        <p className="mb-2">
          <strong>Workouts Completed:</strong> {goals.currentProgress.workoutsCompleted}
        </p>
        <p className="mb-2">
          <strong>Calories Burned:</strong> {goals.currentProgress.caloriesBurned}
        </p>
        <p>
          <strong>Workout Goal Progress:</strong> {progress.workoutsPercent}%
        </p>
      </div>

      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Update Daily Goals</h3>

        <label className="block mb-2 font-medium">Daily Calorie Goal</label>
        <input
          type="number"
          className="p-2 border rounded w-full mb-4"
          value={dailyCal}
          onChange={(e) => setDailyCal(Number(e.target.value))}
        />

        <label className="block mb-2 font-medium">Daily Burn Goal</label>
        <input
          type="number"
          className="p-2 border rounded w-full mb-4"
          value={dailyBurn}
          onChange={(e) => setDailyBurn(Number(e.target.value))}
        />

        <button
          onClick={saveGoals}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}
