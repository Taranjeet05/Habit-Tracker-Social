// src/config/mongoose-connection.ts

import mongoose from "mongoose";

export const connectDB = async () => {
  const URI: string | undefined = process.env.MONGODB_URI;

  if (!URI) {
    console.error(
      "Error: MONGODB_URI is not defined in environment variables."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully ✅");
  } catch (error: any) {
    console.error("MongoDB connection error: ❌", error.message);
    process.exit(1);
  }
};
