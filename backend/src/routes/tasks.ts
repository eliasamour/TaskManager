import { Router } from "express";
import { prisma } from "../config/prisma";
import { auth, AuthenticatedRequest } from "../middlewares/auth";
import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const tasksRouter = Router();

// Toutes les routes tasks sont protégées
tasksRouter.use(auth);

/**
 * GET /lists/:listId/tasks
 * → renvoie les tasks d'une liste (si la liste appartient au user)
 */
tasksRouter.get("/lists/:listId/tasks", async (req: AuthenticatedRequest, res) => {
  const rawListId = req.params.listId;

  // Sécurise le type (évite string[])
  if (typeof rawListId !== "string") {
    return res.status(400).json({ error: "Invalid listId" });
  }

  const listId = rawListId;

  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId: req.userId },
    select: { id: true },
  });

  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  const tasks = await prisma.task.findMany({
    where: { listId },
    orderBy: { createdAt: "asc" },
  });

  return res.json(tasks);
});

/*POST, on crée une task*/

const createTaskSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string().datetime(),
  details: z.string().optional(),
});

tasksRouter.post("/lists/:listId/tasks", async (req: AuthenticatedRequest, res) => {
  const rawListId = req.params.listId;
  if (typeof rawListId !== "string") {
    return res.status(400).json({ error: "Invalid listId" });
  }
  const listId = rawListId;

  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  // Vérifier que la liste appartient au user
  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId: req.userId },
    select: { id: true },
  });

  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      details: parsed.data.details,
      dueDate: new Date(parsed.data.dueDate),
      listId,
    },
  });

  return res.status(201).json(task);
});

//Pouvoir cocher/decocher une task si elle est faite ou non
const toggleTaskSchema = z.object({
  status: z.enum(["TODO", "DONE"]),
});

tasksRouter.patch("/tasks/:id", async (req: AuthenticatedRequest, res) => {
  const rawId = req.params.id;
  if (typeof rawId !== "string") {
    return res.status(400).json({ error: "Invalid task id" });
  }
  const id = rawId;

  const parsed = toggleTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  // Vérifier que la task appartient bien au user (via la liste)
  const task = await prisma.task.findFirst({
    where: {
      id,
      list: { userId: req.userId },
    },
    select: { id: true },
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { status: parsed.data.status as TaskStatus },
  });

  return res.json(updated);
});

/* voir les détails */
tasksRouter.get("/tasks/:id", async (req: AuthenticatedRequest, res) => {
  const rawId = req.params.id;
  if (typeof rawId !== "string") {
    return res.status(400).json({ error: "Invalid task id" });
  }
  const id = rawId;

  const task = await prisma.task.findFirst({
    where: {
      id,
      list: { userId: req.userId },
    },
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.json(task);
});

/*delete, supprimer*/
tasksRouter.delete("/tasks/:id", async (req: AuthenticatedRequest, res) => {
  const rawId = req.params.id;
  if (typeof rawId !== "string") {
    return res.status(400).json({ error: "Invalid task id" });
  }
  const id = rawId;

  const task = await prisma.task.findFirst({
    where: {
      id,
      list: { userId: req.userId },
    },
    select: { id: true },
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  await prisma.task.delete({ where: { id } });
  return res.status(204).send();
});

