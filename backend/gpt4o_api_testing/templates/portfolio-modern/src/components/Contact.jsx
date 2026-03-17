import React from "react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-gray-50">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Contact</h2>

        <p className="text-gray-600 mb-10">
          Let’s work together! Send me a message below.
        </p>

        <form className="grid gap-4">
          <input className="p-3 border rounded-lg" placeholder="Your Name" />
          <input className="p-3 border rounded-lg" placeholder="Your Email" />
          <textarea className="p-3 border rounded-lg" rows="4" placeholder="Message"></textarea>

          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
