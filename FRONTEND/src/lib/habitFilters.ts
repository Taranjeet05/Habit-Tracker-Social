import { getTodayDate, getTodayWeekday } from "./dateUtils";
import { Habit, HabitLog } from "../types/Habit";

// isHabitForToday()
export const isHabitForToday = (habit: Habit): boolean => {
  const today = getTodayDate();
  const weekday = getTodayWeekday(); // 0-6
  const dateNum = Number(today.slice(8, 10)); // 2025-11-21T06:15:32.000Z return(21)

  switch (habit.frequency) {
    case "daily":
      return true;
    case "weekly":
      return habit.customFrequency?.daysOfWeek.includes(weekday) ?? false;
    case "monthly":
      return habit.customFrequency?.daysOfMonth.includes(dateNum) ?? false;
    case "custom": {
      const matchWeek =
        habit.customFrequency?.daysOfWeek.includes(weekday) ?? false;
      const matchMonth =
        habit.customFrequency?.daysOfMonth.includes(dateNum) ?? false;

      return matchWeek || matchMonth;
    }

    default:
      return false;
  }
};

// isHabitCompletedToday()
export const isHabitCompletedToday = (
  habit: Habit,
  logs: HabitLog[]
): boolean => {
  const today = getTodayDate(); // YYYY-MM-DD

  const log = logs.find((l) => {
    const logDate = new Date(l.date).toISOString().slice(0, 10);

    return (
      String(l.habit) === String(habit._id) &&
      logDate === today &&
      l.completed === true
    );
  });

  return Boolean(log);
};

// getTodayHabits()
export const getTodayHabits = (habits: Habit[], logs: HabitLog[]): Habit[] => {
  return habits.filter(
    (habit) => isHabitForToday(habit) && !isHabitCompletedToday(habit, logs)
  );
};
