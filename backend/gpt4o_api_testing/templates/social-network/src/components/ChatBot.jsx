import React, { useEffect, useState } from "react";
import { socket } from "../socket";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 0, from: "bot", text: "Hello! I'm Looma ChatBot 🤖" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for bot replies from backend/socket
    socket.on("bot_reply", (msg) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: msg }
      ]);
    });

    return () => {
      socket.off("bot_reply");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: input }
    ]);

    // Send to server
    socket.emit("bot_message", input);

    setInput("");
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Looma ChatBot 🤖
      </h2>

      <div className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm ${
                msg.from === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 dark:text-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-xl border dark:border-gray-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
