import { api } from "../services/api";
import { useAsync } from "../hooks/useAsync";
import AsyncState from "../components/common/AsyncState";
import type { LeaveBalance, LeaveRequest } from "../types/leave";

interface DashboardData {
  balances: LeaveBalance[];
  myRequests: LeaveRequest[];
}

async function loadDashboard(): Promise<DashboardData> {
  const [balances, myRequests] = await Promise.all([
    api.get<LeaveBalance[]>("/leave/balance/my-balances"),
    api.get<LeaveRequest[]>("/leave-requests/my-requests"),
  ]);
  return { balances, myRequests };
}

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="card p-4">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const { data, error, isLoading, reload } = useAsync(loadDashboard, []);

  const totalBalance = data?.balances.reduce((sum, b) => sum + b.balance, 0) ?? 0;
  const pendingCount = data?.myRequests.filter((r) => r.status === "PENDING").length ?? 0;
  const approvedCount = data?.myRequests.filter((r) => r.status === "APPROVED").length ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>

      <AsyncState isLoading={isLoading} error={error} loadingLabel="Loading your overview..." onRetry={reload} />

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total leave balance" value={`${totalBalance.toFixed(1)} days`} />
          <StatCard label="Pending requests" value={pendingCount} />
          <StatCard label="Approved requests" value={approvedCount} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
