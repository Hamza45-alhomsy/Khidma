import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getUserTasks,
  updateTask,
} from "../controllers/taskController";

const router = Router();
router.get("/all", getAllTasks);

router.post("/", authenticateToken, createTask);
router.get("/", authenticateToken, getUserTasks);
router.get("/:id", authenticateToken, getTaskById);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);
export default router;
