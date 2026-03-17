import React, { useEffect } from "react";
import useLMSStore from "../store/useLMSStore";
import CourseCard from "../components/CourseCard";

const Dashboard = () => {
  const { currentUser, loadCourses, courses } = useLMSStore();

  useEffect(() => {
    loadCourses();
  }, []);

  if (!currentUser)
    return (
      <div className="text-gray-500 text-center py-10">
        Login to see your dashboard
      </div>
    );

  // Instructor dashboard
  if (currentUser.role === "instructor") {
    const mine = courses.filter((c) => c.instructorId === currentUser.id);

    return (
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Instructor <span className="text-brand-purple">Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {mine.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>

      </div>
    );
  }

  // Student dashboard
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-extrabold text-gray-900">
        Welcome back, <span className="text-brand-purple">{currentUser.name}</span>
      </h1>

      <p className="text-gray-600 mt-2">
        Here’s your learning progress and enrolled courses.
      </p>

    </div>
  );
};

export default Dashboard;
