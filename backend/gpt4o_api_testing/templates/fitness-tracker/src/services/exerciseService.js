import exercises from "../mock/exercises.json";

/**
 * Get all exercise types available (Cardio, Strength, Flexibility)
 */
export const getExerciseCategories = () => {
  const categories = new Set();
  exercises.forEach((ex) => categories.add(ex.category));
  return [...categories];
};

/**
 * Filter exercises by date
 */
export const getExercisesByDate = (date, workouts) => {
  return workouts.filter((w) => w.date === date);
};

/**
 * Calculate total burned calories for a specific date
 */
export const getCaloriesBurnedOnDate = (date, workouts) => {
  return workouts
    .filter((w) => w.date === date)
    .reduce((sum, w) => sum + w.calories, 0);
};

/**
 * Get today's date (YYYY-MM-DD)
 */
export const today = () => new Date().toISOString().slice(0, 10);
