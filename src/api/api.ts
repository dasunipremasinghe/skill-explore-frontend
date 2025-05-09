export const API_BASE = "http://localhost:8080/api";

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("google_token");

  const headers: Record<string, string> = {
    ...options.headers,
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }

  // ✅ Safely handle empty responses (e.g., DELETE 204 No Content)
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
};

