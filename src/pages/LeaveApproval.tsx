import { useState } from "react";
import { api, ApiError } from "../services/api";
import { useAsync } from "../hooks/useAsync";
import AsyncState from "../components/common/AsyncState";
import { LEAVE_TYPE_LABELS, type LeaveRequest } from "../types/leave";

const LeaveApproval = () => {
  const { data, error, isLoading, reload } = useAsync(
    () => api.get<LeaveRequest[]>("/leave-requests/team"),
    [],
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<number | null>(null);

  const handleDecision = async (id: number, decision: "approve" | "reject") => {
    setActionError(null);
    setPendingActionId(id);
    try {
      await api.put(`/leave-requests/${id}/${decision}`);
      // Only reflect the change once the API has confirmed it - reloading
      // from the server (rather than optimistically patching local state)
      // guarantees the list never shows a decision that didn't actually
      // take effect on the backend.
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? `Could not ${decision} this request: ${err.message}`
          : `Could not ${decision} this request.`,
      );
    } finally {
      setPendingActionId(null);
    }
  };

  const pendingRequests = (data ?? []).filter((request) => request.status === "PENDING");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Leave Approval</h1>

      <AsyncState isLoading={isLoading} error={error} loadingLabel="Loading team requests..." onRetry={reload} />

      {actionError && (
        <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
          {actionError}
        </div>
      )}

      {data && (
        <div className="card divide-y divide-gray-200 dark:divide-gray-700">
          {pendingRequests.length === 0 && (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No pending requests from your team.</p>
          )}
          {pendingRequests.map((request) => (
            <div key={request.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{request.userFullName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {LEAVE_TYPE_LABELS[request.leaveType]} · {request.startDate} to {request.endDate}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{request.reason}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={pendingActionId === request.id}
                  onClick={() => handleDecision(request.id, "approve")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={pendingActionId === request.id}
                  onClick={() => handleDecision(request.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
