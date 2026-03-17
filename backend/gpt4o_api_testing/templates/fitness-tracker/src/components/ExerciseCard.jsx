import React from "react";

export default function ExerciseCard({ workout, onDelete }) {
  return (
    <div className="p-4 bg-white shadow rounded-xl border flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">{workout.name}</h3>
        <p className="text-gray-600">
          {workout.category} • {workout.duration} mins
        </p>
        <p className="font-medium mt-1">{workout.calories} calories burned</p>
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
