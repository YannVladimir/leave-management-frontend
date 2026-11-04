import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ApplyLeave from "./ApplyLeave";
import { api, ApiError } from "../services/api";

vi.mock("../services/api", async () => {
  const actual = await vi.importActual<typeof import("../services/api")>("../services/api");
  return {
    ...actual,
    api: { ...actual.api, post: vi.fn() },
  };
});

describe("ApplyLeave", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors and does not call the API when the form is empty", async () => {
    const user = userEvent.setup();
    render(<ApplyLeave />);

    await user.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByText(/select a leave type\./i)).toBeInTheDocument();
    expect(screen.getByText(/please provide a reason/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("submits the request and shows a success message on a valid submission", async () => {
    vi.mocked(api.post).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ApplyLeave />);

    await user.selectOptions(screen.getByLabelText(/leave type/i), "ANNUAL");
    await user.type(screen.getByLabelText(/start date/i), "2026-01-10");
    await user.type(screen.getByLabelText(/end date/i), "2026-01-12");
    await user.type(screen.getByLabelText(/reason/i), "Family trip");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByText(/submitted successfully/i)).toBeInTheDocument();
    expect(api.post).toHaveBeenCalledWith("/leave-requests", {
      leaveType: "ANNUAL",
      startDate: "2026-01-10",
      endDate: "2026-01-12",
      reason: "Family trip",
    });
  });

  it("shows the API error and does NOT show a success message when the submission fails", async () => {
    vi.mocked(api.post).mockRejectedValue(new ApiError("Backend unreachable", 0));
    const user = userEvent.setup();
    render(<ApplyLeave />);

    await user.selectOptions(screen.getByLabelText(/leave type/i), "ANNUAL");
    await user.type(screen.getByLabelText(/start date/i), "2026-01-10");
    await user.type(screen.getByLabelText(/end date/i), "2026-01-12");
    await user.type(screen.getByLabelText(/reason/i), "Family trip");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    expect(await screen.findByText(/backend unreachable/i)).toBeInTheDocument();
    expect(screen.queryByText(/submitted successfully/i)).not.toBeInTheDocument();
  });
});
