import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

const items = [
  { title: "Premium Quality", desc: "Handpicked, quality-assured gear." },
  { title: "Free Shipping", desc: "Free delivery over $50." },
  { title: "Secure Payments", desc: "Top-grade payment security." },
  { title: "Easy Returns", desc: "Hassle-free 30 day returns." }
];

export default function WhyChooseUs() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Why choose PremiumStore?</h2>
        <p className="text-sm text-gray-500">Trust, quality, and speed — that's our promise.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl border card-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">✓</div>
              <div>
                <h4 className="font-semibold">{it.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
