import React from "react";

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-6">Contact Us</h1>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          rows="5"
          placeholder="Message"
          className="w-full border p-3 rounded-lg"
        ></textarea>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}
