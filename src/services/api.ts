// Base URL of the leave-management-api backend. Configurable via the
// VITE_API_BASE_URL environment variable (see .env.example) so the same
// build can point at a local backend, staging, or production without a
// code change. Falls back to the default local dev port of the API.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8083/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      ...init,
    });
  } catch (networkError) {
    // Network failures (API down, CORS, offline, ...) must surface to the
    // caller instead of being swallowed - callers rely on this throwing so
    // the UI can show a real error state rather than a false "success".
    const reason =
      networkError instanceof Error ? networkError.message : "Network error";
    throw new ApiError(`Could not reach the server: ${reason}`, 0);
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // Response had no JSON body - fall back to the status text above.
    }
    throw new ApiError(message || `Request failed (${response.status})`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};

export { API_BASE_URL };
