export const socket = {
  listeners: {},

  on(event, callback) {
    this.listeners[event] = callback;
    console.log(`⚡ Listening for ${event}`);
  },

  off(event) {
    delete this.listeners[event];
    console.log(`⛔ Stopped listening for ${event}`);
  },

  emit(event, data) {
    console.log(`📤 Socket event: ${event}`, data);

    // simulate echo for incoming messages
    if (event === "send-message") {
      setTimeout(() => {
        if (this.listeners["receive-message"]) {
          this.listeners["receive-message"]({
            ...data,
            from: data.to,
            to: data.from,
            message: "Got your message!",
            timestamp: new Date().toISOString(),
          });
        }
      }, 1200);
    }
  },

  simulateTyping(toUserId) {
    if (this.listeners["typing"]) {
      this.listeners["typing"]({ from: toUserId });
    }
  },

  disconnect() {
    this.listeners = {};
    console.log("🔌 Socket disconnected");
  }
};
