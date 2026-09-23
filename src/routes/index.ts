import { Router } from "express";
import authRoute from "./auth.routes";
import serviceRoute from "./service.routes";
import taskRoute from "./task.routes";
import userRoute from "./user.routes";

const router = Router();
router.use("/services", serviceRoute);
router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/tasks", taskRoute);

export default router;
