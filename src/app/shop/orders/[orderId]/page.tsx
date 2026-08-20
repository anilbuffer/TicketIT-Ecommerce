// src/app/shop/orders/[orderId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getOrderById } from '@/lib/services/orders.service';
import type { Order } from '@/lib/services/types';
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge';
import {
  ArrowLeft,
  Truck,
  Printer,
  CheckCircle2,
  Clock,
  Lock,
} from 'lucide-react';

export default function SiteOrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setIsLoading(true);
      try {
        const res = await getOrderById(orderId);
        setOrder(res);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '3px solid #fbcfe8',
            borderTopColor: '#f73582',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: '440px',
          margin: '48px auto',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Order Record Not Found</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
          This order does not exist or does not belong to your site account.
        </p>
        <Link
          href="/shop/orders/history"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: '#f73582',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} /> Back to Order History
        </Link>
      </div>
    );
  }

  const statusSteps = [
    { key: 'RECEIVED', label: 'Order Received', desc: 'Logged on-account' },
    { key: 'PROCESSING', label: 'In Fulfilment', desc: 'Central warehouse staging' },
    { key: 'DISPATCHED', label: 'Dispatched', desc: order.carrier ? `${order.carrier}` : 'In transit to site' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Signed at site dock' },
  ];

  const statusOrder: Record<string, number> = {
    RECEIVED: 0,
    PROCESSING: 1,
    DISPATCHED: 2,
    DELIVERED: 3,
  };

  const currentStepIdx = statusOrder[order.status] ?? 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '1040px',
        margin: '0 auto',
        paddingBottom: '80px',
        width: '100%',
      }}
    >
      {/* 1. Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link
            href="/shop/orders/history"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#f73582',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={13} /> Back to My Site Orders
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Order {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} size="md" />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              <Lock size={11} /> Read-Only Record
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Printer size={14} /> Print Summary
        </button>
      </div>

      {/* 2. Status Progression Stepper */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <Clock size={15} color="#f73582" />
            <span>Fulfilment Tracking Progression</span>
          </h3>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            Managed by Platform Operations
          </span>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <div style={{ position: 'absolute', top: '18px', left: '24px', right: '24px', height: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#059669',
                width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`,
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>

          {statusSteps.map((step, idx) => {
            const isPassed = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: isPassed ? '#059669' : '#ffffff',
                    color: isPassed ? '#ffffff' : '#94a3b8',
                    border: isPassed ? '2px solid #059669' : '2px solid #cbd5e1',
                  }}
                >
                  {isPassed ? <CheckCircle2 size={16} /> : idx + 1}
                </div>

                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: isCurrent ? 800 : 700, display: 'block', color: isCurrent ? '#059669' : isPassed ? '#0f172a' : '#94a3b8' }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', maxWidth: '100px', display: 'block' }}>
                    {step.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: '#f5f3ff',
              border: '1px solid #ddd6fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={16} />
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#4c1d95', display: 'block' }}>Courier Tracking: {order.trackingNumber}</span>
                <span style={{ fontSize: '11px', color: '#6d28d9' }}>Carrier: {order.carrier || 'Rahhawan Direct Logistics'}</span>
              </div>
            </div>

            <span style={{ fontSize: '11px', fontWeight: 700, color: '#5b21b6', backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
              In Transit to Loading Dock
            </span>
          </div>
        )}
      </div>

      {/* 3. Order Details & Line Items */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Site & Branch:</span>
            <strong style={{ color: '#0f172a', fontSize: '13px', display: 'block', marginTop: '2px' }}>{order.siteName}</strong>
            <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>Code: {order.siteCode}</span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block' }}>PO / Reference:</span>
            <strong style={{ color: '#f73582', fontFamily: 'monospace', fontSize: '13px', display: 'block', marginTop: '2px' }}>
              {order.poReference || '—'}
            </strong>
            <span style={{ color: '#64748b' }}>Ordered by {order.userName}</span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Campaign Attribution:</span>
            <strong style={{ color: '#4338CA', fontFamily: 'monospace', fontSize: '13px', display: 'block', marginTop: '2px' }}>
              {order.campaignCode || 'General Allocation'}
            </strong>
            <span style={{ color: '#64748b' }}>{order.projectCode || 'Standard Capex'}</span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Billing & Settlement:</span>
            <strong style={{ color: '#059669', fontSize: '13px', display: 'block', marginTop: '2px' }}>
              Monthly Consolidated
            </strong>
            <span style={{ color: '#64748b' }}>Account: {order.accountName}</span>
          </div>
        </div>

        {order.approvedBy && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              fontSize: '12px',
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Authorized by <strong>{order.approvedBy}</strong> {order.approvalNotes ? `(${order.approvalNotes})` : ''}</span>
          </div>
        )}

        {/* Line Items */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '12px' }}>
            Itemized Collateral Assets ({order.itemCount} units)
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px' }}>
                  <th style={{ padding: '10px 12px' }}>Asset</th>
                  <th style={{ padding: '10px 12px' }}>SKU</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Pack Size</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Quantity</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems.map((line) => (
                  <tr key={line.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{line.productName}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#64748b' }}>{line.sku}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{line.packSize || line.uom || 'Unit'}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>{line.qty}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${line.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                      ${line.lineTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals and Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569' }}>
            {order.deliveryNotes && (
              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '2px' }}>Delivery Instructions:</span>
                <p style={{ fontStyle: 'italic', margin: 0, color: '#475569' }}>{order.deliveryNotes}</p>
              </div>
            )}
          </div>

          <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Items Total:</span>
              <strong style={{ color: '#0f172a' }}>${order.totalAmount.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Consolidated Shipping:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Billed to Account:</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
