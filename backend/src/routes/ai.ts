import { Router } from "express";
import { prisma } from "../config/prisma"; // adapte selon ton import
import { auth, AuthenticatedRequest } from "../middlewares/auth"; // adapte selon ton projet
import { askLLM } from "../ai/ollama";

export const aiRouter = Router();
aiRouter.use(auth);

/**
 * GET /ai/home
 * -> commentaire court sur toutes les listes
 */
aiRouter.get("/ai/home", async (req: AuthenticatedRequest, res) => {
  const lists = await prisma.taskList.findMany({
    where: { userId: req.userId },
    include: { tasks: true },
  });

  const stats = lists.map((l) => {
    const todo = l.tasks.filter((t) => t.status !== "DONE").length;
    const done = l.tasks.filter((t) => t.status === "DONE").length;
    const total = l.tasks.length;
    return { name: l.name, total, todo, done };
  });

  const prompt = `
You are a productivity assistant.
Write 3 short bullet points (max 15 words each) about the user's global task lists status.
Be concrete and actionable. No emojis.
Data: ${JSON.stringify(stats)}
`;

  const comment = await askLLM(prompt);
  return res.json({ comment, stats });
});

/**
 * GET /ai/lists/:id
 * -> analyse courte d'une liste
 */
aiRouter.get("/ai/lists/:id", async (req: AuthenticatedRequest, res) => {
  const listId = req.params.id;
  if (typeof listId !== "string") return res.status(400).json({ error: "Invalid list id" });

  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId: req.userId },
    include: { tasks: true },
  });

  if (!list) return res.status(404).json({ error: "List not found" });

  const now = Date.now();
  const tasks = list.tasks.map((t) => ({
    title: t.title,
    status: t.status,
    dueDate: t.dueDate,
    overdue: t.status !== "DONE" && new Date(t.dueDate).getTime() < now,
  }));

  const prompt = `
You are a productivity assistant.
Write:
1) A 1-sentence summary of this list.
2) 2 actionable suggestions (bullets).
Keep it short. No emojis.
List name: ${list.name}
Tasks: ${JSON.stringify(tasks)}
`;

  const comment = await askLLM(prompt);
  return res.json({ comment });
});
