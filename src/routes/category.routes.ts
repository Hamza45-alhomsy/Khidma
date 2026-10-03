import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController";

const router = Router();
router.post("/", authenticateToken, requireAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", authenticateToken, requireAdmin, updateCategory);
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);
export default router;
