import React from "react";

export default function NewsletterBanner() {
  return (
    <section className="mt-16 mb-20 bg-white p-10 rounded-2xl shadow">
      <h2 className="text-3xl font-bold mb-3">Join Our Newsletter</h2>
      <p className="text-gray-600 mb-6">
        Stay updated with new tutorials, deep dives, and engineering stories.
      </p>

      <div className="flex gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-lg border w-full"
        />
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Subscribe
        </button>
      </div>
    </section>
  );
}
