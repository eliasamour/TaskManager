import { config } from "./config";
import { getToken } from "./auth";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${config.API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const payload = isJson ? await res.json() : await res.text();
    throw new Error(typeof payload === "string" ? payload : payload.error ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return (isJson ? await res.json() : await res.text()) as T;
}
