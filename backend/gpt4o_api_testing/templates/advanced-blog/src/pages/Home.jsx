import React from "react";
import HeroSection from "../components/HeroSection.jsx";
import TagFilterBar from "../components/TagFilterBar.jsx";
import FeaturedPosts from "../components/FeaturedPosts.jsx";
import PopularPosts from "../components/PopularPosts.jsx";
import NewsletterBanner from "../components/NewsletterBanner.jsx";
import AuthorCard from "../components/AuthorCard.jsx";

const posts = [
  {
    id: 1,
    title: "How to Build a Modern CMS with React",
    excerpt:
      "Learn how to structure a scalable content management system with components, routing, and rich-text editing.",
  },
  {
    id: 2,
    title: "Optimizing React Apps for Performance",
    excerpt:
      "A deep dive into code splitting, lazy loading, memoization, and performance profiling.",
  },
  {
    id: 3,
    title: "Using Express.js as a Headless CMS",
    excerpt:
      "Build REST APIs to power your frontend using Express.js with MongoDB.",
  },
];

export default function Home() {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <HeroSection />

      <TagFilterBar />

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-3">

          <FeaturedPosts />

          <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>

          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
             <div
  key={post.id}
  className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition border border-gray-100"
>
  <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
    {post.title}
  </h2>

  <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>

  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
    Read More →
  </button>
</div>

            ))}
          </div>

          <NewsletterBanner />
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <PopularPosts />
        </aside>
      </div>
    </div>
  );
}
