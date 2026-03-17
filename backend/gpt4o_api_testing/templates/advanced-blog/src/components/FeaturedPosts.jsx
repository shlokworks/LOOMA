import React from "react";

const featured = [
  {
    title: "Mastering React Server Components",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    title: "Database Indexing Like a Pro",
    img: "https://images.unsplash.com/photo-1551033406-611cf9a28f67",
  },
  {
    title: "Docker Deep Dive for Developers",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
];

export default function FeaturedPosts() {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold mb-5">Featured</h2>

      <div className="grid sm:grid-cols-3 gap-6">
        {featured.map((post, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden shadow hover:shadow-2xl transition cursor-pointer"
          >
            <img src={post.img} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{post.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
