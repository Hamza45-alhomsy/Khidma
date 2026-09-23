import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  res.json({ message: "registe a user" });
});
router.post("/login", (req, res) => {
  res.json({ message: "login a user" });
});
router.post("/logout", (req, res) => {
  res.json({ message: "User logged out" });
});
router.post("/refresh", (req, res) => {
  res.json({ message: "Token refreshed" });
});
export default router;
