// src/app/admin/customers/users/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, Plus, Search, Shield, Building2, MapPin, Mail } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useUsers, useSites, useAccountMutations } from '@/lib/hooks/useAccounts';
import type { PortalUser } from '@/lib/services/types';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: usersData, isLoading, refetch } = useUsers({ search: searchQuery });
  const { data: sitesData } = useSites();
  const { createUser } = useAccountMutations();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<PortalUser['role']>('SITE_USER');
  const [siteId, setSiteId] = useState('');
  const [department, setDepartment] = useState('');
  const [monthlyBudgetCap, setMonthlyBudgetCap] = useState(15000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const site = sitesData?.items.find((s) => s.id === siteId);

    setIsSubmitting(true);
    try {
      await createUser({
        name,
        email,
        role,
        siteId: siteId || undefined,
        siteCode: site?.code,
        siteName: site?.name,
        accountId: site?.accountId,
        accountName: site?.accountName,
        department: department || 'Store Operations',
        monthlyBudgetCap: Number(monthlyBudgetCap),
        status: 'ACTIVE',
      });
      setName('');
      setEmail('');
      setIsAdding(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="User Access & Role Management"
        subtitle="Provision portal accounts, assign RBAC permissions, and set monthly budget caps"
        actionButton={
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#F73582',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Plus size={16} />
            <span>{isAdding ? 'Cancel' : 'Invite New User'}</span>
          </button>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {isAdding && (
          <form
            onSubmit={handleCreate}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(247, 53, 130, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
              Provision New Portal User
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="marcus.vance@sydney-flagship.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Assigned Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value="ADMIN">Admin (Full Operations HQ)</option>
                  <option value="HEAD_OFFICE">Head Office (Consolidated Multi-Site View)</option>
                  <option value="SITE_USER">Site User (Branch Marketing & Orders)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Assigned Site Branch
                </label>
                <select
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value="">None / Global HQ</option>
                  {sitesData?.items.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Monthly Budget Cap ($)
                </label>
                <input
                  type="number"
                  value={monthlyBudgetCap}
                  onChange={(e) => setMonthlyBudgetCap(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: '#F73582', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700 }}
              >
                {isSubmitting ? 'Saving...' : 'Send Access Invite'}
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
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
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading user directory...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>User Profile</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Role</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Branch & Org</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Department</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Budget Cap</th>
                  <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.items.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#2B253E',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {u.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#2B253E' }}>{u.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor:
                            u.role === 'ADMIN'
                              ? '#FFF0F6'
                              : u.role === 'HEAD_OFFICE'
                              ? '#EAF8EF'
                              : '#FEF3C7',
                          color:
                            u.role === 'ADMIN'
                              ? '#F73582'
                              : u.role === 'HEAD_OFFICE'
                              ? '#10B981'
                              : '#D97706',
                        }}
                      >
                        {u.role === 'ADMIN' ? 'Admin (Operations HQ)' : u.role === 'HEAD_OFFICE' ? 'Head Office' : 'Site User'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#2B253E', fontWeight: 600 }}>
                      <div>{u.siteName || 'Global Platform'}</div>
                      {u.siteCode && <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>{u.siteCode}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B' }}>
                      {u.department || 'Operations'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#2B253E' }}>
                      {u.monthlyBudgetCap ? `$${u.monthlyBudgetCap.toLocaleString()}` : 'Unlimited'}
                    </td>
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      <StatusPill status={u.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
