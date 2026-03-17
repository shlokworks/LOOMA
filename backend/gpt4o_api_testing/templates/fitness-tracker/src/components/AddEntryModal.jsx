import React, { useState } from "react";

export default function AddEntryModal({ open, onClose, onSubmit, type }) {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    calories: "",
    duration: "",
    protein: "",
    carbs: "",
    fat: "",
    date: new Date().toISOString().slice(0, 10)
  });

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      calories: Number(form.calories),
      date: form.date
    };

    if (type === "workout") {
      payload.duration = Number(form.duration);
      payload.category = "Custom";
    }

    if (type === "meal") {
      payload.protein = Number(form.protein);
      payload.carbs = Number(form.carbs);
      payload.fat = Number(form.fat);
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Add {type === "workout" ? "Workout" : "Meal"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            className="w-full p-2 border rounded"
            placeholder="Name"
            onChange={change}
          />

          <input
            name="calories"
            className="w-full p-2 border rounded"
            placeholder="Calories"
            onChange={change}
          />

          {/* Workout fields */}
          {type === "workout" && (
            <input
              name="duration"
              className="w-full p-2 border rounded"
              placeholder="Duration (mins)"
              onChange={change}
            />
          )}

          {/* Meal fields */}
          {type === "meal" && (
            <>
              <input
                name="protein"
                className="w-full p-2 border rounded"
                placeholder="Protein (g)"
                onChange={change}
              />
              <input
                name="carbs"
                className="w-full p-2 border rounded"
                placeholder="Carbs (g)"
                onChange={change}
              />
              <input
                name="fat"
                className="w-full p-2 border rounded"
                placeholder="Fat (g)"
                onChange={change}
              />
            </>
          )}

          <input
            name="date"
            type="date"
            className="w-full p-2 border rounded"
            defaultValue={form.date}
            onChange={change}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
