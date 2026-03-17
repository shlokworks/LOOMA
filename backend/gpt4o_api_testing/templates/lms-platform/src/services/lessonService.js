import lessons from "../mock/lessons.json";

const lessonService = {
  getAll: () => lessons,
  getById: (id) => lessons.find(l => l.id === id),
  getByCourse: (courseId) => lessons.filter(l => l.courseId === courseId)
};

export default lessonService;
