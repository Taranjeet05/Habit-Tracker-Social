import express from "express";
import {
  createHabit,
  deleteHabit,
  getHabitById,
  getHabitsByUser,
  updateHabit,
  getTodayHabits,
  getAllHabitsExceptToday,
} from "../controllers/habitsController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = express.Router();

// Endpoint -> "/api/habits"
router.post("/", authenticateUser, createHabit);
router.get("/", authenticateUser, getHabitsByUser);
router.get("/today", authenticateUser, getTodayHabits);
router.get("/all", authenticateUser, getAllHabitsExceptToday);
router.get("/:id", authenticateUser, getHabitById);
router.put("/:id", authenticateUser, updateHabit);
router.delete("/:id", authenticateUser, deleteHabit);

export default router;
