import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "./api";

describe("api service", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("resolves with the parsed JSON body on success", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 200 }),
    );

    await expect(api.get("/leave-requests/1")).resolves.toEqual({ id: 1 });
  });

  it("throws an ApiError instead of silently succeeding when the response is not ok", async () => {
    // A Response body can only be read once, and the request() implementation
    // reads it to extract the error message - so each call needs its own
    // fresh Response instance rather than reusing one via mockResolvedValue.
    const makeErrorResponse = () =>
      new Response(JSON.stringify({ message: "Leave request not found" }), { status: 404 });
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(async () => makeErrorResponse());

    await expect(api.get("/leave-requests/999")).rejects.toBeInstanceOf(ApiError);
    await expect(api.get("/leave-requests/999")).rejects.toThrow("Leave request not found");
  });

  it("throws an ApiError instead of silently succeeding when fetch rejects (network failure)", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(api.get("/leave-requests/1")).rejects.toBeInstanceOf(ApiError);
    await expect(api.get("/leave-requests/1")).rejects.toThrow(/Could not reach the server/);
  });

  it("sends a JSON body on post", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(new Response(null, { status: 204 }));

    await api.post("/leave-requests", { leaveType: "ANNUAL" });

    const [, requestInit] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(requestInit.method).toBe("POST");
    expect(requestInit.body).toBe(JSON.stringify({ leaveType: "ANNUAL" }));
  });
});
