import { api } from "../services/api";
import { useAsync } from "../hooks/useAsync";
import AsyncState from "../components/common/AsyncState";
import { LEAVE_TYPE_LABELS, type Holiday, type LeaveRequest } from "../types/leave";

interface CalendarData {
  teamLeave: LeaveRequest[];
  holidays: Holiday[];
}

function monthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toIso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toIso(start), end: toIso(end) };
}

async function loadCalendar(): Promise<CalendarData> {
  const { start, end } = monthRange();
  const [teamLeave, holidays] = await Promise.all([
    api.get<LeaveRequest[]>("/leave-requests/team"),
    api.get<Holiday[]>(`/holidays/between?start=${start}&end=${end}`),
  ]);
  return { teamLeave, holidays };
}

const TeamCalendar = () => {
  const { data, error, isLoading, reload } = useAsync(loadCalendar, []);
  const approvedLeave = (data?.teamLeave ?? []).filter((r) => r.status === "APPROVED");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Team Calendar</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Approved team leave and public holidays this month.</p>

      <AsyncState isLoading={isLoading} error={error} loadingLabel="Loading calendar..." onRetry={reload} />

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h2 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Team on leave</h2>
            {approvedLeave.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No one on the team is away this month.</p>
            )}
            <ul className="space-y-2">
              {approvedLeave.map((request) => (
                <li key={request.id} className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-medium">{request.userFullName}</span> · {LEAVE_TYPE_LABELS[request.leaveType]}{" "}
                  ({request.startDate} to {request.endDate})
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4">
            <h2 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Public holidays</h2>
            {data.holidays.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No public holidays this month.</p>
            )}
            <ul className="space-y-2">
              {data.holidays.map((holiday) => (
                <li key={holiday.id} className="text-sm text-gray-700 dark:text-gray-200">
                  {holiday.date} · {holiday.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCalendar;
