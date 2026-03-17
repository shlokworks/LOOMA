import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import lessonService from "../services/lessonService";
import courseService from "../services/courseService";
import useLMSStore from "../store/useLMSStore";
import ProgressBar from "../components/ProgressBar";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { loadCourses, getProgressForCourse } = useLMSStore();

  useEffect(() => {
    loadCourses();
    const c = courseService.getById(id);
    setCourse(c);
  }, [id]);

  if (!course)
    return <div className="text-gray-500">Loading...</div>;

  const progress = getProgressForCourse(course.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Hero Image */}
      <div className="rounded-xl overflow-hidden shadow-md mb-8">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Title + Summary */}
      <h1 className="text-3xl font-extrabold text-gray-900">{course.title}</h1>
      <p className="text-gray-600 mt-2 text-lg">{course.summary}</p>

      {/* Progress */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-1">Your Progress</p>
        <ProgressBar value={progress} />
      </div>

      {/* Lessons Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Lessons</h3>

        <ul className="space-y-3">
          {course.lessonIds.map((lid) => (
            <li key={lid} className="card p-4">
              <Link
                to={`/lesson/${lid}`}
                className="text-brand-purple font-medium hover:text-brand-pink transition"
              >
                {lessonService.getById(lid)?.title || `Lesson ${lid}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Quizzes Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Quizzes</h3>

        <ul className="space-y-3">
          {course.quizIds.length === 0 && (
            <li className="text-gray-500">No quizzes available</li>
          )}

          {course.quizIds.map((qid) => (
            <li key={qid} className="card p-4">
              <Link
                to={`/quiz/${qid}`}
                className="text-brand-purple font-medium hover:text-brand-pink transition"
              >
                Quiz {qid}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default CourseDetails;
