import express from "express";
import {
  calculateStreakForHabit,
  createHabitLog,
  deleteAllHabitLogs,
  deleteHabitLogById,
  getHabitLogsByHabitId,
  getMonthlyGraphData,
  getWeeklyGraphData,
  updateHabitLog,
} from "../controllers/habitLogsController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = express.Router();

// Endpoint -> "/api/habit-logs"
router.post("/", authenticateUser, createHabitLog); // ✅ create

// 🔁 Put graph routes first to avoid conflicts
router.get("/graph/weekly/:habitId", authenticateUser, getWeeklyGraphData); // ✅ specific
router.get("/graph/monthly/:habitId", authenticateUser, getMonthlyGraphData); // ✅ specific

router.get("/:habitId/streak", authenticateUser, calculateStreakForHabit); // ✅ specific
router.get("/:habitId", authenticateUser, getHabitLogsByHabitId); // ✅ general

router.put("/:logId", authenticateUser, updateHabitLog); // ✅ update one log
router.delete("/single/:habitLogId", authenticateUser, deleteHabitLogById); // ✅ delete one log
router.delete("/all/:habitId", authenticateUser, deleteAllHabitLogs); // ‼️ delete all logs for a habit

export default router;

/*

"The Land of Habits"
In the magical Kingdom of Backend, there is a special app that helps users track their daily 
habits (like drinking water, reading, etc.).

But habits don't track themselves! They need habit logs — tiny records that say:

✅ “I completed my habit today!”

📝 “Here’s a note about my progress.”

To manage all these logs, a team of heroes (controller functions) was created — each one with a special job:

👑 Meet the Heroes (Controllers):
Hero (Function)           Role in the Story
🍼 createHabitLog         The first hero – creates new logs when a user completes a habit
📜 getHabitLogsByHabitId  The historian – shows all logs of a habit, like a journal
📊 getWeeklyGraphData     The 7-day seer – shows a timeline of completions in past week
📆 getMonthlyGraphData    The priest – shows monthly performance over time
✏️ updateHabitLog        The healer – updates or edits existing logs
🗑️ deleteHabitLog        The cleaner – removes logs to keep the kingdom tidy
🔥 calculateStreakForHabit The fireKeeper – checks how many days in a row a habit was done (like a SnapStreak!)

🧙 Moral of the Story
Every controller is like a hero with a mission 🛡️
And you, the developer, are the one bringing them all together in your Express 
router — building a helpful system where users can track their progress, 
learn from their history, and grow every day 🌱

*/
