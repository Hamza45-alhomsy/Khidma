import express from "express";
import apiRoutes from "./routes/index";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import env from "../env";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "this server is working sucessfully ✅",
  });
});
app.use("/api", apiRoutes);
export { app };
export default app;
