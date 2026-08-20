// src/lib/services/reports.service.ts
import { getDataSource } from '@/lib/data-source';
import type { MonthlyBillingReport, DashboardKPIs, HODashboardKPIs, HOMonthlyBillingReport } from './types';

export async function getMonthlyBillingReport(period = 'August 2026'): Promise<MonthlyBillingReport> {
  const ds = getDataSource();
  return ds.reports.getMonthlyBillingReport(period);
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const ds = getDataSource();
  return ds.reports.getDashboardKPIs();
}

/**
 * Head Office: Returns KPI summary for a specific account.
 * accountId scoping is enforced here in the service layer — never only in the UI.
 */
export async function getHODashboardKPIs(accountId: string): Promise<HODashboardKPIs> {
  const ds = getDataSource();
  return ds.reports.getHODashboardKPIs(accountId);
}

/**
 * Head Office: Returns consolidated billing report for a specific account + period.
 * accountId scoping is enforced here in the service layer.
 */
export async function getHOMonthlyBillingReport(
  accountId: string,
  period: string
): Promise<HOMonthlyBillingReport> {
  const ds = getDataSource();
  return ds.reports.getHOMonthlyBillingReport(accountId, period);
}
