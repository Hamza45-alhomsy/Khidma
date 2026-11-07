"use server";
import { revalidatePath } from "next/cache";
import { getServerApiClient } from "../lib/api/apiClient";
import { type CategoryPayload } from "@/types/category";
export async function getAllCategoriesAction() {
  try {
    const api = await getServerApiClient();
    const response = await api.get("/categories");
    return response.data.categories || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to create category",
    };
  }
}

// 2. Get Single category Action
export async function getCategoryByIdAction(id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.get(`/categories/${id}`);
    return response.data.categories;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to create category",
    };
  }
}

// 3. Create category Action (With Cache Revalidation)
export async function createCategoryAction(data: CategoryPayload) {
  try {
    const api = await getServerApiClient();
    const response = await api.post("/categories", data);

    // Revalidate the category listing route
    revalidatePath("/[lang]/categories", "page");
    return { success: true, category: response.data.categories };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to create category",
    };
  }
}
export async function updateCategoryAction(data: CategoryPayload, id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.put(`/categories/${id}`, data);
    return { success: true, category: response.data.categories };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to update category",
    };
  }
}
export async function deleteCategoryAction(id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.delete(`/categories/${id}`);
    return { success: true, category: response.data.categories };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to delete category",
    };
  }
}
export async function getLandingCategoriesAction() {
  try {
    const api = await getServerApiClient();
    const response = await api.get("/categories/landing");

    return response.data.categories || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch landing categories",
    };
  }
}
export async function updateLandingCategoriesAction(categoryIds: string[]) {
  try {
    const api = await getServerApiClient();

    const response = await api.put("/categories/landing", {
      categoryIds,
    });

    revalidatePath("/[lang]", "page");

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update landing categories",
    };
  }
}
