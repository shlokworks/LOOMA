/**
 * Calculate percentage progress
 */
export const getGoalProgress = (goals) => {
  const { monthlyWorkoutGoal, currentProgress } = goals;

  const workoutProgress = Math.min(
    (currentProgress.workoutsCompleted / monthlyWorkoutGoal) * 100,
    100
  );

  return {
    workoutsPercent: workoutProgress.toFixed(0),
    caloriesBurned: currentProgress.caloriesBurned
  };
};

/**
 * Reset goals to default
 */
export const resetGoals = () => ({
  dailyCalorieGoal: 2000,
  dailyBurnGoal: 500,
  monthlyWorkoutGoal: 20,
  currentProgress: {
    caloriesBurned: 0,
    workoutsCompleted: 0
  }
});
