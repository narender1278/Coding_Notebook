import express from "express";
import { getAllHabits, getAllHabitTypes,postHabitType,postHabit,deleteHabit,deleteHabitType, habitToggle,habitsSectionToggle,getAllHabitsLog } from "../controllers/habitControllers.js";

const router = express.Router();

router.get("/getAllHabits", getAllHabits);
router.get("/getAllHabitTypes", getAllHabitTypes);
router.post("/postHabitType",postHabitType);
router.post("/postHabit",postHabit);
router.delete("/deleteHabit/:id",deleteHabit);
router.delete("/deleteHabitType/:id",deleteHabitType);
router.post("/habitToggle",habitToggle);
router.post("/habitsSectionToggle",habitsSectionToggle);
router.get("/getAllHabitsLog",getAllHabitsLog);
export default router;
