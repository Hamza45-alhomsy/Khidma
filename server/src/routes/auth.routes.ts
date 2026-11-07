import { Router } from "express";
import { createUser, login, logout } from "../controllers/authController";
import { registerSchema } from "../middleware/validation";
import { validateBody, loginSchema } from "../middleware/validation";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, validateBody(registerSchema), createUser);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", (req, res) => {
  res.json({ message: "Token refreshed" });
});
export default router;
