import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="card card-hover p-5">
      
      {/* Thumbnail */}
      <img
        src={course.thumbnail}
        alt={course.title}
        className="rounded-lg w-full h-44 object-cover"
      />

      {/* Title */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {course.title}
      </h3>

      {/* Summary */}
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        {course.summary}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">{course.level}</span>

        <Link
          to={`/course/${course.id}`}
          className="text-brand-purple font-medium text-sm hover:text-brand-pink transition"
        >
          View →
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
