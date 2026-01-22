import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { auth, AuthenticatedRequest } from "../middlewares/auth";

export const listsRouter = Router();

// Toutes les routes ici sont protégées
listsRouter.use(auth);

// GET /lists → mes listes
listsRouter.get("/", async (req: AuthenticatedRequest, res) => {
  const lists = await prisma.taskList.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
  });

  res.json(lists);
});

// POST /lists → créer une liste
const createListSchema = z.object({
  name: z.string().min(1),
});

listsRouter.post("/", async (req: AuthenticatedRequest, res) => {
  const parsed = createListSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const list = await prisma.taskList.create({
      data: {
        name: parsed.data.name,
        userId: req.userId!,
      },
    });

    return res.status(201).json(list);
  } catch (e) {
    // Nom déjà utilisé par ce user
    return res.status(409).json({ error: "List name already exists" });
  }
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

listsRouter.delete("/:id", async (req: AuthenticatedRequest, res) => {
  const parsed = idParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const { id } = parsed.data;

  const list = await prisma.taskList.findFirst({
    where: {
      id,
      userId: req.userId,
    },
  });

  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  await prisma.taskList.delete({ where: { id } });
  return res.status(204).send();
});
