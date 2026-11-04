import { api } from "../services/api";
import { useAsync } from "../hooks/useAsync";
import AsyncState from "../components/common/AsyncState";
import { LEAVE_TYPE_LABELS, type LeaveBalance as LeaveBalanceEntry } from "../types/leave";

const LeaveBalance = () => {
  const { data, error, isLoading, reload } = useAsync(
    () => api.get<LeaveBalanceEntry[]>("/leave/balance/my-balances"),
    [],
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Leave Balance</h1>

      <AsyncState isLoading={isLoading} error={error} loadingLabel="Loading your leave balances..." onRetry={reload} />

      {data && (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Leave type</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Used</th>
                <th className="px-4 py-3">Accrued</th>
                <th className="px-4 py-3">Carried forward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No leave balances found for this year.
                  </td>
                </tr>
              )}
              {data.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {LEAVE_TYPE_LABELS[entry.leaveType]}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {entry.balance.toFixed(1)} days
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {entry.usedDays.toFixed(1)} days
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {entry.totalAccrued.toFixed(1)} days
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {entry.carriedForward.toFixed(1)} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveBalance;
