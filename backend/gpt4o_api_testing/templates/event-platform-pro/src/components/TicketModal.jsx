import React, { useState } from "react";

export default function TicketModal({ event }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Buy Ticket
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold">Buy Ticket</h2>
            <p className="text-gray-600 mt-2">{event.title}</p>

            <button
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg"
              onClick={() => setOpen(false)}
            >
              Confirm Purchase
            </button>

            <button
              className="w-full mt-3 py-3 bg-gray-200 text-gray-700 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
