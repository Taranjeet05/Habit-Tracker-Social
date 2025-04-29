import mongoose, { Schema } from "mongoose";
import { INotification } from "../types/index.js";

const notificationSchema = new mongoose.Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "friend_request",
        "friend_accepted",
        "habit_reminder",
        "streak_milestone",
        "system",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ["User", "Habit", "FriendRequest", null],
        default: null,
      },
      id: {
        type: Schema.Types.ObjectId,
        refPath: "relatedTo.model",
        default: null,
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
