import mongoose, { Schema } from "mongoose";

const HabitLogSchema = new Schema(
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
HabitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

const HabitLog =
  mongoose.models.HabitLog || mongoose.model("HabitLog", HabitLogSchema);
export default HabitLog;
