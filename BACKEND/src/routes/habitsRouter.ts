import express from "express";
import {
  createHabit,
  getHabitById,
  getHabitsByUser,
  updateHabit,
} from "../controllers/habitsController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = express.Router();

// Endpoint -> "/api/habits"
router.post("/", authenticateUser, createHabit);
router.get("/", authenticateUser, getHabitsByUser);
router.get("/:id", authenticateUser, getHabitById);
router.put("/:id", authenticateUser, updateHabit);

export default router;
