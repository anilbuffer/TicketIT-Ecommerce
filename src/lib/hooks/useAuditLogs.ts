// src/lib/hooks/useAuditLogs.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, logAuditEvent } from '@/lib/services/auditLog.service';
import type { AuditLogEntry, PaginatedResult } from '@/lib/services/types';

export function useAuditLogs(params?: Parameters<typeof getAuditLogs>[0]) {
  const [data, setData] = useState<PaginatedResult<AuditLogEntry> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAuditLogs(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return { data, isLoading, error, refetch: fetchAuditLogs, logAuditEvent };
}
