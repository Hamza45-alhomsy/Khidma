import { Router } from "express";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.use(authenticateToken);
router.get("/", (req, res) => {
  res.json({ message: "User logged out" });
}); //get profile
router.put("/", (req, res) => {
  res.json({ message: "User logged out" });
}); // update profile
router.post("/change-password", (req, res) => {
  res.json({ message: "User logged out" });
}); //change password route
export default router;
export { router };
