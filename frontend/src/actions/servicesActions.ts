"use server";
import { revalidatePath } from "next/cache";
import { getServerApiClient } from "../lib/api/apiClient";
import { ServicePayload } from "@/types/service";
export async function getAllServicesAction() {
  try {
    const api = await getServerApiClient();
    const response = await api.get("/services/all");
    return response.data.services || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.error || err.error || "Failed to get all services",
    };
  }
}

// 2. Get Single Service Action
export async function getServiceByIdAction(id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.get(`/services/${id}`);
    return response.data.service;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error: err.response?.data?.error || err.error || "Failed to get service",
    };
  }
}

// 3. Create Service Action (With Cache Revalidation)
export async function createServiceAction(data: ServicePayload) {
  try {
    const api = await getServerApiClient();
    const response = await api.post("/services", data);

    // Revalidate the service listing route
    revalidatePath("/[lang]/services", "page");
    return { success: true, service: response.data.service };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.error || err.error || "Failed to create service",
    };
  }
}
export async function getUserServicesAction() {
  try {
    const api = await getServerApiClient();
    const response = await api.get("/services");
    return response.data.services || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.error || err.error || "Failed to get user services",
    };
  }
}

export async function updateServiceAction(data: ServicePayload, id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.put(`/services/${id}`, data);
    return response.data.service || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };

    return {
      success: false,
      error:
        err.response?.data?.error || err.error || "Failed to update service",
    };
  }
}
export async function deleteServiceAction(id: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.delete(`/services/${id}`);
    return response.data.service || [];
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: string } };
      error?: string;
    };
    return {
      success: false,
      error:
        err.response?.data?.error || err.error || "Failed to delete service",
    };
  }
}
