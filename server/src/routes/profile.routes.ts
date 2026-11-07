import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  changePassword,
  getUserProfile,
  updateUser,
} from "../controllers/profileController";
import { authLimiter } from "../middleware/rateLimiter";
const router = Router();
router.use(authenticateToken);
router.get("/", getUserProfile);
router.put("/", updateUser);
router.put("/change-password", authLimiter, changePassword);
export default router;
export { router };
