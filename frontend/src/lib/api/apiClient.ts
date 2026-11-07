import axios from "axios";
import { cookies } from "next/headers";

export async function getServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("khidma_token")?.value;

  return axios.create({
    baseURL: process.env.EXPRESS_API_URL || "http://localhost:3001/api",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
