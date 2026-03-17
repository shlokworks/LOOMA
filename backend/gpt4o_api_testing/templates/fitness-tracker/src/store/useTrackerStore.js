import { create } from "zustand";

// Load from localStorage helper
const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

// Save to localStorage helper
const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useTrackerStore = create((set, get) => ({
  // =========================================
  // STATE
  // =========================================
  workouts: load("workouts", []),
  meals: load("meals", []),

  goals: load("goals", {
    dailyCalorieGoal: 2000,
    dailyBurnGoal: 500,
    monthlyWorkoutGoal: 20,
    currentProgress: {
      caloriesBurned: 0,
      workoutsCompleted: 0
    }
  }),

  // =========================================
  // WORKOUT METHODS
  // =========================================
  addWorkout: (workout) => {
    const updated = [...get().workouts, { ...workout, id: Date.now() }];
    save("workouts", updated);
    set({ workouts: updated });
  },

  deleteWorkout: (id) => {
    const updated = get().workouts.filter((w) => w.id !== id);
    save("workouts", updated);
    set({ workouts: updated });
  },

  getBurnedToday: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get()
      .workouts.filter((w) => w.date === today)
      .reduce((sum, w) => sum + w.calories, 0);
  },

  // =========================================
  // MEAL METHODS
  // =========================================
  addMeal: (meal) => {
    const updated = [...get().meals, { ...meal, id: Date.now() }];
    save("meals", updated);
    set({ meals: updated });
  },

  deleteMeal: (id) => {
    const updated = get().meals.filter((m) => m.id !== id);
    save("meals", updated);
    set({ meals: updated });
  },

  getCaloriesConsumedToday: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get()
      .meals.filter((m) => m.date === today)
      .reduce((sum, m) => sum + m.calories, 0);
  },

  // =========================================
  // GOAL METHODS
  // =========================================
  updateGoal: (field, value) => {
    const updatedGoals = {
      ...get().goals,
      [field]: value
    };

    save("goals", updatedGoals);
    set({ goals: updatedGoals });
  },

  updateProgress: () => {
    const { workouts, goals } = get();

    const caloriesBurned = workouts.reduce((s, w) => s + w.calories, 0);
    const workoutsCompleted = workouts.length;

    const updatedGoals = {
      ...goals,
      currentProgress: {
        caloriesBurned,
        workoutsCompleted
      }
    };

    save("goals", updatedGoals);
    set({ goals: updatedGoals });
  },

  // =========================================
  // STAT CALCULATIONS (Dashboard + Charts)
  // =========================================
  getWeeklyBurnStats: () => {
    const workouts = get().workouts;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const result = days.map((day) => ({
      day,
      value: 0
    }));

    workouts.forEach((w) => {
      const d = new Date(w.date);
      const dayIndex = d.getDay(); // 0=Sun → shift to end
      const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
      result[mapped].value += w.calories;
    });

    return result;
  },

  getWeeklyIntakeStats: () => {
    const meals = get().meals;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const result = days.map((day) => ({
      day,
      value: 0
    }));

    meals.forEach((m) => {
      const d = new Date(m.date);
      const dayIndex = d.getDay();
      const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
      result[mapped].value += m.calories;
    });

    return result;
  }
}));
