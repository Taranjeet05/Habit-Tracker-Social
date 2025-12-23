import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const habitFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  color: z.enum(["Green", "Blue", "Purple", "Teal", "Orange", "Red", "Yellow"]),
  frequency: z.enum(["daily", "monthly", "weekly", "custom"]),

  customFrequency: z
    .object({
      dayOfWeek: z.array(z.number()).optional(),
      dayOfMonth: z.array(z.number()).optional(),
    })
    .optional(),

  reminders: z.object({
    enabled: z.boolean(),
    timesPerDay: z.number().min(1).max(10),
    times: z.array(z.string().regex(timeRegex)).optional(),
  }),

  visibility: z.enum(["private", "public", "friends"]).default("private"),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;
