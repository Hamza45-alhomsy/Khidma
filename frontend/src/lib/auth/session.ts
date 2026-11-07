// src/lib/auth/session.ts
import { cookies } from "next/headers";

const TOKEN_KEY = "khidma_token";

/**
 * Save JWT token into an HTTP-Only secure cookie
 */
export async function setSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true, // Prevents client-side JS (XSS) from reading the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // Protects against CSRF while allowing standard navigation
    path: "/", // Available across all routes
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Retrieve the active session token on the server
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value;
}

/**
 * Delete the session cookie (Logout)
 */
export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}

/**
 * Check if the user has an active session token
 */
export async function hasSession(): Promise<boolean> {
  const token = await getSessionToken();
  return Boolean(token);
}
