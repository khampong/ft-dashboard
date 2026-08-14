export type ForkliftStatus = 'NORMAL' | 'WARNING' | 'OVERDUE';
export type FuelType = 'GAS' | 'DIESEL' | 'ELECTRIC';
export type JobType = 'OIL_CHANGE' | 'ENGINE_REPAIR' | 'TOWING' | 'PARTS_REPLACEMENT' | 'INSPECTION' | 'OTHER';
export type JobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type AlertStatus = 'PENDING' | 'SENT' | 'ACKNOWLEDGED';

export interface DashboardStats {
  totalCustomers: number;
  totalForklifts: number;
  overdueCount: number;
  warningCount: number;
  pendingAlerts: number;
}
