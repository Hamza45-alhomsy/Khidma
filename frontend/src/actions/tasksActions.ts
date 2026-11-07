"use server";
import { revalidatePath } from "next/cache";
import { getServerApiClient } from "../lib/api/apiClient";
import { TaskPayload } from "@/types/task";
export async function getAllTasksAction() {
  try {
    const api = await getServerApiClient();
    const response = await api.get("/tasks/all");
    return response.data.tasks || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error: err.response?.data?.error || err.error || "Failed to create task",
    };
  }
}

// 2. Get SingleTasks Action
export async function geTasksByIdAction(id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.get(`/tasks/${id}`);
    return response.data.task;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error: err.response?.data?.error || err.error || "Failed to create task",
    };
  }
}

// 3. CreateTasks Action (With Cache Revalidation)
export async function creatTasksAction(data: TaskPayload) {
  try {
    const api = await getServerApiClient();
    const response = await api.post("/tasks", data);

    // Revalidate the task listing route
    revalidatePath("/[lang]/tasks", "page");
    return { success: true, task: response.data.task };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error: err.response?.data?.error || err.error || "Failed to create task",
    };
  }
}
export async function updateTaskAction(data: TaskPayload, id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.put(`/tasks/${id}`, data);
    return { success: true, task: response.data.task };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };
    return {
      success: false,
      error: err.response?.data?.error || err.error || "Failed to update task",
    };
  }
}

export async function deleteTaskAction(id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.delete(`/tasks/${id}`);
    return { success: true, error: response.data.error };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };
    return {
      success: false,
      error: err.response?.data?.error || err.error || "Failed to delete task",
    };
  }
}
