import React from "react";

const LessonPlayer = ({ lesson }) => {
  if (!lesson)
    return (
      <div className="text-gray-500 p-6 text-center">
        Loading lesson...
      </div>
    );

  return (
    <div className="card p-6 rounded-xl">

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {lesson.title}
      </h2>

      {/* Video */}
      <div className="overflow-hidden rounded-lg mb-4">
        <video
          controls
          className="w-full rounded-lg bg-black"
        >
          <source src={lesson.videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed">
        {lesson.content}
      </p>
    </div>
  );
};

export default LessonPlayer;
