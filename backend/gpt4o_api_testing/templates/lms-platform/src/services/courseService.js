import courses from "../mock/courses.json";

const courseService = {
  getAll: () => courses,
  getById: (id) => courses.find(c => c.id === id),
  search: (q) => {
    const qq = q.toLowerCase();
    return courses.filter(c => c.title.toLowerCase().includes(qq) || c.summary.toLowerCase().includes(qq));
  }
};

export default courseService;
