export type HabitColor =
  | "green"
  | "blue"
  | "purple"
  | "teal"
  | "orange"
  | "red"
  | "yellow";

export type HabitFrequency = "daily" | "weekly" | "monthly" | "custom";

export interface HabitFormValues {
  title: string;
  description: string;
  color: HabitColor;
  frequency: HabitFrequency;
  customFrequency: {
    days: number[];
    times: number;
  };
  weeklyDay: number;
  monthlyDay: number;
  reminder: {
    enabled: boolean;
    times: string[];
  };
}
