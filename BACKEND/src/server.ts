import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

//  __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (create a public directory in your backend)
app.use(express.static(path.join(__dirname, "public")));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Habit Tracker Backend is running! 🚀");
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
