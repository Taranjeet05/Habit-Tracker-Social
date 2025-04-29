import mongoose, { Schema } from "mongoose";
import { IHabit } from "../types/index.js";

const habitSchema = new mongoose.Schema<IHabit>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      enum: ["red", "yellow", "green"],
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
    },
    reminders: {
      enabled: {
        type: Boolean,
        default: false,
      },
      time: {
        type: String,
        default: "09:00", // Format: HH:MM in 24h
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
