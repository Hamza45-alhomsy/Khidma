import { categories, tasks } from "../db/schema";
import { db } from "../db/connection";
import { Request, Response } from "express";
import { eq, desc, and } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth";

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      titleAr,
      titleEn,
      description,
      budgetAmount,
      budgetCurrency,
      categoryId,
      city,
      image,
    } = req.body;
    if (!titleAr || !categoryId) {
      return res.status(400).json({
        error: "Arabic title (titleAr) and categoryId are required fields.",
      });
    }
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId,
        titleAr,
        categoryId,
        titleEn: titleEn || null,
        description: description || null,
        budgetAmount: budgetAmount ? Number(budgetAmount) : null,
        budgetCurrency: budgetCurrency || "SYP",
        city: city || null,
        image: image || null,
      })
      .returning();
    return res.json({
      message: "Task created successfully",
      newTask,
    });
  } catch (error) {
    console.error("Cannot create a new Task", error);
    return res.status(500).json({
      error: "Cannot create a new Task",
    });
  }
};

export const getUserTasks = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).json({
        error: "There is no user to get tasks list",
      });
    }
    const tasksList = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: desc(tasks.createdAt),
      with: {
        category: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Get all user tasks", tasks: tasksList });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return res.status(500).json({ error: "Failed to fetch user tasks" });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasksList = await db.query.tasks.findMany({
      orderBy: desc(tasks.createdAt),
      with: {
        category: true,
        user: true,
      },
    });
    return res.status(200).json({ message: "Get all tasks", tasks: tasksList });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const Task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id as string),
      with: {
        category: true,
      },
    });
    if (!Task) {
      return res.status(404).json({
        error: "The Task doesn't exist",
      });
    }
    return res.json({ message: "This is the Task", Task: Task });
  } catch (error) {
    console.error("Cannot get Task", error);
    return res.json({
      error: "Cannot get a Task",
    });
  }
};
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      titleAr,
      titleEn,
      description,
      budgetAmount,
      budgetCurrency,
      categoryId,
      city,
      image,
    } = req.body;
    const userId = req.user!.id;
    const { id } = req.params;
    const userRole = req.user?.role?.toLowerCase();
    const existedTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, id as string),
    });
    if (!existedTask) {
      return res.status(404).json({
        error: "Cannot find Task",
      });
    }
    if (
      existedTask.userId !== userId &&
      userRole !== "admin" &&
      userRole !== "superadmin"
    ) {
      return res.status(403).json({
        error: "Forbidden . Cannot update this Task",
      });
    }
    const [updatedTask] = await db
      .update(tasks)
      .set({
        titleAr,
        titleEn,
        description,
        budgetAmount,
        budgetCurrency,
        categoryId,
        city,
        image,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id as string))
      .returning();

    return res.json({
      message: "The Task has updated successfully",
      Task: updatedTask,
    });
  } catch (error) {
    console.error("Cannot update Task", error);
    return res.json({
      errro: "Cannot update Task",
    });
  }
};
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const userRole = req.user?.role?.toLowerCase();
    const existedTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, id as string),
    });
    if (!existedTask) {
      return res.status(404).json({
        error: "Cannot find Task",
      });
    }
    if (
      existedTask.userId !== userId &&
      userRole !== "admin" &&
      userRole !== "superadmin"
    ) {
      return res.status(403).json({
        error: "Forbidden . Cannot delete this Task",
      });
    }
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id as string))
      .returning();

    return res.json({
      message: "The Task has deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.error("Cannot delete Task", error);
    return res.json({
      errro: "Cannot delete Task",
    });
  }
};
