import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/mongoose-connection.js";
connectDB();
import debug from "debug";
const log = debug("app:server");
import index from "./routes/index.js";
import usersRouter from "./routes/usersRouter.js";
import habitsRouter from "./routes/habitsRouter.js";
import habitLogsRouter from "./routes/habitLogsRouter.js";
import friendRequestsRouter from "./routes/friendRequestsRouter.js";
import notificationsRouter from "./routes/notificationsRouter.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (create a public directory in your backend)
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/api/users", usersRouter);
app.use("/api/habits", habitsRouter);
app.use("/api/habit-logs", habitLogsRouter);
app.use("/api/friends", friendRequestsRouter);
app.use("/api/notifications", notificationsRouter);

// Server setup
const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
