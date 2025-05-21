import { z } from "zod";

export const createHabitLogSchema = z.object({
  habitId: z.string().nonempty("Habit ID is required"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid Date Format",
  }),
  completed: z.boolean().optional(),
  notes: z.string().optional(),
});
