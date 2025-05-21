import { Request, Response } from "express";
import debug from "debug";
import HabitLog from "../models/HabitLog.js";
import Habit from "../models/Habit.js";
import { createHabitLogSchema } from "../validations/habitLogs.schema.js";
const log = debug("app:habitLogsController");

export const createHabitLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Zod Validation
    const parsed = createHabitLogSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(409).json({
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const data = parsed.data;

    // check if user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need To Login First",
      });
      return;
    }
    // parsed date to ISO string
    const parsedDate = new Date(data.date);
    parsedDate.setUTCHours(0, 0, 0, 0); // set time to midnight
    const isoDate = parsedDate.toISOString();

    // check if habit exist or not
    const habitId = data.habitId;
    const habit = await Habit.findById(habitId);
    if (!habit) {
      res.status(404).json({
        message: "Habit Not Found",
      });
      return;
    }
    // checking the frequency and times of the habit
    const frequency = habit.frequency; // "daily", "weekly", "monthly", "custom"
    const times = habit.customFrequency?.times || [];

    // function to check if the date is valid according to the habit frequency and how many times it is logged

    const isValidDate = (
      date: Date,
      frequency: String,
      times: number[]
    ): boolean => {
      const dayOfWeek = date.getUTCDay();
      const dayOfMonth = date.getUTCDate();

      switch (frequency) {
        case "daily":
          return true;
        case "weekly":
          return times.includes(dayOfWeek);
        case "monthly":
          return times.includes(dayOfMonth);
        case "custom":
          // You can adjust this logic as needed for custom
          return times.includes(dayOfWeek) || times.includes(dayOfMonth);
        default:
          return false;
      }
    };

    // check if the date is not valid based on the frequency and times
    if (!isValidDate(parsedDate, frequency, times)) {
      res.status(400).json({
        message: "Invalid Date Based on Habit Frequency",
      });
      return;
    }

    // determine how many times per day the habit can be logged
    const timesPerDay = habit.customFrequency?.times || 1;

    // count how many logs exist for this user, habit, and date
    const existingLogsCount = await HabitLog.countDocuments({
      user: userId,
      habit: habitId,
      date: isoDate,
    });

    if (existingLogsCount >= timesPerDay) {
      res.status(400).json({
        message:
          "You have already logged this habit the maximum number of times for today",
      });
      return;
    }

    // if allowed, create a new habit log
    const newHabitLog = await HabitLog.create({
      user: userId,
      habit: habitId,
      date: isoDate,
      completed: data.completed ?? true,
      notes: data.notes ?? "",
    });

    // response to the client with the success message about the new habit log
    res.status(201).json({
      message: "Habit Log Created Successfully",
      habitLog: newHabitLog,
    });
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error Creating a New Habit Log", errorMessage);
    res.status(500).json({
      message: "Failed to Create Habit Log",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
