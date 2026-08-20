// src/app/admin/pricing/rate-cards/page.tsx
'use client';

import React, { useState } from 'react';
import { Percent, Plus, Search, DollarSign, Building2, Tag, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useRateCards, useRateCardMutations } from '@/lib/hooks/usePricing';
import { useAccounts } from '@/lib/hooks/useAccounts';
import type { RateCard } from '@/lib/services/types';

export default function RateCardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rateCardsData, isLoading, refetch } = useRateCards({ search: searchQuery });
  const { data: accountsData } = useAccounts();
  const { createRateCard } = useRateCardMutations();

  const [expandedCardId, setExpandedCardId] = useState<string | null>('rc-001');
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [discountPct, setDiscountPct] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !accountId) return;

    const acc = accountsData?.items.find((a) => a.id === accountId);

    setIsSubmitting(true);
    try {
      await createRateCard({
        name,
        accountId,
        accountName: acc?.name || 'Client',
        defaultDiscountPct: Number(discountPct),
        status: 'ACTIVE',
        effectiveFrom: new Date().toISOString(),
        items: [],
      });
      setName('');
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
        title="Commercial Rate Cards & Contract Pricing"
        subtitle="Manage client master discounts, SKU-specific price overrides, and contract validity terms"
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
            <span>{isAdding ? 'Cancel' : 'New Rate Card'}</span>
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
              Create New Commercial Rate Card Agreement
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Rate Card Agreement Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex 2026 Enterprise Tier A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Target Client Account *
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
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Master Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(parseFloat(e.target.value) || 0)}
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
                {isSubmitting ? 'Saving...' : 'Publish Rate Card'}
              </button>
            </div>
          </form>
        )}

        {/* Rate Cards Listing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {rateCardsData?.items.map((rc) => {
            const isExpanded = expandedCardId === rc.id;

            return (
              <div
                key={rc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                  border: isExpanded ? '1px solid rgba(247, 53, 130, 0.3)' : '1px solid rgba(43, 37, 62, 0.06)',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                }}
              >
                <div
                  onClick={() => setExpandedCardId(isExpanded ? null : rc.id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? '#FFF8FB' : '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: '#FFF0F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Percent size={20} color="#F73582" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#2B253E' }}>{rc.name}</span>
                        <StatusPill status={rc.status} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                        Account: <strong>{rc.accountName}</strong> • Master Blanket Discount: <strong>{rc.defaultDiscountPct}%</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F73582' }}>
                        {rc.items.length} Custom SKU Overrides
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        Valid through {new Date(rc.effectiveTo || rc.effectiveFrom).getFullYear()}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
                  </div>
                </div>

                {/* Expanded SKU Pricing Table */}
                {isExpanded && (
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', backgroundColor: '#FAFCFF' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B253E', marginBottom: '12px' }}>
                      Individual SKU Price Overrides & Fixed Rates:
                    </div>

                    {rc.items.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                        No SKU-level fixed price overrides defined. All products receive the blanket {rc.defaultDiscountPct}% discount.
                      </div>
                    ) : (
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                          <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                              <th style={{ padding: '10px 16px', color: '#64748B', fontWeight: 700 }}>Item Name</th>
                              <th style={{ padding: '10px 16px', color: '#64748B', fontWeight: 700 }}>SKU</th>
                              <th style={{ padding: '10px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Base Price</th>
                              <th style={{ padding: '10px 16px', color: '#64748B', fontWeight: 700, textAlign: 'center' }}>Applied Discount</th>
                              <th style={{ padding: '10px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Contract Effective Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rc.items.map((item) => (
                              <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#2B253E' }}>{item.productName}</td>
                                <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#64748B' }}>{item.productSku}</td>
                                <td style={{ padding: '10px 16px', textAlign: 'right', color: '#94A3B8', textDecoration: 'line-through' }}>
                                  ${item.basePrice.toFixed(2)}
                                </td>
                                <td style={{ padding: '10px 16px', textAlign: 'center', color: '#58B97D', fontWeight: 700 }}>
                                  {item.discountPct?.toFixed(1)}% OFF
                                </td>
                                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 800, color: '#F73582' }}>
                                  ${item.effectivePrice.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
