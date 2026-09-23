import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all tasks" });
});
router.get("/:id", (req, res) => {
  res.json({ message: "Get one task" });
});
router.put("/:id", (req, res) => {
  res.json({ message: "Update task" });
});
router.delete(":id", (req, res) => {
  res.json({ message: "delete task" });
});
export default router;
