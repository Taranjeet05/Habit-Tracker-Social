import { format } from "date-fns";
import HabitLog from "../models/HabitLog.js";

//**
// * checking if habit is scheduled for today based on its frequency rules ::
//  */

export function isHabitForToday(habit: any) {
  const today = new Date();
  const todayName = format(today, "EEEE"); // Monday, Tuesday ...
  const todayDay = Number(format(today, "d")); // 1 - 31 day of the month
  const todayIndex = today.getDay(); // 0 - 6 (sun - sat)

  // Daily
  if (habit.frequency === "daily") {
    return true;
  }
  // Weekly - [0 - 6] = dayOfWeek
  if (habit.frequency === "weekly") {
    return habit.customFrequency?.daysOfWeek?.includes(todayIndex);
  }
  // Monthly - [1 - 31] = dayOfMonth
  if (habit.frequency === "monthly") {
    return habit.customFrequency?.daysOfMonth?.includes(todayDay);
  }
  // CUSTOM (Combination: weekly + monthly)
  if (habit.frequency === "custom") {
    const weeklyMatch = habit.customFrequency?.daysOfWeek?.includes(todayIndex);
    const monthlyMatch = habit.customFrequency?.daysOfMonth?.includes(todayDay);

    return weeklyMatch || monthlyMatch;
  }
  return false;
}

/**
 * count How many logs exist for today given habit. ::
 */

export async function getCompletedCountToday(habit: any, userId: string) {
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const end = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const logs = await HabitLog.find({
    habit: habit._id,
    user: userId,
    date: { $gte: start, $lt: end },
    completed: true,
  });

  return logs.length;
}

/***
 * check if the Habit reaches its completed goal for today. ::
 */

export async function isCompletedToday(habit: any, userId: string) {
  const completedCount = await getCompletedCountToday(habit, userId);

  const timeNeeded = habit.customFrequency?.times ?? 1;

  return completedCount >= timeNeeded;
}
