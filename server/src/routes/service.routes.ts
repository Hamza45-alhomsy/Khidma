import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  getUserServices,
  updateService,
} from "../controllers/serviceController";

const router = Router();
router.post("/", authenticateToken, createService);
router.get("/", authenticateToken, getUserServices);
router.get("/all", getAllServices);

router.get("/:id", authenticateToken, getServiceById);
router.put("/:id", authenticateToken, updateService);
router.delete("/:id", authenticateToken, deleteService);
export default router;
