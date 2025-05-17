import express, { Request, Response } from "express";
import { createHabitLog } from "../controllers/habitLogsController.js";
const router = express.Router();

// Endpoint -> "/api/habit-logs"
router.post("/", createHabitLog);
/* 
router.get("/:habitId", getHabitLogsByHabitId);
router.put("/:id", updateHabitLog);
router.delete("/:id", deleteHabitLog);

*/
export default router;

