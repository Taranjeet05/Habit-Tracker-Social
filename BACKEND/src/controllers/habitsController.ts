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
    const userId = req.user?._id || "6813a52286c4475597e179c6";

    if (!userId) {
      res.status(401).json({
        message: "You need to login first",
      });
      return;
    }

    const newHabit = await Habit.create({
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

export const getHabitsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // checking if user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    // if user is not logged in we will return 401
    if (!userId) {
      res.status(401).json({
        message: "You need to Login first",
      });
    }
    // if user is logged in we will return 200 and all the habits of the user
    const habits = await Habit.find({ user: userId }).lean();
    res.status(200).json({
      success: true,
      message: "Habits Fetched Successfully ✅",
      data: habits,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error Getting Habits by User", errorMessage);
    res.status(500).json({
      message: "Failed to get Habits by User",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getHabitById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // checking if user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";

    // if user is not logged in we will return 401
    if (!userId) {
      res.status(401).json({
        message: "you need to Login first",
      });
    }
    // getting the habitId from the params
    const habitId = req.params.id;

    // checking if habitId is valid or not
    if (!habitId) {
      res.status(400).json({
        message: "HabitId is required",
      });
      return;
    }

    // if user exists we will return 200 and data of habitId
    const habit = await Habit.findById(habitId).lean();

    // if habit is not found we will return 404
    if (!habit) {
      res.status(404).json({
        message: "Habit not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Habit Fetched Successfully ✅",
      data: habit,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error Getting Habit by Id", errorMessage);
    res.status(500).json({
      message: "Failed to get Habit by Id",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const updateHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // checking if user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    // if user is not logged in we will return 401
    if (!userId) {
      res.status(401).json({
        message: "You need to Login first",
      });
    }
    // getting habitId from params
    const habitId = req.params.id;
    if (!habitId) {
      res.status(400).json({
        message: "HabitId is required",
      });
    }
    // zod validation for update habit
    const parsed = createHabitsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(409).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const data = parsed.data;
    // finding the habit by id in mongoDB
    const habit = await Habit.findById(habitId);
    // if habit is not found we will return 404
    if (!habit) {
      res.status(404).json({
        message: "Habit not found",
      });
      return;
    }
    // if habit is found we will update the habit and return 200
    const updateHabit = await Habit.findByIdAndUpdate(
      habitId,
      {
        ...data,
        user: userId,
        reminders: parsed.data.reminders
          ? {
              enabled: true,
              times: parsed.data.reminders.times,
              timePerDay: parsed.data.reminders.timesPerDay,
            }
          : { enabled: false },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Habit Updated Successfully ✅",
      data: updateHabit,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error updating Habit", errorMessage);
    res.status(500).json({
      message: "Failed to update Habit",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const deleteHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // checking if user exist or not
    const userId = req.user?._id || "6813a52286c4475597e179c6";
    if (!userId) {
      res.status(401).json({
        message: "You need to Login first",
      });
    }
    // getting habitId from params
    const habitId = req.params.id;
    // if habitId is not found we will return 400
    if (!habitId) {
      res.status(400).json({
        message: "HabitId is required",
      });
    }
    // if habitId is found we will delete the habit and return 200
    const habit = await Habit.findByIdAndDelete(habitId);
    // if habit is not found we will return 404
    if (!habit) {
      res.status(404).json({
        message: "Habit not found",
      });
      return;
    }
    // if habit is found we will return 200 and delete the habit
    res.status(200).json({
      success: true,
      message: "Habit Deleted Successfully ✅",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error deleting Habit", errorMessage);
    res.status(500).json({
      message: "Failed to delete Habit",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
