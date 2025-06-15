import { Types } from "mongoose";
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

export const getWeeklyGraphData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // check if the user is logged in or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need to Login First",
      });
      return;
    }
    // check if the habitId is provided in the request params
    const { habitId } = req.params;
    if (!habitId) {
      res.status(400).json({
        message: "Habit Id is Required",
      });
      return;
    }

    const habit = await Habit.findById(habitId);
    if (!habit) {
      res.status(400).json({
        message: "Habit Not Found",
      });
      return;
    }
    // check timesPerDay for the habit on that day
    const timesPerDay = habit.customFrequency?.times || 1; // Default to 1 if not set

    // Prepare Date Range for the last 7 days
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // set time to midnight UTC
    const startDate = new Date(today);
    startDate.setUTCDate(today.getUTCDate() - 6); // 7 days ago date

    // query habitLogs for the last 7 days
    const logByDay = await HabitLog.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId.toString()),
          habit: new Types.ObjectId(habitId.toString()),
          date: {
            $gte: startDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 }, // count of logs per day
        },
      },
    ]);

    // fill in missing day with zero logs
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      const log = logByDay.find((l) => l._id === dateString);
      const count = log ? log.count : 0;

      result.push({
        date: dateString,
        count,
        completed: count >= timesPerDay,
      });
    }

    res.status(200).json({
      message: "Weekly Graph Data Fetched Successfully",
      weeklyGraphData: result,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error fetching weekly graph data", errorMessage);
    res.status(500).json({
      message: "Failed to fetch weekly graph data",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getMonthlyGraphData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // check if the user is logged in or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need to LOgin First",
      });
      return;
    }
    // check if the habitId is provided in the req params
    const { habitId } = req.params;
    if (!habitId) {
      res.status(400).json({
        message: "Habit Id is Required",
      });
      return;
    }
    // check if the habit exists or not
    const habit = await Habit.findById(habitId);
    if (!habit) {
      res.status(404).json({
        message: "Habit Not Found",
      });
      return;
    }

    // check timesPerDay for the habit on that day
    const timesPerDay = habit.customFrequency?.times || 1; // Default to 1 if not set

    // Prepare Date Range for last 6 months;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // set time to midnight UTC
    const startDate = new Date(today);
    startDate.setUTCMonth(today.getUTCMonth() - 5); // 6 months ago date
    startDate.setUTCDate(1); // set to the first day of the month
    const endDate = new Date(today);
    endDate.setUTCDate(0); // set to the last day of the month
    endDate.setUTCHours(23, 59, 59, 999); // set time to the end of the day

    // Aggregation pipeline to get logs for the last 6 months
    const monthlyStats = await HabitLog.aggregate([
      // Stage 1: Filter relevant logs
      {
        $match: {
          user: new Types.ObjectId(userId.toString()),
          habit: new Types.ObjectId(habitId.toString()),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      // Stage 2: Group by year-month and calculate metrics
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalDays: { $sum: 1 },
          completedDays: {
            $sum: {
              $cond: [{ $eq: ["$completed", true] }, 1, 0],
            },
          },
        },
      },
      // Stage 3: Calculate completion rate
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          monthName: {
            $arrayElemAt: [
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              { $subtract: ["$_id.month", 1] },
            ],
          },
          completionRate: {
            $round: [
              {
                $multiply: [{ $divide: ["$completedDays", "$totalDays"] }, 100],
              },
              0,
            ],
          },
        },
      },
      // Stage 4: Sort chronologically
      { $sort: { year: 1, month: 1 } },
    ]);
    // Fill missing month with 0% completion
    const completeData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const year = currentDate.getUTCFullYear();
      const month = currentDate.getUTCMonth() + 1;

      const existing = monthlyStats.find(
        (s) => s.year === year && s.month === month
      );

      completeData.push({
        year,
        month,
        monthName: currentDate.toLocaleString("default", { month: "short" }),
        completionRate: existing?.completionRate || 0,
      });

      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    }

    // Response to the client with the success message and the monthly graph data
    res.status(200).json({
      message: "Monthly Graph Data Fetched Successfully",
      timeRange: {
        start: startDate.toISOString().slice(0, 10),
        end: endDate.toISOString().slice(0, 10),
      },
      habitTarget: habit.customFrequency?.times || 1,
      data: completeData,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error fetching monthly graph data", errorMessage);
    res.status(500).json({
      message: "FAiled to fetch monthly graph data",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const updateHabitLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // check if the user is logged in or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need to Login First",
      });
      return;
    }

    // reject with forbidden 403
    res.status(403).json({
      message: "Habit Logs can not be modified",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error in update attempt", errorMessage);
    res.status(500).json({
      message: "System error during update request",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// deleteAllHabitLogs

export const deleteAllHabitLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // check if user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need to Login First",
      });
      return;
    }
    // validate habitId
    const { habitId } = req.params;
    if (!habitId) {
      res.status(400).json({
        message: "Habit Id is Required",
      });
      return;
    }
    // verify the habit exist and belongs to the user
    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      res.status(404).json({
        message: "Habit not found or not owned by You",
      });
      return;
    }
    // Delete all logs
    const deletingAllLogs = await HabitLog.deleteMany({
      habit: habitId,
      user: userId,
    });

    // success response to the client
    res.status(200).json({
      message: `Deleted ${deletingAllLogs.deletedCount}log(s) for this Habit 🧼`,
      deletedCount: deletingAllLogs.deletedCount,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error deleting all the logs", errorMessage);
    res.status(500).json({
      message: "System error during deleting all the logs",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// delete Habit Log by its ID

export const deleteHabitLogById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // check if the user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You Need to Login First",
      });
      return;
    }
    const { habitLogId } = req.params;
    if (!habitLogId) {
      res.status(401).json({
        message: "Habit Log Id is Required",
      });
      return;
    }

    const deletedLog = await HabitLog.findOneAndDelete({
      _id: habitLogId,
      user: userId,
    });
    if (!deletedLog) {
      res.status(404).json({
        message: "Habit Log not found or not owned by YOU",
      });
      return;
    }
    res.status(200).json({
      message: "Log Deleted Successfully",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log(`Error while deleting the Habit Log by it's ID`, errorMessage);
    res.status(500).json({
      message: `System Error during deleting Habit Log by it's ID`,
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// calculateStreakForHabit	Calculate current streak like Snapchat (🔥)

export const calculateStreakForHabit = async (req: Request, res: Response) => {
  try {
    // check if the user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({ message: "You Need to Login First" });
      return;
    }
    //
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log(`Error while Calculate current streak`);
    res.status(500).json({
      message: "System Error during Calculate current streak",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
