import express from "express";
import {
  createHabitLog,
  getHabitLogsByHabitId,
  getMonthlyGraphData,
  getWeeklyGraphData,
  updateHabitLog,
} from "../controllers/habitLogsController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = express.Router();

// Endpoint -> "/api/habit-logs"
router.post("/", authenticateUser, createHabitLog);
router.get("/:habitId", authenticateUser, getHabitLogsByHabitId);
router.get("/graph/weekly/:habitId", authenticateUser, getWeeklyGraphData);
router.get("/graph/monthly/:habitId", authenticateUser, getMonthlyGraphData);
router.put("/:logId", authenticateUser, updateHabitLog);

/* 
router.get("/:habitId", getHabitLogsByHabitId); ✅✅✅
router.get("/graph/weekly/:habitId", getWeeklyGraphData); ✅✅✅
router.get("/graph/monthly/:habitId", getMonthlyGraphData); ✅✅✅
router.put("/:logId", updateHabitLog);
router.delete("/:habitId", deleteHabitLog);

(** optional **) router.delete("/log/:logId", deleteHabitLog);


*/
export default router;

// All the endpoints and the controller functions that we will create in this file.
/* 
createHabitLog	Create a new log entry
getHabitLogsByHabitId	Get all logs for a habit
getWeeklyGraphData	Return 7-day log data
getMonthlyGraphData	Return 30-day log data
updateHabitLog	Update completion or notes of a log
deleteHabitLog	Delete all logs of a habit
calculateStreakForHabit	Calculate current streak like Snapchat (🔥)

POST	/	Create a new log
GET	/:habitId	Get all logs for that habit
GET	/graph/weekly/:habitId	Weekly graph data (7 days)
GET	/graph/monthly/:habitId	Monthly graph data (last 30 days)
PUT	/:logId	Update specific log (maybe to mark completed or change note)
DELETE	/:habitId	Delete all logs for that habit (when a habit is deleted)
(optional) DELETE	/log/:logId


*/

/*
📖 Chapter 1: The Land of Habits
In the Kingdom of Backend, there lived a noble app that helped users track their daily habits — drinking water, going for walks, reading books, you name it!

But these habits didn’t track themselves. No, no. They needed Habit Logs 📝 — little scrolls of information saying:

“Yes, I completed my habit today!”

“I wrote some notes about my progress.”

“Here’s the exact time I did it!”

And so, the habitLogsController was born — a team of brave functions, each with a very special quest.

⚔️ Chapter 2: The Guardians of the Logs
Let’s meet the heroes of our story:

👶 createHabitLog
The first to awaken!
When a user completes a habit, this function writes a new scroll (log) into the kingdom’s great library (MongoDB).
It saves who did it, what habit it was, whether it was completed, and what the user noted.

🔍 getHabitLogsByHabitId
The historian.
Imagine a wizard who can summon all scrolls related to one habit — sorted by the latest first, 10 at a time, with total count included.
Perfect for kings (admins) who want to see how consistent a citizen has been!

📈 getWeeklyGraphData
This hero is the seer of the past 7 days.
He looks back from today, sees what days the habit was completed, and brings back a nice chart — like a timeline — to show the ups and downs of discipline.

It’s like, “You were on fire 🔥 on Wednesday and Friday, but you missed Monday!”

📆 getMonthlyGraphData
The high priest of monthly insights.
This one doesn’t just show you what you did — it shows how well you did it.

For each of the last 6 moons (months), it calculates your completion rate. Maybe you rocked in April, but slacked off in February.

A wise mentor once said: “Know your past, and you shall improve your future.” That’s exactly what this hero does.

✏️ updateHabitLog
The healer.
Sometimes a scroll (log) has mistakes. Maybe you forgot to mark it complete, or you wanted to add notes.

This function gently opens the scroll, edits what’s needed, and sews it back with love 💖.

🗑️ deleteHabitLog
The exorcist.
Not all scrolls deserve to remain. Maybe they were errors. Maybe the habit was deleted.

This hero removes all the logs of a habit (or optionally, just one) so the kingdom isn’t filled with useless data.

🔥 calculateStreakForHabit
The fireKeeper.
You’ve heard of SnapStreaks, right? This function calculates your current streak — how many days in a row you’ve been crushing your habit.

It looks back each day and checks: “Did you do it? Great! Let’s keep counting!”
Miss a day? Oof, streak reset. But no worries — tomorrow is a new chance. 🕊️

📜 Epilogue: Planning the Next Adventure
In your kingdom’s scrolls, you've already detailed what each hero does — that’s smart! ⚙️ Now it’s time to bring them all together in your router:

js
Copy
Edit
router.delete("/:habitId", deleteHabitLog); // delete all logs of a habit
router.delete("/log/:logId", deleteHabitLog); // (optional) delete just one log
You’re assembling your army — each endpoint a sword in your backend arsenal.

🧙‍♂️ Moral of the Story
Every feature in your app — whether it's logging, updating, or visualizing — is like a character on a mission to help users become the best version of themselves.

And you, singh, are the architect of this kingdom, giving each hero its purpose, and guiding users toward consistency and growth. 🛠️🌱
*/
