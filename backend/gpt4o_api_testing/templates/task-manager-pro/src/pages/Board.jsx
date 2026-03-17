import React, { useState, useCallback } from "react";
import Column from "../components/Column.jsx";
import { v4 as uuidv4 } from "uuid";

/*
  Minimal in-memory Kanban board.
  - columns: Todo, In Progress, Done
  - add tasks to columns
  - this is intentionally simple so it loads fast in Looma preview.
*/

const initial = {
  todo: [
    { id: uuidv4(), title: "Design landing hero", desc: "Create hero section", tag: "ui", assignee: "A", estimate: 3 },
    { id: uuidv4(), title: "Add auth", desc: "Basic email sign up", tag: "backend", assignee: "B", estimate: 5 }
  ],
  inprogress: [
    { id: uuidv4(), title: "Implement drag-drop", desc: "Make columns reorderable", tag: "ux", assignee: "C", estimate: 4 }
  ],
  done: [
    { id: uuidv4(), title: "Project setup", desc: "Vite + Tailwind", tag: "infra", assignee: "A", estimate: 1 }
  ]
};

export default function Board() {
  const [columns, setColumns] = useState(initial);

  const addTask = useCallback((col) => {
    const title = prompt("Task title");
    if (!title) return;
    const newTask = { id: uuidv4(), title, desc: "", tag: "task", assignee: "", estimate: 1 };
    setColumns((prev) => ({ ...prev, [col]: [newTask, ...prev[col]] }));
  }, []);

  // lightweight move function (just moves top task from one to another for demo)
  const moveTop = (from, to) => {
    setColumns((prev) => {
      const fromList = [...prev[from]];
      if (!fromList.length) return prev;
      const task = fromList.shift();
      const toList = [task, ...prev[to]];
      return { ...prev, [from]: fromList, [to]: toList };
    });
  };

  return (
    <div>
      <div className="mb-4 flex gap-3 items-center">
        <div className="text-sm text-gray-600">Demo controls:</div>
        <button onClick={() => moveTop("todo","inprogress")} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Move top → InProgress</button>
        <button onClick={() => moveTop("inprogress","done")} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Move top → Done</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <Column title="To Do" tasks={columns.todo} onAddTask={() => addTask("todo")} />
        <Column title="In Progress" tasks={columns.inprogress} onAddTask={() => addTask("inprogress")} />
        <Column title="Done" tasks={columns.done} onAddTask={() => addTask("done")} />
      </div>
    </div>
  );
}
