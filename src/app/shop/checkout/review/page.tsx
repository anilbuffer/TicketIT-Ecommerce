// src/app/shop/checkout/review/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/services/orders.service';
import {
  Building2,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Package,
  Receipt,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, totalCount, checkoutState, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultShipTo = checkoutState.customShipToAddress || {
    street: '550 Lexington Avenue',
    suite: 'Ground Floor Dispensary Receiving',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'USA',
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderPayload = {
        accountId: user?.accountId || 'acc-001',
        accountName: user?.accountName || 'Apex Healthcare Group',
        siteId: user?.siteId || 'site-101',
        siteCode: user?.siteCode || 'APX-MID-101',
        siteName: user?.siteName || 'Apex Midtown Central Pharmacy',
        userId: user?.id || 'usr_site_101',
        userName: user?.name || 'Marcus Vance',
        userEmail: user?.email || 'marcus.vance@apexhealth.org',
        poReference: checkoutState.poReference || `PO-APX-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'RECEIVED' as const,
        totalAmount: subtotal,
        deliveryNotes: `${checkoutState.deliveryInstructions || 'Standard site delivery'} | Contact: ${checkoutState.deliveryContactName} (${checkoutState.deliveryContactPhone})`,
        lineItems: items.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          orderId: '',
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          thumbnailUrl: item.product.thumbnailUrl,
          qty: item.qty,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          packSize: item.product.packSize,
          uom: item.product.uom,
        })),
      };

      const created = await createOrder(orderPayload);
      clearCart();
      router.push(`/shop/order-confirmation/${created.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setSubmitError(err?.message || 'Failed to submit on-account order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#f73582', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Step 3 of 3
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px 0' }}>
          Review & Submit On-Account Order
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Review your collateral assets and delivery details before placing the order on your company account.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Main Review Section (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Items Breakdown Box */}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Package size={15} color="#f73582" />
                <span>Collateral Assets ({totalCount} items)</span>
              </h3>
              <Link
                href="/shop/cart"
                style={{ fontSize: '12px', fontWeight: 700, color: '#f73582', textDecoration: 'none' }}
              >
                Edit Cart
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={item.product.thumbnailUrl || FALLBACK_IMAGE}
                        alt={item.product.name}
                        fill
                        unoptimized
                        sizes="48px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0f172a',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '260px',
                        }}
                      >
                        {item.product.name}
                      </h4>
                      <p style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', margin: '2px 0 0 0' }}>
                        {item.product.sku} • {item.qty} {item.product.uom} @ ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                    ${item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '13px',
              }}
            >
              <span style={{ fontWeight: 700, color: '#475569' }}>Items Subtotal:</span>
              <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* 2. Customer & Address Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Account & PO Info */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#2B253E" />
                  <span>Account & PO Info</span>
                </span>
                <Link href="/shop/checkout/details" style={{ color: '#f73582', fontWeight: 700, textDecoration: 'none' }}>
                  Edit
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#0f172a', display: 'block' }}>Customer Account:</strong>
                  {user?.accountName || 'Apex Healthcare Group'}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#0f172a', display: 'block' }}>Site Branch:</strong>
                  {user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#0f172a', display: 'block' }}>PO Reference:</strong>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f73582' }}>
                    {checkoutState.poReference || 'Auto-generated'}
                  </span>
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} color="#f73582" />
                  <span>Delivery Destination</span>
                </span>
                <Link href="/shop/checkout/delivery" style={{ color: '#f73582', fontWeight: 700, textDecoration: 'none' }}>
                  Edit
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#0f172a', display: 'block' }}>Recipient Contact:</strong>
                  {checkoutState.deliveryContactName || user?.name} ({checkoutState.deliveryContactPhone || '+1 (212) 555-0190'})
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#0f172a', display: 'block' }}>Ship-To Address:</strong>
                  {defaultShipTo.street} {defaultShipTo.suite && `, ${defaultShipTo.suite}`}, {defaultShipTo.city}, {defaultShipTo.state} {defaultShipTo.postalCode}
                </p>
                {checkoutState.deliveryInstructions && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', fontStyle: 'italic', color: '#64748b' }}>
                    "{checkoutState.deliveryInstructions}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action / Submit Card (Right) */}
        <div
          style={{
            position: 'sticky',
            top: '80px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
            <Receipt size={18} color="#f73582" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Authorization Summary
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Subtotal (Excl. GST):</span>
              <strong style={{ color: '#0f172a' }}>${subtotal.toFixed(2)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Freight & Handling:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>Included (Fleet Dispatch)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Estimated GST (10%):</span>
              <strong style={{ color: '#475569' }}>${(subtotal * 0.1).toFixed(2)}</strong>
            </div>

            <div
              style={{
                paddingTop: '10px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                  Total Order Value
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Incl. GST (On-Account)</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                ${(subtotal * 1.1).toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', paddingTop: '6px' }}>
              <span>Settlement Terms:</span>
              <strong style={{ color: '#059669' }}>Net 30 Monthly Invoice</strong>
            </div>
          </div>

          {/* On-Account Banner */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: '#fdf2f8',
              border: '1px solid #fbcfe8',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '11px',
              lineHeight: 1.4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0f172a' }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Charge-to-Account Order</span>
            </div>
            <p style={{ margin: 0, color: '#64748b' }}>
              No online card payment required. This order will be routed to Central Fulfilment and consolidated on your Head Office statement.
            </p>
          </div>

          {submitError && (
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
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: '#f73582',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: '0 4px 14px rgba(247, 53, 130, 0.35)',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Submit Order On-Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <Link
            href="/shop/checkout/delivery"
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px',
            }}
          >
            Back to Delivery Details
          </Link>
        </div>
      </div>
    </div>
  );
}
