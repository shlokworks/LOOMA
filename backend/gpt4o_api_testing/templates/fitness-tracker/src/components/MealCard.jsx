import React from "react";

export default function MealCard({ meal, onDelete }) {
  return (
    <div className="p-4 bg-white shadow rounded-xl border flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">{meal.name}</h3>
        <p className="text-gray-600">
          {meal.calories} calories • Protein: {meal.protein}g • Carbs: {meal.carbs}g • Fat: {meal.fat}g
        </p>
      </div>

      <button
        onClick={onDelete}
        className="px-3 py-1 bg-red-600 text-white rounded-lg"
      >
        Delete
      </button>
    </div>
  );
}
