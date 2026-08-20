// src/app/admin/orders/[orderId]/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  Building2,
  User,
  ShieldCheck,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { OrderActionModal } from '@/components/admin/OrderActionModal';
import { useOrder, useOrderMutations } from '@/lib/hooks/useOrders';
import { useAuth } from '@/context/AuthContext';

export default function SingleOrderDetailPage() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const params = useParams();
  const orderId = (params.orderId as string) || '';

  const { order, isLoading, refetch } = useOrder(orderId);
  const { updateOrderStatus } = useOrderMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusUpdate = async (id: string, status: any, metadata?: any) => {
    if (!isAdmin) return;
    await updateOrderStatus(id, status, metadata);
    refetch();
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Order Detail" />
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          Loading order details from service layer...
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AdminHeader title="Order Not Found" />
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          <Package size={40} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#2B253E' }}>Order not found</div>
          <Link href="/admin/orders/all" style={{ display: 'inline-block', marginTop: '12px', color: '#F73582', fontWeight: 700 }}>
            ← Back to Orders
          </Link>
        </div>
      </>
    );
  }

  const steps = [
    { label: 'Received', active: true, date: order.createdAt },
    {
      label: 'Processing',
      active: order.status === 'PROCESSING' || order.status === 'DISPATCHED' || order.status === 'DELIVERED',
      date: order.status !== 'RECEIVED' ? order.updatedAt : undefined,
    },
    {
      label: 'Dispatched',
      active: order.status === 'DISPATCHED' || order.status === 'DELIVERED',
      date: order.dispatchedAt,
    },
    {
      label: 'Delivered',
      active: order.status === 'DELIVERED',
      date: order.deliveredAt,
    },
  ];

  return (
    <>
      <AdminHeader
        title={`Order ${order.orderNumber}`}
        subtitle={`Branch: ${order.siteName} • PO: ${order.poReference || 'None'}`}
        actionButton={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/admin/orders/all"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F73582',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Update Order Status
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                <ShieldCheck size={16} />
                <span>Multi-Site Status (Read-Only)</span>
              </div>
            )}
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Status Stepper Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
              Operational Fulfillment Lifecycle
            </div>
            <StatusPill status={order.status} size="lg" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: step.active ? '#F73582' : '#F1F5F9',
                    color: step.active ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    boxShadow: step.active ? '0 0 12px rgba(247, 53, 130, 0.4)' : 'none',
                  }}
                >
                  {step.active ? <CheckCircle size={18} /> : idx + 1}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: step.active ? '#2B253E' : '#94A3B8', marginTop: '8px' }}>
                  {step.label}
                </div>
                {step.date && (
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                    {new Date(step.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left: Line items */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', marginBottom: '16px' }}>
              Order Line Items ({order.lineItems.length})
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>Item</th>
                  <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>SKU</th>
                  <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2B253E' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.thumbnailUrl && (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                        )}
                        <div>{item.productName}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748B' }}>{item.sku}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#2B253E' }}>{item.qty}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748B' }}>${item.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#2B253E' }}>${item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '2px solid #F1F5F9',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '20px',
              }}
            >
              <span style={{ fontWeight: 700, color: '#64748B' }}>Total Amount Due:</span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#F73582' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Right: Logistics & Destination */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2B253E', marginBottom: '14px' }}>
                Logistics & Carrier Details
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#64748B' }}>Carrier:</span>{' '}
                  <strong>{order.carrier || 'Unassigned'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Waybill Tracking:</span>{' '}
                  <span style={{ fontFamily: 'monospace', color: '#F73582', fontWeight: 700 }}>
                    {order.trackingNumber || 'Pending pickup'}
                  </span>
                </div>
                {order.deliveryNotes && (
                  <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#2B253E', marginBottom: '2px' }}>Instructions:</div>
                    <div style={{ color: '#64748B' }}>{order.deliveryNotes}</div>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2B253E', marginBottom: '14px' }}>
                Ordering Organization
              </div>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>{order.siteName}</strong></div>
                <div style={{ color: '#64748B' }}>{order.accountName} ({order.siteCode})</div>
                <div style={{ color: '#64748B', marginTop: '4px' }}>User: {order.userName} ({order.userEmail})</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <OrderActionModal
        order={order}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
