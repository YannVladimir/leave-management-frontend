export interface LeaveRequestFormValues {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export type LeaveRequestFormErrors = Partial<Record<keyof LeaveRequestFormValues, string>>;

/**
 * Pure validation for the Apply Leave form. Kept separate from the
 * component so it can be unit tested without rendering React, and so the
 * same rules can't silently drift between "what the form checks" and
 * "what we actually submit".
 */
export function validateLeaveRequest(values: LeaveRequestFormValues): LeaveRequestFormErrors {
  const errors: LeaveRequestFormErrors = {};

  if (!values.leaveType) {
    errors.leaveType = "Select a leave type.";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required.";
  }

  if (values.startDate && values.endDate && values.endDate < values.startDate) {
    errors.endDate = "End date cannot be before the start date.";
  }

  if (!values.reason.trim()) {
    errors.reason = "Please provide a reason for this leave request.";
  } else if (values.reason.trim().length < 5) {
    errors.reason = "Reason must be at least 5 characters.";
  }

  return errors;
}
