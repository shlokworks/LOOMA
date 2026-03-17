import React from "react";

export default function TaskCard({ task }) {
  return (
    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{task.desc}</p>
        </div>
        <div className="text-xs text-gray-400">{task.estimate ? `${task.estimate}h` : ""}</div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">#{task.tag}</span>
        <span className="text-xs text-gray-400 ml-auto">{task.assignee || "—"}</span>
      </div>
    </div>
  );
}
