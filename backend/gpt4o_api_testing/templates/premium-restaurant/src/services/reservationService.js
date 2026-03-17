import reservations from "../mock/reservations.json";

// Sort reservations by date/time
export const getAllReservations = () => {
  return reservations.sort(
    (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
  );
};

// Check if reservation already exists at same time
export const hasConflict = (data) => {
  return reservations.some(
    (r) => r.date === data.date && r.time === data.time
  );
};

export const createReservation = (data) => {
  if (hasConflict(data)) {
    return {
      success: false,
      message: "A reservation already exists at this time.",
    };
  }

  const newReservation = {
    id: reservations.length + 1,
    ...data,
  };

  reservations.push(newReservation);

  return {
    success: true,
    message: "Reservation created successfully!",
    reservation: newReservation,
  };
};
