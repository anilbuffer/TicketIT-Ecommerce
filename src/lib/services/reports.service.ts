// src/lib/services/reports.service.ts
import { getDataSource } from '@/lib/data-source';
import type { MonthlyBillingReport, DashboardKPIs } from './types';

export async function getMonthlyBillingReport(period = 'August 2026'): Promise<MonthlyBillingReport> {
  const ds = getDataSource();
  return ds.reports.getMonthlyBillingReport(period);
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const ds = getDataSource();
  return ds.reports.getDashboardKPIs();
}
