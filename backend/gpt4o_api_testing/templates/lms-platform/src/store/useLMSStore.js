import { create } from "zustand";
import courseService from "../services/courseService";
import lessonService from "../services/lessonService";
import quizService from "../services/quizService";
import userService from "../services/userService";
import progressService from "../services/progressService";

const useLMSStore = create((set, get) => ({
  courses: [],
  lessons: [],
  quizzes: [],
  users: [],
  filteredCourses: [],
  categories: [],

  currentUser: null,
  progress: {},

  /* loaders */
  loadCourses: () => {
    const courses = courseService.getAll();
    const categories = [...new Set(courses.map(c => c.category))];
    set({ courses, filteredCourses: courses, categories });
  },

  loadLessons: () => {
    set({ lessons: lessonService.getAll() });
  },

  loadQuizzes: () => {
    set({ quizzes: quizService.getAll() });
  },

  loadUsers: () => {
    const users = userService.getAll();
    set({ users, currentUser: userService.getStudent() });
  },

  /* filters */
  applyFilter: (filter) => {
    const courses = get().courses;
    let result = [...courses];
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q));
    }
    if (filter.category) {
      result = result.filter(c => c.category === filter.category);
    }
    set({ filteredCourses: result });
  },

  /* progress */
  loadProgress: () => {
    const p = progressService.load();
    set({ progress: p });
  },

  markLessonComplete: (courseId, lessonId) => {
    let p = get().progress;
    p = progressService.markLessonComplete(p, courseId, lessonId);
    progressService.save(p);
    set({ progress: p });
  },

  recordQuizResult: (courseId, quizId, score) => {
    let p = get().progress;
    p = progressService.recordQuiz(p, courseId, quizId, score);
    progressService.save(p);
    set({ progress: p });
  },

  getProgressForCourse: (courseId) => {
    const p = get().progress;
    if (!p[courseId]) return 0;
    const course = get().courses.find(c => c.id === courseId);
    if (!course) return 0;
    const totalLessons = course.lessonIds.length || 1;
    const done = p[courseId].lessons?.length || 0;
    return Math.round((done / totalLessons) * 100);
  }
}));

export default useLMSStore;
