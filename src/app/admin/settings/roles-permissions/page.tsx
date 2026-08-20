// src/app/admin/settings/roles-permissions/page.tsx
'use client';

import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ROLE_PERMISSIONS, Permission } from '@/lib/auth/rbac';
import type { UserRole } from '@/lib/services/types';

export default function RolesPermissionsPage() {
  const permissionsList: { id: Permission; label: string; desc: string }[] = [
    { id: 'VIEW_DASHBOARD', label: 'View Operational Dashboard', desc: 'Access high-level analytics, revenue figures, and KPIs' },
    { id: 'MANAGE_CATALOGUE', label: 'Manage Product Catalogue & Pricing', desc: 'Add, update, or archive collateral SKUs and base prices' },
    { id: 'VIEW_CATALOGUE', label: 'Browse Catalogue & Assets', desc: 'View available marketing and logistics materials' },
    { id: 'MANAGE_ACCOUNTS', label: 'Manage Customer Accounts & Sites', desc: 'Register healthcare groups, dispensary sites, and branch addresses' },
    { id: 'VIEW_ACCOUNTS', label: 'View Organization Hierarchy', desc: 'Read-only directory of accounts and branches' },
    { id: 'MANAGE_RATE_CARDS', label: 'Configure Commercial Rate Cards', desc: 'Create custom contract tier pricing and discount matrices' },
    { id: 'MANAGE_ALL_ORDERS', label: 'Manage All Orders Across Sites', desc: 'Access full line item detail and customer requisition orders' },
    { id: 'UPDATE_ORDER_STATUS', label: 'Execute Order Status Transitions', desc: 'Move orders between Received, Processing, Dispatched, and Delivered' },
    { id: 'VIEW_SITE_ORDERS', label: 'View Branch Order History', desc: 'Inspect requisitions belonging to the active site branch' },
    { id: 'PLACE_ORDER', label: 'Place New Branch Requisitions', desc: 'Build baskets, enter PO references, and submit collateral orders' },
    { id: 'VIEW_CONSOLIDATED_BILLING', label: 'View Multi-Site Consolidated Billing', desc: 'Access consolidated invoice breakdowns feeding monthly reporting' },
    { id: 'EXPORT_REPORTS', label: 'Export Reports (CSV, XLSX, PDF)', desc: 'Download raw accounting data and statement slips' },
    { id: 'VIEW_AUDIT_TRAIL', label: 'View HIPAA Compliance Audit Logs', desc: 'Inspect immutable ledger of system actions and payload metadata' },
    { id: 'MANAGE_SETTINGS', label: 'Configure System Architecture & RBAC', desc: 'Modify global platform flags and PO verification rules' },
  ];

  const roles: { id: UserRole; title: string; subtitle: string; color: string; bg: string }[] = [
    { id: 'ADMIN', title: 'Super Admin', subtitle: 'Platform HQ Operations', color: '#F73582', bg: '#FFF0F6' },
    { id: 'HEAD_OFFICE', title: 'Head Office / Driver', subtitle: 'Logistics Fleet & Accounting', color: '#10B981', bg: '#EAF8EF' },
    { id: 'SITE_USER', title: 'Site User', subtitle: 'Pharmacy Dispensing Hub', color: '#D97706', bg: '#FEF3C7' },
  ];

  return (
    <>
      <AdminHeader
        title="Role-Based Access Control (RBAC) Matrix"
        subtitle="Granular permission governance defining operational capabilities for Super Admin, Head Office, and Site Users"
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: 700, width: '45%' }}>
                  Platform Capability / Permission
                </th>
                {roles.map((r) => (
                  <th key={r.id} style={{ padding: '16px 20px', textAlign: 'center', width: '18%' }}>
                    <div style={{ fontWeight: 800, color: '#2B253E' }}>{r.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{r.subtitle}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionsList.map((perm, idx) => (
                <tr key={perm.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ fontWeight: 700, color: '#2B253E' }}>{perm.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{perm.desc}</div>
                  </td>
                  {roles.map((r) => {
                    const hasAccess = ROLE_PERMISSIONS[r.id].includes(perm.id);
                    return (
                      <td key={r.id} style={{ padding: '14px 20px', textAlign: 'center' }}>
                        {hasAccess ? (
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: r.bg,
                              color: r.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={16} strokeWidth={3} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: '#F1F5F9',
                              color: '#CBD5E1',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <X size={16} strokeWidth={2} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
