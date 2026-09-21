import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.json({
    message: "this server is working sucessfully ✅",
  });
});
export { app };
export default app;
