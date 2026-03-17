import eventsData from "../mock/events.json";

let events = [...eventsData];

export const eventService = {
  getAll: () => events,

  getById: (id) => {
    return events.find((ev) => String(ev.id) === String(id));
  },

  create: (data) => {
    const newEvent = {
      id: events.length + 1,
      date: "To Be Announced",
      time: "TBA",
      ...data
    };

    events.unshift(newEvent);
    return newEvent;
  },

  update: (id, updatedData) => {
    events = events.map((ev) =>
      ev.id == id ? { ...ev, ...updatedData } : ev
    );
  }
};
