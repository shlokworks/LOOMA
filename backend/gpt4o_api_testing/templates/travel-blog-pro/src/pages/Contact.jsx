import React from "react";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-6">Contact Us</h1>

      <p className="text-gray-600 mb-8">
        Have a question, collaboration idea, or story to share?
      </p>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          rows="6"
          placeholder="Your Message"
          className="w-full p-3 border rounded-lg"
        ></textarea>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}
