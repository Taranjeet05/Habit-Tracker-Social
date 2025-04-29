import mongoose, { Schema } from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate requests
friendRequestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

const FriendRequest =
  mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
