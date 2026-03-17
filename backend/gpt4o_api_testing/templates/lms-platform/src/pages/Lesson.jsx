import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import lessonService from "../services/lessonService";
import LessonPlayer from "../components/LessonPlayer";
import useLMSStore from "../store/useLMSStore";

const Lesson = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const { markLessonComplete } = useLMSStore();

  useEffect(() => {
    const l = lessonService.getById(id);
    setLesson(l);
  }, [id]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <LessonPlayer lesson={lesson} />
      <div className="mt-4">
        <button onClick={() => markLessonComplete(lesson.courseId, lesson.id)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Mark Complete
        </button>
      </div>
    </div>
  );
};

export default Lesson;
