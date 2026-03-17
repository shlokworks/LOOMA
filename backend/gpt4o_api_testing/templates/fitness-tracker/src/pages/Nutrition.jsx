import React, { useState } from "react";
import { useTrackerStore } from "../store/useTrackerStore";
import MealCard from "../components/MealCard";
import AddEntryModal from "../components/AddEntryModal";
import { getDailyMacros, today } from "../services/mealService";

export default function Nutrition() {
  const meals = useTrackerStore((s) => s.meals);
  const addMeal = useTrackerStore((s) => s.addMeal);
  const deleteMeal = useTrackerStore((s) => s.deleteMeal);

  const [open, setOpen] = useState(false);

  const macros = getDailyMacros(today(), meals);

  const handleAdd = (data) => {
    addMeal(data);
    setOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Nutrition</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Meal
        </button>
      </div>

      {/* Macro Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold">Calories</h3>
          <p className="text-2xl font-bold">{macros.calories}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold">Protein</h3>
          <p className="text-2xl font-bold">{macros.protein} g</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold">Carbs</h3>
          <p className="text-2xl font-bold">{macros.carbs} g</p>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {meals.map((m) => (
          <MealCard key={m.id} meal={m} onDelete={() => deleteMeal(m.id)} />
        ))}
      </div>

      <AddEntryModal
        type="meal"
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}
