import React from "react";

export default function MessageBubble({ message, isMine }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex w-full my-1 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative group max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm transition-all
          ${isMine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800 rounded-bl-none"}
        `}
      >
        {/* Message text */}
        <p>{message.message}</p>

        {/* Timestamp + status */}
        <div
          className={`text-[10px] mt-1 ${isMine ? "text-blue-200" : "text-gray-400"}`}
        >
          {time}
          {isMine && (
            <span className="ml-1">
              {message.seen ? "✔✔" : "✔"}
            </span>
          )}
        </div>

        {/* Reactions (on hover) */}
        <div
          className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition
          flex gap-2 text-lg bg-white dark:bg-gray-800 px-2 py-1 rounded-xl shadow-md"
        >
          <button>❤️</button>
          <button>😂</button>
          <button>👍</button>
          <button>😮</button>
        </div>
      </div>
    </div>
  );
}
