import React, { useState } from "react";
import { useTrackerStore } from "../store/useTrackerStore";
import ExerciseCard from "../components/ExerciseCard";
import AddEntryModal from "../components/AddEntryModal";

export default function Workouts() {
  const workouts = useTrackerStore((s) => s.workouts);
  const addWorkout = useTrackerStore((s) => s.addWorkout);
  const deleteWorkout = useTrackerStore((s) => s.deleteWorkout);

  const [open, setOpen] = useState(false);

  const handleAdd = (data) => {
    addWorkout(data);
    setOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Workouts</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Workout
        </button>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        {workouts.map((w) => (
          <ExerciseCard key={w.id} workout={w} onDelete={() => deleteWorkout(w.id)} />
        ))}
      </div>

      <AddEntryModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAdd}
        type="workout"
      />
    </div>
  );
}
