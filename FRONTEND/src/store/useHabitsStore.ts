import { create } from "zustand";
import { Habit } from "../api/habitsApi";

interface HabitsState {
  todayHabits: Habit[];
  dashboardHabits: Habit[];
  isTodayLoaded: boolean;
  isDashboardLoaded: boolean;

  setTodayHabits: (habits: Habit[]) => void;
  setDashboardHabits: (habits: Habit[]) => void;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  todayHabits: [],
  dashboardHabits: [],
  isTodayLoaded: false,
  isDashboardLoaded: false,

  setTodayHabits: (habits) =>
    set(() => ({ todayHabits: habits, isTodayLoaded: true })),
  setDashboardHabits: (habits) =>
    set(() => ({ dashboardHabits: habits, isDashboardLoaded: true })),
}));
