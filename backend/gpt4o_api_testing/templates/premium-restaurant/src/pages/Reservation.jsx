import React from "react";
import ReservationForm from "../components/ReservationForm";
import { useReservationStore } from "../store/useReservationStore";

export default function Reservation() {
  const reservations = useReservationStore((s) => s.reservations);

  return (
    <div className="max-w-6xl mx-auto mt-24 p-6">
      
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-3">Reserve a Table</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enjoy a premium dining experience. Book your preferred date and time.
        </p>
      </div>

      {/* Reservation Form */}
      <ReservationForm />

      {/* Your Reservations */}
      <h3 className="text-3xl font-semibold mt-16 mb-6">Your Reservations</h3>

      {reservations.length === 0 ? (
        <p className="text-lg text-gray-500">No reservations yet.</p>
      ) : (
        <div className="space-y-5">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="p-6 rounded-2xl bg-white shadow-lg border"
            >
              <p><strong>Name:</strong> {res.name}</p>
              <p><strong>Date:</strong> {res.date}</p>
              <p><strong>Time:</strong> {res.time}</p>
              <p><strong>Number of Guests:</strong> {res.people}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
