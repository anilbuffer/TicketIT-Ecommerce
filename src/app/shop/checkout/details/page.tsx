// src/app/shop/checkout/details/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getAccountOrderRules } from '@/lib/services/accounts.service';
import type { AccountOrderRules } from '@/lib/services/types';
import {
  Building2,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Lock,
  Info,
} from 'lucide-react';

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkoutState, updateCheckoutState, subtotal, totalCount } = useCart();

  const [accountRules, setAccountRules] = useState<AccountOrderRules | null>(null);
  const [poReference, setPoReference] = useState<string>(checkoutState.poReference || '');
  const [poError, setPoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const accountId = user?.accountId || 'acc-001';

  useEffect(() => {
    async function loadRules() {
      setIsLoading(true);
      try {
        const rules = await getAccountOrderRules(accountId);
        setAccountRules(rules);

        // Pre-fill PO reference if not yet set
        if (!checkoutState.poReference) {
          const defaultPo = `${user?.poPrefix || rules.poPrefix || 'PO-APX'}-${Math.floor(1000 + Math.random() * 9000)}`;
          setPoReference(defaultPo);
          updateCheckoutState({ poReference: defaultPo });
        }
      } catch (err) {
        console.error('Failed to load account order rules', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRules();
  }, [accountId]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const isMandatory = accountRules?.requirePoNumber ?? true;
    if (isMandatory && (!poReference || poReference.trim() === '')) {
      setPoError('Purchase Order (PO) Reference is mandatory for your customer account.');
      return;
    }

    setPoError(null);
    updateCheckoutState({ poReference: poReference.trim() });
    router.push('/shop/checkout/delivery');
  };

  const isMandatoryPo = accountRules?.requirePoNumber ?? true;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        gap: '24px',
        alignItems: 'start',
      }}
    >
      {/* Main Details Form (Left) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f73582', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Step 1 of 3
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px 0' }}>
            Customer & Site Details
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Your account affiliation and site ordering credentials are pre-populated automatically.
          </p>
        </div>

        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pre-populated Account & User Card */}
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                <Building2 size={16} color="#f73582" />
                <span>Customer Account Association</span>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#065f46',
                  backgroundColor: '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #a7f3d0',
                }}
              >
                <Lock size={11} /> Verified Account
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Customer Account:</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px', display: 'block' }}>
                  {user?.accountName || 'Apex Healthcare Group'}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                  ID: {user?.accountId || 'acc-001'}
                </span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Ordering Branch:</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px', display: 'block' }}>
                  {user?.siteName || 'Apex Midtown Central Pharmacy'}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                  Site Code: {user?.siteCode || 'APX-MID-101'}
                </span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Ordering User:</span>
                <span style={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>
                  {user?.name || 'Marcus Vance'}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{user?.email || 'marcus.vance@apexhealth.org'}</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Monthly Budget Cap:</span>
                <span style={{ fontWeight: 700, color: '#059669', display: 'block' }}>
                  ${user?.monthlyBudgetCap?.toLocaleString() || '25,000'} (Active)
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Billed to Head Office</span>
              </div>
            </div>
          </div>

          {/* PO Reference Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label
                htmlFor="poReference"
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={15} color="#f73582" />
                <span>Purchase Order (PO) / Internal Reference</span>
                {isMandatoryPo ? (
                  <span style={{ color: '#ef4444', fontWeight: 800 }}>*</span>
                ) : (
                  <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '12px' }}>(Optional)</span>
                )}
              </label>

              {isMandatoryPo && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#f73582',
                    backgroundColor: '#fdf2f8',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #fbcfe8',
                  }}
                >
                  Required by Account Policy
                </span>
              )}
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Enter your site's PO, authorization code, or internal job reference for this collateral batch. This reference will appear on your monthly consolidated billing statement.
            </p>

            <input
              id="poReference"
              type="text"
              value={poReference}
              onChange={(e) => {
                setPoReference(e.target.value);
                if (poError) setPoError(null);
              }}
              placeholder="e.g. PO-APX-MID-9402"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: poError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#0f172a',
                backgroundColor: '#ffffff',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
            />

            {poError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={15} color="#dc2626" />
                <span>{poError}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <Link
              href="/shop/cart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} /> Back to Cart
            </Link>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#f73582',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Continue to Delivery Details</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* Side Summary (Right) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0, paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          Order Quick Snapshot
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Total Items:</span>
            <strong style={{ color: '#0f172a' }}>{totalCount} items</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Order Total:</span>
            <strong style={{ color: '#f73582', fontSize: '16px', fontWeight: 800 }}>${subtotal.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Payment Terms:</span>
            <strong style={{ color: '#059669' }}>On-Account Billing</strong>
          </div>
        </div>

        <div
          style={{
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            color: '#64748b',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} color="#f73582" />
            <span>Account B2B Policy</span>
          </div>
          <p style={{ margin: 0 }}>
            Orders are authorized under your group contract. Your Head Office finance controller will review the consolidated report at month end.
          </p>
        </div>
      </div>
    </div>
  );
}
