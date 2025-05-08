import mongoose from "mongoose";
import debug from "debug";
const log = debug("app:db"); // Namespace for DB logs

export const connectDB = async () => {
  const URI: string | undefined = process.env.MONGODB_URI;

  if (!URI) {
    log("MONGODB_URI is missing in environment variables");
    throw new Error("MongoDB URI not configured");
  }

  try {
    await mongoose.connect(URI);
    log("MongoDB connected successfully ✅");
  } catch (error: any) {
    log("Connection failed:", error.message);
    throw error;
  }
};
