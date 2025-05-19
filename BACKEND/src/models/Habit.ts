import mongoose, { Schema } from "mongoose";
import { IHabit } from "../types/index.js";

const habitSchema = new mongoose.Schema<IHabit>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      enum: ["Green", "Blue", "Purple", "Teal", "Orange", "Red", "Yellow"],
      default: "green",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "custom"],
      default: "daily",
    },

    customFrequency: {
      daysOfWeek: {
        type: [Number], // [0-6] => Sunday to Saturday
        default: [],
        validate: {
          validator: (arr: number[]) => arr.every((d) => d >= 0 && d <= 6),
          message: "daysOfWeek must be numbers between 0 (Sun) and 6 (Sat)",
        },
      },
      daysOfMonth: {
        type: [Number], // [1-31]
        default: [],
        validate: {
          validator: (arr: number[]) => arr.every((d) => d >= 1 && d <= 31),
          message: "daysOfMonth must be between 1 and 31",
        },
      },
      times: {
        type: Number,
        default: 1,
        min: 1,
      },
    },

    reminders: {
      enabled: {
        type: Boolean,
        default: false,
      },
      timesPerDay: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      times: {
        type: [String], // "HH:MM"
        validate: {
          validator: function (times: string[]) {
            return times.every((t) =>
              /^([01]\d|2[0-3]):([0-5]\d)$/.test(t)
            );
          },
          message: "Each time must be in HH:MM format",
        },
        default: undefined,
      },
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: String,
      enum: ["private", "friends", "public"],
      default: "private",
    },
  },
  { timestamps: true }
);

const Habit = mongoose.models.Habit || mongoose.model("Habit", habitSchema);
export default Habit;
