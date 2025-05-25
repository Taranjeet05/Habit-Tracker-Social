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
    const { frequency, customFrequency } = habit; // "daily", "weekly", "monthly", "custom"
    // check if the habit has custom frequency settings.
    if (frequency === "custom" && !habit.customFrequency) {
      res.status(400).json({
        message: "Custom Frequency settings are missing for this habit",
      });
      return;
    }
    const daysOfWeek = customFrequency?.daysOfWeek || [];
    const daysOfMonth = customFrequency?.daysOfMonth || [];
    // determine how many times per day the habit can be logged
    const timesPerDay = customFrequency?.times || [];

    // function to check if the date is valid based on the frequency and times
    const isValidDate = (
      date: Date,
      frequency: String,
      daysOfWeek: number[],
      daysOfMonth: number[]
    ): boolean => {
      const dayOfWeek = date.getUTCDay(); // 0-6 (Sun-Sat)
      const dayOfMonth = date.getUTCDate(); // 1-31

      switch (frequency) {
        case "daily":
          return true;
        case "weekly":
          return daysOfWeek.includes(dayOfWeek);
        case "monthly":
          return daysOfMonth.includes(dayOfMonth);
        case "custom":
          return (
            daysOfWeek.includes(dayOfWeek) || daysOfMonth.includes(dayOfMonth)
          );
        default:
          return false;
      }
    };

    // check if the date is not valid based on the frequency and times
    if (!isValidDate(parsedDate, frequency, daysOfWeek, daysOfMonth)) {
      res.status(400).json({
        message: "Invalid Date Based on Habit Frequency",
      });
      return;
    }

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

export const getHabitLogsByHabitId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // check if the user is authenticated or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need to Login First",
      });
      return;
    }
    // checking habitId from req.params
    const { habitId } = req.params;

    // sorting and finding the habit logs based on the habitId and add the limit to 10
    const limit = 10;
    const habitLogs = await HabitLog.find({
      user: userId,
      habit: habitId,
    })
      .sort({ date: -1 })
      .limit(limit)
      .exec();

    // count total numbers of habit logs for this habitId
    const totalCount = await HabitLog.countDocuments({
      user: userId,
      habit: habitId,
    });
    // if no habit Logs found for this habit, return 404 status code.
    if (!habitLogs || habitLogs.length === 0) {
      res.status(404).json({
        message: "No Habit Logs Found for this Habit",
      });
      return;
    }

    // response to the client with the success message and the habit Logs
    res.status(200).json({
      message: "Habit Logs Fetched Successfully",
      habitLogs: habitLogs,
      totalCount: totalCount,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error Fetching Habit Logs", errorMessage);
    res.status(500).json({
      message: "Failed to Fetch Habit Logs",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
