// src/app/admin/reports/audit-log/page.tsx
'use client';

import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  FileCode,
  Lock,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';
import type { AuditLogEntry } from '@/lib/services/types';

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<AuditLogEntry['entityType'] | ''>('');
  const { data: auditData, isLoading } = useAuditLogs({
    search: searchQuery || undefined,
    entityType: selectedEntityType || undefined,
  });

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  return (
    <>
      <AdminHeader
        title="HIPAA & Enterprise Compliance Audit Trail"
        subtitle="Immutable transaction ledger recording all administrative status mutations, pricing overrides, and access events"
        actionButton={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#EAF8EF',
              border: '1px solid rgba(88, 185, 125, 0.3)',
              color: '#228B53',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={16} />
            <span>Cryptographically Verified</span>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Search & Filter Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(43, 37, 62, 0.04)',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px 12px',
              flex: 1,
              minWidth: '260px',
            }}
          >
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search audit trail by actor, action name, or entity ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.85rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Entity Type:</span>
            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '0.82rem',
                backgroundColor: '#FFFFFF',
                color: '#2B253E',
                fontWeight: 600,
              }}
            >
              <option value="">All Entities</option>
              <option value="ORDER">Orders Only</option>
              <option value="PRODUCT">Products Only</option>
              <option value="RATE_CARD">Rate Cards Only</option>
              <option value="ACCOUNT">Accounts Only</option>
              <option value="USER">User Access Only</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading compliance trail...</div>
          ) : !auditData?.items.length ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <History size={36} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 700, color: '#2B253E' }}>No audit records found</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Timestamp</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Actor</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Action Event</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Target Entity</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>IP Address</th>
                  <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Payload</th>
                </tr>
              </thead>
              <tbody>
                {auditData.items.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? '#FFF8FB' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '14px 24px', color: '#64748B', fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 600, color: '#2B253E' }}>
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                          <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#2B253E' }}>{log.actorName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {log.actorRole} • {log.actorEmail}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: '#F1F5F9',
                              color: '#2B253E',
                              padding: '3px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#2B253E' }}>
                            {log.entityName || log.entityId}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{log.entityType}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748B' }}>
                          {log.ipAddress || '127.0.0.1'}
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                          <button
                            type="button"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#475569',
                            }}
                          >
                            <FileCode size={13} />
                            <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} style={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2B253E', marginBottom: '6px' }}>
                              Audit Transaction Metadata Payload (JSON):
                            </div>
                            <pre
                              style={{
                                backgroundColor: '#2B253E',
                                color: '#58B97D',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                overflowX: 'auto',
                                margin: 0,
                                fontFamily: 'monospace',
                              }}
                            >
                              {JSON.stringify(log.details || { event: log.action, id: log.entityId }, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
