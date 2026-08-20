// src/app/admin/customers/sites/page.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Search, Building2, ShoppingCart, Users, Truck } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useSites, useAccounts, useAccountMutations } from '@/lib/hooks/useAccounts';
import type { Site } from '@/lib/services/types';

export default function CustomerSitesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: sitesData, isLoading, refetch } = useSites({ search: searchQuery });
  const { data: accountsData } = useAccounts();
  const { createSite } = useAccountMutations();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [accountId, setAccountId] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !accountId) return;

    const acc = accountsData?.items.find((a) => a.id === accountId);

    setIsSubmitting(true);
    try {
      await createSite({
        accountId,
        accountName: acc?.name,
        name,
        code,
        billToAddress: {
          street: street || '550 Lexington Avenue',
          city: city || 'New York',
          state: state || 'NY',
          postalCode: postalCode || '10022',
          country: 'USA',
        },
        shipToAddress: {
          street: street || '550 Lexington Avenue',
          city: city || 'New York',
          state: state || 'NY',
          postalCode: postalCode || '10022',
          country: 'USA',
        },
      });
      setName('');
      setCode('');
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
        title="Site Branches & Dispensary Hubs"
        subtitle="Manage multi-location branch physical shipping addresses and branch order limits"
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
            <span>{isAdding ? 'Cancel' : 'New Branch Site'}</span>
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
              Add New Physical Site / Dispensary Branch
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Parent Account Organization *
                </label>
                <select
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value="">Select Account...</option>
                  {accountsData?.items.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.accountCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Branch Site Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Queens Infusion Center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Site Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APX-QN-106"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Main St"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  City & State
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, NY"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
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
                {isSubmitting ? 'Saving...' : 'Register Site'}
              </button>
            </div>
          </form>
        )}

        {/* Sites Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {sitesData?.items.map((site) => (
            <div
              key={site.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 2px 8px rgba(43, 37, 62, 0.05)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#FFF0F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MapPin size={16} color="#F73582" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2B253E' }}>{site.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{site.accountName}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: '#475569',
                    }}
                  >
                    {site.code}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.78rem',
                    color: '#475569',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#2B253E', marginBottom: '2px' }}>Ship-To Address:</div>
                  <div>{site.shipToAddress.street}, {site.shipToAddress.suite || ''}</div>
                  <div>{site.shipToAddress.city}, {site.shipToAddress.state} {site.shipToAddress.postalCode}</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '12px',
                  fontSize: '0.78rem',
                }}
              >
                <span style={{ color: '#64748B' }}>
                  <strong>{site.activeUsersCount || 1}</strong> Authorized Users
                </span>
                <span style={{ color: '#F73582', fontWeight: 800 }}>
                  ${(site.monthlySpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} spend
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
