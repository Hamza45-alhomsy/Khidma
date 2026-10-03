import { Router } from "express";
import { createUser, login } from "../controllers/authController";
import { registerSchema } from "../middleware/validation";
import { validateBody, loginSchema } from "../middleware/validation";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, validateBody(registerSchema), createUser);
router.post("/login", authLimiter, validateBody(loginSchema), login);
router.post("/logout", (req, res) => {
  res.json({ message: "User logged out" });
});
router.post("/refresh", (req, res) => {
  res.json({ message: "Token refreshed" });
});
export default router;
