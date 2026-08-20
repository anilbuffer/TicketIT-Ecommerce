// src/components/admin/OrderActionModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Printer,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/services/types';
import { StatusPill } from './StatusPill';

interface OrderActionModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (
    id: string,
    status: OrderStatus,
    metadata?: { carrier?: string; trackingNumber?: string; deliveryNotes?: string }
  ) => Promise<any>;
}

export function OrderActionModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}: OrderActionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'RECEIVED');
  const [carrier, setCarrier] = useState(order?.carrier || 'TicketIT Express Fulfilment');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [deliveryNotes, setDeliveryNotes] = useState(order?.deliveryNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync state when order opens
  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setCarrier(order.carrier || 'TicketIT Express Fulfilment');
      setTrackingNumber(order.trackingNumber || '');
      setDeliveryNotes(order.deliveryNotes || '');
      setFeedback(null);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await onStatusUpdate(order.id, selectedStatus, {
        carrier,
        trackingNumber,
        deliveryNotes,
      });
      setFeedback('Order updated successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setFeedback(`Error: ${err.message || 'Failed to update order'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statuses: { id: OrderStatus; label: string; desc: string }[] = [
    { id: 'RECEIVED', label: 'Received', desc: 'Order placed by branch, awaiting fulfillment review' },
    { id: 'PROCESSING', label: 'Processing', desc: 'Items staged and packed in warehouse/dispensary' },
    { id: 'DISPATCHED', label: 'Dispatched', desc: 'Picked up by carrier, transit active' },
    { id: 'DELIVERED', label: 'Delivered', desc: 'Signed for and verified at destination site' },
  ];

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(43, 37, 62, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(43, 37, 62, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAFCFF',
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
                <Package size={22} color="#F73582" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B253E', margin: 0 }}>
                    {order.orderNumber}
                  </h2>
                  <StatusPill status={order.status} size="md" />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Created on {new Date(order.createdAt).toLocaleString()} • PO: {order.poReference || 'None'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F1F5F9',
                color: '#64748B',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div
            style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Quick Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
              }}
            >
              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Account & Branch
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2B253E', marginTop: '4px' }}>
                  {order.siteName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {order.accountName} ({order.siteCode})
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Requester / Ordering User
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2B253E', marginTop: '4px' }}>
                  {order.userName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {order.userEmail}
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#FFF0F6',
                  borderRadius: '10px',
                  border: '1px solid rgba(247, 53, 130, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#F73582', fontWeight: 700, textTransform: 'uppercase' }}>
                  Order Total
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F73582', marginTop: '2px' }}>
                  ${order.totalAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {order.itemCount} total units
                </div>
              </div>
            </div>

            {/* Operational Status Selector Stepper */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B253E', marginBottom: '10px' }}>
                Operational Workflow Status Transition:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                }}
              >
                {statuses.map((s) => {
                  const isCurrent = selectedStatus === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStatus(s.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: isCurrent ? '2px solid #F73582' : '1px solid #E2E8F0',
                        backgroundColor: isCurrent ? '#FFF0F6' : '#FFFFFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: isCurrent ? '#F73582' : '#2B253E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{s.label}</span>
                        {isCurrent && <CheckCircle size={14} color="#F73582" />}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', lineHeight: 1.3 }}>
                        {s.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carrier & Tracking Inputs (Active when processing or dispatched) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                backgroundColor: '#F8FAFC',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Assigned Logistics Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. TicketIT Express Fulfilment, FedEx, DHL"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Waybill / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. RH-EXP-99210"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Delivery Instructions / Dispatch Notes
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Notes for courier or recipient..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B253E', marginBottom: '10px' }}>
                Ordered Line Items ({order.lineItems.length}):
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>Item Description</th>
                      <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>SKU</th>
                      <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Unit Price</th>
                      <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.lineItems.map((item, i) => (
                      <tr key={item.id || i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2B253E' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {item.thumbnailUrl && (
                              <img
                                src={item.thumbnailUrl}
                                alt={item.productName}
                                style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <div>{item.productName}</div>
                              {item.packSize && (
                                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.packSize}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748B', fontFamily: 'monospace' }}>
                          {item.sku}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#2B253E' }}>
                          {item.qty}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748B' }}>
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#2B253E' }}>
                          ${item.lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {feedback && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: feedback.includes('Error') ? '#FEF2F2' : '#EAF8EF',
                  color: feedback.includes('Error') ? '#DC2626' : '#228B53',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {feedback}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAFCFF',
            }}
          >
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <Printer size={15} />
              <span>Print Slip</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSave}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#F73582',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isSubmitting ? 'Saving...' : 'Apply Status Update'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
