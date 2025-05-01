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

//  __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (create a public directory in your backend)
app.use(express.static(path.join(__dirname, "public")));

// Basic route

app.use("/", index);
app.use("/api/users", usersRouter);
app.use("/api/habits", habitsRouter);
app.use("/api/habit-logs", habitLogsRouter);
app.use("/api/friends", friendRequestsRouter);
app.use("/api/notifications", notificationsRouter);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});
