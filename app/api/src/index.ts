// src/index.ts
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import boothsRouter from "./routes/booths.js";

const app = express();
const PORT = 4000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/booths", boothsRouter);
app.get("/ping", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
