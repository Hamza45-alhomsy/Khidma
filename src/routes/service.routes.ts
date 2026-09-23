import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all services" });
});
router.get("/:id", (req, res) => {
  res.json({ message: "Get one service" });
});
router.put("/:id", (req, res) => {
  res.json({ message: "Update service" });
});
router.delete(":id", (req, res) => {
  res.status(200).json({ message: "delete service" });
});
export default router;
