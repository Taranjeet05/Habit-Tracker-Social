import { getTodayDate, getTodayWeekday } from "./dateUtils";

type HabitSchedule = {
  type: "daily" | "weekly" | "specific";
  days?: number[];
  date?: string;
};

type HabitFrequency = {
  timesPerDay: number; // frequency
};

type HabitLog = {
  date: string;
  count: number; // To check How many time the Habit has been completed;
};

type Habit = {
  id: string;
  title: string;
  schedule: HabitSchedule;
  frequency: HabitFrequency;
  logs: HabitLog[];
};

export const isHabitForToday = (habit: Habit): boolean => {
  try {
    const todayDate = getTodayDate();
    const todayWeekDay = getTodayWeekday();

    switch (habit.schedule.type) {
      case "daily":
        return true;

      case "weekly":
        return habit.schedule.days?.includes(todayWeekDay) ?? false;

      case "specific":
        return habit.schedule.date === todayDate;

      default:
        return false;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error getting is Habit For Today", error.message);
    }
    return false;
  }
};

export const isHabitCompletedToday = (habit: Habit) => {
  const today = getTodayDate();
  const log = habit.logs.find((l) => l.date === today);

  const completed = log?.count ?? 0;
  const required = habit.frequency.timesPerDay;

  return completed >= required;
};

export const getTodayHabit = (habit: Habit[]): Habit[] => {
  return habit.filter(
    (habit) => isHabitForToday(habit) && !isHabitCompletedToday(habit)
  );
};
