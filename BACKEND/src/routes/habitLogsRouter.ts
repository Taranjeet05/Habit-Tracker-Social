import express from "express";
import { createHabitLog } from "../controllers/habitLogsController.js";
const router = express.Router();

// Endpoint -> "/api/habit-logs"
router.post("/", createHabitLog);
/* 
router.get("/:habitId", getHabitLogsByHabitId);
router.get("/graph/weekly/:habitId", getWeeklyGraphData);
router.get("/graph/monthly/:habitId", getMonthlyGraphData);
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


