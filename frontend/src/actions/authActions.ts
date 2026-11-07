"use server";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { clearSessionToken, setSessionToken } from "@/lib/auth/session";
import { getServerApiClient } from "@/lib/api/apiClient";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export const register = async (
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> => {
  const lang = (formData.get("lang") as string) || "ar";
  try {
    const rawData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      city: formData.get("city") || undefined, // convert empty string to undefined for optional field
    };
    const validationResult = registerSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const api = await getServerApiClient();
    const response = await api.post("/auth/register", validationResult.data);
    const token = response.data?.token as string;
    if (typeof token === "string" && token.length > 0) {
      await setSessionToken(token);
    } else {
      console.error("Received invalid token structure:", response.data);
      return {
        success: false,
        message: `Invalid token type received from backend. Expected string, got: ${typeof token}`,
      };
    }
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Registration failed. Email or phone may already be registered.",
    };
  }
  redirect(`/${lang}/services`);
};
export const login = async (
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> => {
  const lang = (formData.get("lang") as string) || "ar";

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validationResult = loginSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
      message: "Please fill in all required fields correctly.",
    };
  }

  let isSuccess = false;

  try {
    const api = await getServerApiClient();
    const response = await api.post("/auth/login", validationResult.data);

    const { token } = response.data as { token: string };

    if (typeof token === "string" && token.length > 0) {
      await setSessionToken(token);
      isSuccess = true;
    } else {
      console.error(
        "[loginAction] Received invalid token structure:",
        response.data,
      );
      return {
        success: false,
        message: `Invalid token type received from backend. Expected string, got: ${typeof token}`,
      };
    }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const response = (
        error as {
          response?: {
            data?: { message?: string; error?: string };
          };
        }
      ).response;

      return {
        success: false,
        message:
          response?.data?.message ||
          response?.data?.error ||
          "Login failed. Please check your credentials.",
      };
    }

    return {
      success: false,
      message: "Unable to connect to the authentication server.",
    };
  }

  // Perform redirect outside try...catch
  if (isSuccess) {
    console.log(`[loginAction] Navigating to /${lang}/services...`);
    redirect(`/${lang}/services`);
  }

  return { success: false, message: "An unexpected error occurred." };
};
export async function logout(lang: string) {
  try {
    const api = await getServerApiClient();
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout request failed", error);
  } finally {
    await clearSessionToken();
  }
  redirect(`/${lang}`);
}
