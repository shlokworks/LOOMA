// very small in-memory or localStorage-backed progress helper
const KEY = "lms_progress_v1";

const progressService = {
  load: () => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  },
  save: (data) => {
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  markLessonComplete: (progress, courseId, lessonId) => {
    if (!progress[courseId]) progress[courseId] = { lessons: [], quizzes: {} };
    if (!progress[courseId].lessons.includes(lessonId)) {
      progress[courseId].lessons.push(lessonId);
    }
    return progress;
  },
  recordQuiz: (progress, courseId, quizId, score) => {
    if (!progress[courseId]) progress[courseId] = { lessons: [], quizzes: {} };
    progress[courseId].quizzes[quizId] = score;
    return progress;
  }
};

export default progressService;
