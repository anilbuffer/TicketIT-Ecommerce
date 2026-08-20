// src/lib/services/auditLog.service.ts
import { getDataSource } from '@/lib/data-source';
import type { AuditLogEntry, PaginatedResult } from './types';

export async function getAuditLogs(params?: {
  entityType?: AuditLogEntry['entityType'];
  actorRole?: AuditLogEntry['actorRole'];
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<AuditLogEntry>> {
  const ds = getDataSource();
  return ds.audit.list(params);
}

export async function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
  const ds = getDataSource();
  return ds.audit.log(entry);
}
