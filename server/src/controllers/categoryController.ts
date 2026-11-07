import { categories, landingCategories } from "../db/schema";
import { db } from "../db/connection";
import { eq, asc, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categoriesList = await db.query.categories.findMany({
      orderBy: [asc(categories.nameAr)],
    });
    return res
      .status(200)
      .json({ message: "All categories list", categories: categoriesList });
  } catch (error) {
    console.error("error getting categories ", error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
};
export const getLandingCategories = async (_req: Request, res: Response) => {
  try {
    const selectedCategories = await db
      .select({
        id: categories.id,
        nameEn: categories.nameEn,
        nameAr: categories.nameAr,
        description: categories.description,
        icon: categories.icon,
        displayOrder: landingCategories.displayOrder,
      })
      .from(landingCategories)
      .innerJoin(categories, eq(landingCategories.categoryId, categories.id))
      .orderBy(asc(landingCategories.displayOrder));

    return res.status(200).json({
      categories: selectedCategories,
    });
  } catch (error) {
    console.error("Error getting landing categories", error);

    return res.status(500).json({
      error: "Failed to fetch landing categories",
    });
  }
};
export const updateLandingCategories = async (req: Request, res: Response) => {
  const { categoryIds } = req.body as { categoryIds: string[] };

  try {
    if (categoryIds.length > 8) {
      return res.status(400).json({
        error: "You can select at most 8 categories",
      });
    }

    const existingCategories = await db
      .select({ id: categories.id })
      .from(categories)
      .where(inArray(categories.id, categoryIds));

    if (existingCategories.length !== categoryIds.length) {
      return res.status(400).json({
        error: "One or more categories do not exist",
      });
    }

    await db.transaction(async (transaction) => {
      await transaction.delete(landingCategories);

      if (categoryIds.length > 0) {
        await transaction.insert(landingCategories).values(
          categoryIds.map((categoryId, index) => ({
            categoryId,
            displayOrder: index + 1,
          })),
        );
      }
    });

    return res.status(200).json({
      message: "Landing categories updated successfully",
      categoryIds,
    });
  } catch (error) {
    console.error("Error updating landing categories", error);

    return res.status(500).json({
      error: "Failed to update landing categories",
    });
  }
};
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id as string),
    });
    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }
    return res.status(200).json({
      message: "Here is your category ",
      category,
    });
  } catch (error) {
    console.error("Category not found", error);

    return res.status(500).json({
      message: "Cannot get category",
    });
  }
};
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { nameAr, nameEn, icon, description } = req.body;
    const newCategory = await db
      .insert(categories)
      .values({
        nameAr,
        nameEn,
        icon,
        description,
      })
      .returning();
    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("cannot create a new category", error);
    return res.status(501).json({ error: "cannot create a new category" });
  }
};
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameEn, nameAr, description, icon } = req.body;
    const [updatedCategory] = await db
      .update(categories)
      .set({
        nameEn,
        nameAr,
        description,
        icon,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id as string))
      .returning();

    if (!updatedCategory) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    return res.status(201).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("cannot update category", error);
    return res.status(501).json({ error: "cannot update category" });
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id as string))
      .returning();
    if (!deletedCategory) {
      return res.status(404).json({
        error: "Cannot find category",
      });
    }
    return res.status(201).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("cannot delete category", error);
    return res.status(501).json({ error: "cannot delete category" });
  }
};
