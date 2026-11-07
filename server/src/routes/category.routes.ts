import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  getLandingCategories,
  updateLandingCategories,
} from "../controllers/categoryController";
import {
  landingCategoriesSchema,
  validateBody,
} from "../middleware/validation";

const router = Router();
router.post("/", authenticateToken, requireAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/landing", getLandingCategories);
router.put(
  "/landing",
  authenticateToken,
  requireAdmin,
  validateBody(landingCategoriesSchema),
  updateLandingCategories,
);
//the id parameter should be the last route to avoid conflicts with other routes
router.get("/:id", getCategoryById);
router.put("/:id", authenticateToken, requireAdmin, updateCategory);
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);
export default router;
