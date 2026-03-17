import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import CourseFilter from "../components/CourseFilter";
import useLMSStore from "../store/useLMSStore";

const Courses = () => {
  const { loadCourses, filteredCourses, applyFilter, categories } = useLMSStore();
  const [filter, setFilter] = useState({ q: "", category: "" });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilter(filter);
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Browse <span className="text-brand-purple">All Courses</span>
      </h1>

      <CourseFilter filter={filter} setFilter={setFilter} categories={categories} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {filteredCourses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>

    </div>
  );
};

export default Courses;
