import { describe, expect, it } from "vitest";
import { validateLeaveRequest } from "./validateLeaveRequest";

const validValues = {
  leaveType: "ANNUAL",
  startDate: "2026-01-10",
  endDate: "2026-01-12",
  reason: "Family trip",
};

describe("validateLeaveRequest", () => {
  it("returns no errors for a fully valid request", () => {
    expect(validateLeaveRequest(validValues)).toEqual({});
  });

  it("requires a leave type", () => {
    const errors = validateLeaveRequest({ ...validValues, leaveType: "" });
    expect(errors.leaveType).toBeDefined();
  });

  it("requires a start and end date", () => {
    const errors = validateLeaveRequest({ ...validValues, startDate: "", endDate: "" });
    expect(errors.startDate).toBeDefined();
    expect(errors.endDate).toBeDefined();
  });

  it("rejects an end date before the start date", () => {
    const errors = validateLeaveRequest({ ...validValues, startDate: "2026-02-10", endDate: "2026-02-05" });
    expect(errors.endDate).toMatch(/before the start date/);
  });

  it("allows the end date to equal the start date (single day leave)", () => {
    const errors = validateLeaveRequest({ ...validValues, startDate: "2026-02-10", endDate: "2026-02-10" });
    expect(errors.endDate).toBeUndefined();
  });

  it("requires a non-empty, meaningful reason", () => {
    expect(validateLeaveRequest({ ...validValues, reason: "" }).reason).toBeDefined();
    expect(validateLeaveRequest({ ...validValues, reason: "   " }).reason).toBeDefined();
    expect(validateLeaveRequest({ ...validValues, reason: "ok" }).reason).toBeDefined();
  });
});
