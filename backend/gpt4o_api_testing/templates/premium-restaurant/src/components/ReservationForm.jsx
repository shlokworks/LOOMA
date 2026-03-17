import React, { useState } from "react";
import { useReservationStore } from "../store/useReservationStore";

export default function ReservationForm() {
  const addReservation = useReservationStore((s) => s.addReservation);

  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    people: 1,
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();

    addReservation(form);

    setForm({
      name: "",
      date: "",
      time: "",
      people: 1,
      phone: "",
    });
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-8 rounded-2xl shadow-xl border max-w-lg mx-auto mt-10 space-y-5"
    >
      <h2 className="text-3xl font-bold mb-4 text-center">
        Reserve a Table
      </h2>

      <input
        name="name"
        value={form.name}
        required
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <div className="flex gap-4">
        <input
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
          className="flex-1 p-3 bg-gray-100 rounded-lg"
        />

        <input
          name="time"
          type="time"
          required
          value={form.time}
          onChange={handleChange}
          className="flex-1 p-3 bg-gray-100 rounded-lg"
        />
      </div>

      <input
        name="people"
        type="number"
        min={1}
        required
        value={form.people}
        onChange={handleChange}
        placeholder="Number of Guests"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <input
        name="phone"
        required
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <button className="mt-2 w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition">
        Reserve Now
      </button>
    </form>
  );
}
