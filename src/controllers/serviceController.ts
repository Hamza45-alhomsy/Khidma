import { categories, services } from "../db/schema";
import { db } from "../db/connection";
import { Request, Response } from "express";
import { eq, desc, and } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth";

export const createService = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
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
    const [newService] = await db
      .insert(services)
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
      message: "Service created successfully",
      newService,
    });
  } catch (error) {
    console.error("Cannot create a new service", error);
    return res.status(500).json({
      error: "Cannot create a new service",
    });
  }
};

export const getUserServices = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).json({
        error: "There is no user to get services list",
      });
    }
    const servicesList = await db.query.services.findMany({
      where: eq(services.userId, userId),
      orderBy: desc(services.createdAt),
      with: {
        category: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Get all user services", services: servicesList });
  } catch (error) {
    console.error("Error fetching user services:", error);
    return res.status(500).json({ error: "Failed to fetch user services" });
  }
};

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const servicesList = await db.query.services.findMany({
      orderBy: desc(services.createdAt),
      with: {
        category: true,
        user: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Get all services", services: servicesList });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await db.query.services.findFirst({
      where: eq(services.id, id as string),
      with: {
        category: true,
      },
    });
    if (!service) {
      return res.status(404).json({
        error: "The service doesn't exist",
      });
    }
    return res.json({ message: "This is the service", service: service });
  } catch (error) {
    console.error("Cannot get service", error);
    return res.json({
      error: "Cannot get a service",
    });
  }
};
export const updateService = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      categoryId,
      budgetAmount,
      budgetCurrency,
      titleEn,
      titleAr,
      description,
      city,
      image,
    } = req.body;
    const userId = req.user!.id;
    const { id } = req.params;
    const userRole = req.user?.role?.toLowerCase();
    const existedService = await db.query.services.findFirst({
      where: eq(services.id, id as string),
    });
    if (!existedService) {
      return res.status(404).json({
        error: "Cannot find service",
      });
    }
    if (
      existedService.userId !== userId &&
      userRole !== "admin" &&
      userRole !== "superadmin"
    ) {
      return res.status(403).json({
        error: "Forbidden . Cannot update this service",
      });
    }
    const [updatedService] = await db
      .update(services)
      .set({
        categoryId,
        budgetAmount,
        budgetCurrency,
        titleEn,
        titleAr,
        description,
        city,
        image,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id as string))
      .returning();

    return res.json({
      message: "The service has updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Cannot update service", error);
    return res.json({
      errro: "Cannot update service",
    });
  }
};
export const deleteService = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const userRole = req.user?.role?.toLowerCase();
    const existedService = await db.query.services.findFirst({
      where: eq(services.id, id as string),
    });
    if (!existedService) {
      return res.status(404).json({
        error: "Cannot find service",
      });
    }
    if (
      existedService.userId !== userId &&
      userRole !== "admin" &&
      userRole !== "superadmin"
    ) {
      return res.status(403).json({
        error: "Forbidden . Cannot delete this service",
      });
    }
    const [deletedService] = await db
      .delete(services)
      .where(eq(services.id, id as string))
      .returning();

    return res.json({
      message: "The service has deleted successfully",
      deletedService,
    });
  } catch (error) {
    console.error("Cannot delete service", error);
    return res.json({
      errro: "Cannot delete service",
    });
  }
};
