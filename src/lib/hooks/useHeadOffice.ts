// src/lib/hooks/useHeadOffice.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getHODashboardKPIs, getHOMonthlyBillingReport } from '@/lib/services/reports.service';
import type { HODashboardKPIs, HOMonthlyBillingReport } from '@/lib/services/types';

/**
 * Hook to fetch Head Office dashboard KPIs, scoped server-side to accountId.
 */
export function useHODashboardKPIs(accountId: string) {
  const [data, setData] = useState<HODashboardKPIs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKPIs = useCallback(async () => {
    if (!accountId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getHODashboardKPIs(accountId);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  return { data, isLoading, error, refetch: fetchKPIs };
}

/**
 * Hook to generate/fetch Head Office monthly billing report.
 * accountId scoping is enforced in the service layer, not here.
 */
export function useHOMonthlyBillingReport(accountId: string, period: string) {
  const [data, setData] = useState<HOMonthlyBillingReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReport = useCallback(async () => {
    if (!accountId || !period) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getHOMonthlyBillingReport(accountId, period);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [accountId, period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, isLoading, error, refetch: fetchReport };
}
