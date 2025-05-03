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
      days: {
        type: [Number],
        default: [],
      },
      times: {
        type: Number, // How many times per period
        default: 1,
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
        type: [String], // Array of "HH:MM" format
        validate: {
          validator: function (times: string[]) {
            return times.every((t) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t));
          },
          message: "Each time must be in HH:MM format",
        },
        default: undefined, // Not saved if reminders are not enabled
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
