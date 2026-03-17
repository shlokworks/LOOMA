import React from "react";
import TaskCard from "./TaskCard.jsx";

export default function Column({ title, tasks, onAddTask }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col min-w-[260px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <button 
          onClick={onAddTask}
          className="text-xs px-2 py-1 bg-green-500 text-white rounded"
        >
          + Add
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-auto">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
