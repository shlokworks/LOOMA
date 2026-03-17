import quizzes from "../mock/quizzes.json";

const quizService = {
  getAll: () => quizzes,
  getById: (id) => quizzes.find(q => q.id === id),
  getByCourse: (courseId) => quizzes.filter(q => q.courseId === courseId)
};

export default quizService;
