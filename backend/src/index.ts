import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { auth, AuthenticatedRequest } from "./middlewares/auth";
import { listsRouter } from "./routes/lists";
import { tasksRouter } from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);

// test route protégée
app.get("/me", auth, (req: AuthenticatedRequest, res) => {
  res.json({ userId: req.userId });
});

app.use("/lists", listsRouter);

app.use(tasksRouter);

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
