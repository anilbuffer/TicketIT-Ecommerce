// src/app/admin/customers/accounts/page.tsx
'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, MapPin, Percent, DollarSign, Mail, Phone } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useAccounts, useAccountMutations } from '@/lib/hooks/useAccounts';
import type { Account } from '@/lib/services/types';

export default function CustomerAccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: accountsData, isLoading, refetch } = useAccounts({ search: searchQuery });
  const { createAccount } = useAccountMutations();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !accountCode || !contactEmail) return;
    setIsSubmitting(true);
    try {
      await createAccount({
        name,
        accountCode,
        status: 'ACTIVE',
        contactEmail,
        contactPhone,
      });
      setName('');
      setAccountCode('');
      setContactEmail('');
      setContactPhone('');
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
        title="Customer Accounts"
        subtitle="Manage healthcare networks, dispensary groups, and client commercial profiles"
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
            <span>{isAdding ? 'Cancel' : 'New Account'}</span>
          </button>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Add Account Modal / Form Card */}
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
              Create New Enterprise Healthcare Account
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Account / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude Healthcare Network"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Account Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STJUDE-005"
                  value={accountCode}
                  onChange={(e) => setAccountCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Procurement Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="procurement@organization.org"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
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
                {isSubmitting ? 'Saving...' : 'Register Account'}
              </button>
            </div>
          </form>
        )}

        {/* Filter / Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(43, 37, 62, 0.04)',
          }}
        >
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search accounts by name or account code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Accounts Table */}
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
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading accounts...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Account Name</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Account Code</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Sites Count</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Active Rate Card</th>
                  <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Monthly Spend</th>
                  <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {accountsData?.items.map((acc) => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 24px', fontWeight: 700, color: '#2B253E' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Building2 size={16} color="#2B253E" />
                        </div>
                        <div>
                          <div>{acc.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>{acc.contactEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#475569', fontSize: '0.8rem' }}>
                      {acc.accountCode}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#2B253E' }}>
                      {acc.sitesCount || 0} Branches
                    </td>
                    <td style={{ padding: '14px 16px', color: '#F73582', fontWeight: 600 }}>
                      {acc.activeRateCardName || 'Standard Baseline'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#2B253E' }}>
                      ${(acc.totalMonthlySpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      <StatusPill status={acc.status} />
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
