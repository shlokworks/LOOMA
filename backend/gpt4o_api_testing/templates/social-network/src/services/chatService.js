import messages from "../mocks/messages.json";
import users from "../mocks/users.json";

export const getMessagesBetween = (user1, user2) => {
  return messages
    .filter(
      (msg) =>
        (msg.from === user1 && msg.to === user2) ||
        (msg.from === user2 && msg.to === user1)
    )
    .map((msg) => ({
      ...msg,
      seen: msg.to === user1 ? true : msg.seen
    }));
};

export const sendMessage = (from, to, messageText, currentMessages) => {
  const newMsg = {
    id: currentMessages.length + 1,
    from,
    to,
    message: messageText,
    timestamp: new Date().toISOString(),
    seen: false
  };

  return newMsg;
};

export const getChatPartner = (id) => users.find((u) => u.id === id);
