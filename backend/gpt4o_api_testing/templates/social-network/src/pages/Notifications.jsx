import React, { useState } from "react";
import notificationsData from "../mocks/notifications.json";

export default function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);

  const handleMarkRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
  };

  const getIcon = (type) => {
    switch (type) {
      case "like": return "❤️";
      case "comment": return "💬";
      case "follow": return "➕";
      case "system": return "⚙️";
      default: return "🔔";
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Notifications</h2>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleMarkRead(n.id)}
            className={`flex items-center gap-4 p-4 rounded-xl shadow-sm border dark:border-gray-700 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 ${
              n.read ? "bg-white dark:bg-gray-900" : "bg-blue-50 dark:bg-gray-800"
            }`}
          >
            {/* Avatar */}
            {n.avatar ? (
              <img
                src={n.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl">
                ⚙️
              </div>
            )}

            {/* Message Section */}
            <div className="flex-1">
              <p className="text-gray-800 dark:text-gray-200 text-sm">
                <span className="font-semibold">{n.user}</span> {n.message.replace(n.user, "")}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{n.time}</span>
                <span className="text-lg">{getIcon(n.type)}</span>
              </div>
            </div>

            {/* Unread Badge */}
            {!n.read && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
