import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/index.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profileImage: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    emailNotification: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
