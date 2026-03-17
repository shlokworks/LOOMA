import React, { useEffect } from "react";
import CourseCard from "../components/CourseCard";
import useLMSStore from "../store/useLMSStore";

const Home = () => {
  const { courses, loadCourses } = useLMSStore();

  useEffect(() => {
    loadCourses();
  }, []);

  const featured = courses.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Upgrade Your Skills with{" "}
          <span className="text-brand-purple">Expert-Led Courses</span>
        </h1>

        <p className="mt-3 text-gray-600 text-lg max-w-2xl">
          Learn at your own pace with clean, modern lessons designed to help you grow faster.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="px-5 py-3 bg-brand-purple text-white rounded-lg font-semibold hover:bg-brand-pink transition">
            Browse Courses
          </button>
          <button className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-brand-purple hover:text-brand-purple transition">
            View Dashboard
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featured.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>

    </div>
  );
};

export default Home;
