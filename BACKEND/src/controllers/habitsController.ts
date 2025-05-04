import { Request, Response } from "express";
import debug from "debug";
import Habit from "../models/Habit.js";
import { createHabitsSchema } from "../validations/habits.schema.js";
const log = debug("app:habitsController");

export const createHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Zod Validation
    const parsed = createHabitsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(409).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const data = parsed.data;
    // Check if User Exist or Not..
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        message: "You need to login first",
      });
      return;
    }

    const newHabit = Habit.create({
      ...data,
      user: userId,
      reminders: parsed.data.reminders
        ? {
            enabled: true,
            times: parsed.data.reminders.times,
            timePerDay: parsed.data.reminders.timesPerDay,
          }
        : { enabled: false },
    });
    res.status(201).json({
      success: true,
      message: "Habit created successfully ✅",
      data: newHabit,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error Creating a New Habit", errorMessage);
    res.status(500).json({
      message: "Failed to Create Habit",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
