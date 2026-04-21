/**
 * Authenticated API client for frontend → backend calls.
 * Automatically attaches the JWT Bearer token from localStorage.
 */

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; error?: string }> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }

  return json;
}
