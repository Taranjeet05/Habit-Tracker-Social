/** Habit Types */
export type Habit = {
  _id: string;
  title: string;
  description?: string;
  color: "Green" | "Blue" | "Purple" | "Teal" | "Orange" | "Red" | "Yellow";
  user: string;

  frequency: "daily" | "weekly" | "monthly" | "custom";

  customFrequency?: {
    daysOfWeek: number[]; // [0–6]
    daysOfMonth: number[]; // [1–31]
    times: number; // required times per day
  };

  reminders: {
    enabled: boolean;
    timesPerDay: number;
    times?: string[]; // "HH:MM"
  };

  startDate: string;
  archived: boolean;
  visibility: "private" | "friends" | "public";

  createdAt: string;
  updatedAt: string;
};
/** HabitLogs Type */
export type HabitLog = {
  _id: string;
  habit: string;
  user: string;
  date: string; // ISO date
  completed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
