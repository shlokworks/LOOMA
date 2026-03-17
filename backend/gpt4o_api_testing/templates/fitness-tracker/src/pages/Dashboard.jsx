import React from "react";
import { useTrackerStore } from "../store/useTrackerStore";
import { today } from "../services/exerciseService";

export default function Dashboard() {
  const workouts = useTrackerStore((s) => s.workouts);
  const meals = useTrackerStore((s) => s.meals);

  const burnedToday = useTrackerStore((s) => s.getBurnedToday());
  const consumedToday = useTrackerStore((s) => s.getCaloriesConsumedToday());

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      <p className="text-gray-600 mb-6">
        Overview for <strong>{today()}</strong>
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold">Calories Burned</h3>
          <p className="text-2xl font-bold mt-2">{burnedToday}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold">Calories Consumed</h3>
          <p className="text-2xl font-bold mt-2">{consumedToday}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold">Workouts Logged</h3>
          <p className="text-2xl font-bold mt-2">
            {workouts.filter((w) => w.date === today()).length}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="mb-2">
            <strong>Workouts:</strong> {workouts.length}
          </p>
          <p>
            <strong>Meals Logged:</strong> {meals.length}
          </p>
        </div>
      </div>
    </div>
  );
}
