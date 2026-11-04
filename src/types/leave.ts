export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "MATERNITY"
  | "PATERNITY"
  | "BEREAVEMENT"
  | "UNPAID";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: "Annual Leave",
  SICK: "Sick Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  BEREAVEMENT: "Bereavement Leave",
  UNPAID: "Unpaid Leave",
};

export type LeaveRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveRequest {
  id: number;
  userId: number;
  userFullName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: number;
  userId: number;
  userFullName: string;
  leaveType: LeaveType;
  balance: number;
  totalAccrued: number;
  usedDays: number;
  carriedForward: number;
  year: number;
}

export interface Holiday {
  id: number;
  name: string;
  date: string;
  recurringAnnually: boolean;
}

export interface UserRole {
  userId: number;
  fullName: string;
  email: string;
  roles: string[];
}
