import { z } from "zod";

// Helper for time validation
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createHabitsSchema = z
  .object({
    title: z
      .string()
      .min(3, "Habit title must be at least 3 characters")
      .max(50, "Title too long (max 50 characters)")
      .trim(),
    description: z
      .string()
      .max(200, "Description too long (max 200 characters)")
      .trim()
      .optional(),
    color: z
      .enum(["Green", "Blue", "Purple", "Teal", "Orange", "Red", "Yellow"])
      .default("Green"),
    frequency: z
      .enum(["daily", "weekly", "monthly", "custom"])
      .default("daily"),
    customFrequency: z
      .object({
        daysOfWeek: z
          .array(z.number().min(0).max(6))
          .max(7, "Too many days selected")
          .optional(),
        daysOfMonth: z
          .array(z.number().min(1).max(31))
          .max(31, "Too many days in month selected")
          .optional(),
        times: z
          .number()
          .int()
          .min(1, "Minimum 1 time per period")
          .max(100, "Maximum 100 times per period"),
      })
      .optional(),
    reminders: z
      .object({
        timesPerDay: z
          .number()
          .int()
          .min(1, "Minimum 1 reminder")
          .max(10, "Maximum 10 reminders per day")
          .default(1),
        times: z
          .array(z.string().regex(timeRegex, "Invalid time format (HH:MM)"))
          .max(10, "Maximum 10 reminders per day")
          .optional(),
        enabled: z.boolean().default(false),
      })
      .default({}),
    startDate: z.coerce
      .date()
      .min(new Date(), "Start date cannot be in the past")
      .default(new Date()),
    visibility: z.enum(["private", "friends", "public"]).default("private"),
  })
  .superRefine((data, ctx) => {
    // Custom frequency validation
    if (data.frequency === "custom") {
      const custom = data.customFrequency;

      if (!custom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Custom frequency is required",
          path: ["customFrequency"],
        });
      } else {
        if (
          (!custom.daysOfWeek || custom.daysOfWeek.length === 0) &&
          (!custom.daysOfMonth || custom.daysOfMonth.length === 0)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select at least one day (week or month)",
            path: ["customFrequency"],
          });
        }
      }
    }

    // Reminder validation
    if (data.reminders.enabled) {
      if (!data.reminders.times || data.reminders.times.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Set at least 1 reminder time",
          path: ["reminders.times"],
        });
      }

      if (data.reminders.timesPerDay > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum 10 reminders per day",
          path: ["reminders.timesPerDay"],
        });
      }
    }
  });
