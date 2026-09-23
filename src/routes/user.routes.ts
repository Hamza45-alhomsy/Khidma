import { Router } from "express";

const router = Router();

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
