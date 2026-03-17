import { create } from "zustand";
import { getMessagesBetween, sendMessage } from "../services/chatService";
import { socket } from "../services/socket";

export const useChatStore = create((set, get) => ({
  activeChatUser: null,
  messages: [],
  typing: false,

  setActiveChatUser: (user) => {
    set({ activeChatUser: user });

    if (user) {
      const loadedMessages = getMessagesBetween(1, user.id);
      set({ messages: loadedMessages });

      // Listen for typing from user
      socket.on("typing", (data) => {
        if (data.from === user.id) {
          set({ typing: true });
          setTimeout(() => set({ typing: false }), 800);
        }
      });

      // Listen for incoming messages
      socket.on("receive-message", (msg) => {
        if (msg.from === user.id) {
          set((state) => ({ messages: [...state.messages, msg] }));
        }
      });
    }
  },

  sendMessageToActiveUser: (text) => {
    const user = get().activeChatUser;
    const currentMessages = get().messages;

    if (!user) return;

    const newMsg = sendMessage(1, user.id, text, currentMessages);

    // Add message instantly
    set({ messages: [...currentMessages, newMsg] });

    // Emit to socket mock
    socket.emit("send-message", newMsg);
  },
}));
