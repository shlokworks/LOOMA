import React, { useState, useEffect } from "react";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    "Bot: Hello! I'm your assistant. How can I help you today?",
    "Bot: Try asking about features or typing anything!",
  ]);

  // Mock bot responses
  const getBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      return "Bot: Hello there! 👋";
    } else if (lowerMsg.includes("how are you")) {
      return "Bot: I'm doing great, thanks for asking! How about you?";
    } else if (lowerMsg.includes("feature") || lowerMsg.includes("what can you do")) {
      return "Bot: This is a demo chat! In a real app, you'd have real-time messaging with other users.";
    } else if (lowerMsg.includes("help")) {
      return "Bot: I'm here to help! This is a social network template with chat functionality.";
    } else if (lowerMsg.includes("weather")) {
      return "Bot: I'm not connected to weather services, but I hope it's sunny where you are! ☀️";
    } else if (lowerMsg.includes("thank")) {
      return "Bot: You're welcome! 😊";
    } else if (lowerMsg.includes("name")) {
      return "Bot: I'm Looma ChatBot, your virtual assistant!";
    } else {
      const responses = [
        "Bot: That's interesting! Tell me more.",
        "Bot: Thanks for sharing!",
        "Bot: I understand. What else would you like to talk about?",
        "Bot: Got it! How can I assist you further?",
        "Bot: Nice! 😄",
        "Bot: Cool! Anything else on your mind?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const sendMessage = () => {
    if (!msg.trim()) return;

    // Add user message
    const userMessage = `You: ${msg}`;
    setMessages((prev) => [...prev, userMessage]);
    
    // Get bot response after a short delay
    setTimeout(() => {
      const botResponse = getBotResponse(msg);
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
    
    setMsg("");
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Demo Chat 💬</h1>

      <div className="bg-white p-4 rounded-xl shadow h-80 overflow-y-auto mb-4 chat-messages">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`p-2 mb-2 rounded-lg ${m.startsWith('You:') ? 'bg-blue-50 text-blue-800 ml-8' : 'bg-gray-100 text-gray-800 mr-8'}`}
          >
            <div className="font-semibold text-xs mb-1">
              {m.startsWith('You:') ? 'You' : 'Bot'}
            </div>
            <div>{m.split(': ')[1]}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50"
          disabled={!msg.trim()}
        >
          Send
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>💡 This is a demo chat. In a production app, you'd connect to a real WebSocket server.</p>
      </div>
    </div>
  );
}