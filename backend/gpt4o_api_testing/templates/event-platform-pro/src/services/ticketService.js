export const ticketService = {
  purchase: (eventId, userId) => {
    return {
      status: "success",
      message: "Ticket purchased successfully!",
      eventId,
      userId
    };
  }
};
