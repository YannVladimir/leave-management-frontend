import { useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../services/api";
import { LEAVE_TYPE_LABELS, type LeaveType } from "../types/leave";
import {
  validateLeaveRequest,
  type LeaveRequestFormErrors,
  type LeaveRequestFormValues,
} from "../utils/validateLeaveRequest";

const EMPTY_FORM: LeaveRequestFormValues = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

const ApplyLeave = () => {
  const [values, setValues] = useState<LeaveRequestFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<LeaveRequestFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange =
    (field: keyof LeaveRequestFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    const validationErrors = validateLeaveRequest(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/leave-requests", {
        leaveType: values.leaveType,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason.trim(),
      });
      setSubmitSuccess(true);
      setValues(EMPTY_FORM);
    } catch (err) {
      // Surface the failure instead of pretending the request went through -
      // a form that resets and shows "success" after a failed submit would
      // leave the employee thinking their leave was requested when it wasn't.
      setSubmitError(err instanceof ApiError ? err.message : "Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveTypes = Object.keys(LEAVE_TYPE_LABELS) as LeaveType[];

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Apply for Leave</h1>

      <form className="card p-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Leave type
          </label>
          <select
            id="leaveType"
            className="input-field mt-1"
            value={values.leaveType}
            onChange={handleChange("leaveType")}
          >
            <option value="">Select a leave type</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {LEAVE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.leaveType && <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Start date
            </label>
            <input
              id="startDate"
              type="date"
              className="input-field mt-1"
              value={values.startDate}
              onChange={handleChange("startDate")}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              End date
            </label>
            <input
              id="endDate"
              type="date"
              className="input-field mt-1"
              value={values.endDate}
              onChange={handleChange("endDate")}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Reason
          </label>
          <textarea
            id="reason"
            rows={4}
            className="input-field mt-1"
            value={values.reason}
            onChange={handleChange("reason")}
          />
          {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
        </div>

        {submitError && (
          <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3 dark:bg-green-950 dark:border-green-900 dark:text-green-300">
            Leave request submitted successfully.
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
