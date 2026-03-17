import meals from "../mock/meals.json";

/**
 * Filter meals by date
 */
export const getMealsByDate = (date, allMeals) => {
  return allMeals.filter((m) => m.date === date);
};

/**
 * Totals macros for a day
 */
export const getDailyMacros = (date, allMeals) => {
  const list = getMealsByDate(date, allMeals);

  return {
    calories: list.reduce((s, m) => s + m.calories, 0),
    protein: list.reduce((s, m) => s + m.protein, 0),
    carbs: list.reduce((s, m) => s + m.carbs, 0),
    fat: list.reduce((s, m) => s + m.fat, 0)
  };
};

/**
 * Returns list of unique meal names (helpful for suggestions)
 */
export const getMealNames = () => {
  const names = new Set(meals.map((m) => m.name));
  return [...names];
};
