import mongoose, { Schema } from "mongoose";
import { IHabitLog } from "../types/index.js";

const HabitLogSchema = new Schema<IHabitLog>(
  {
    habit: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one log per habit per day
HabitLogSchema.index({ user: 1, habit: 1, date: 1 });

const HabitLog =
  mongoose.models.HabitLog || mongoose.model("HabitLog", HabitLogSchema);
export default HabitLog;
