// src/lib/hooks/useReports.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMonthlyBillingReport, getDashboardKPIs } from '@/lib/services/reports.service';
import type { MonthlyBillingReport, DashboardKPIs } from '@/lib/services/types';

export function useMonthlyBillingReport(period = 'August 2026') {
  const [data, setData] = useState<MonthlyBillingReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMonthlyBillingReport(period);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, isLoading, error, refetch: fetchReport };
}

export function useDashboardKPIs() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKPIs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardKPIs();
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  return { data, isLoading, error, refetch: fetchKPIs };
}
