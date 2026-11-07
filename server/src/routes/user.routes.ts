import { Router } from "express";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.use(authenticateToken);

router.get("/", (req, res) => {
  res.json({ message: "Get all users" });
});
router.get("/:id", (req, res) => {
  res.json({ message: "Get one user" });
});
router.put("/:id", (req, res) => {
  res.json({ message: "Update user" });
});
router.delete(":id", (req, res) => {
  res.json({ message: "delete user" });
});
export default router;
