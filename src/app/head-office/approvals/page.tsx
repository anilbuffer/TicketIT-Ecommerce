// src/app/head-office/approvals/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Package,
  MessageSquare,
  CreditCard,
  Check,
  FileText,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePendingApprovals, useOrderMutations } from '@/lib/hooks/useOrders';
import { StatusPill } from '@/components/admin/StatusPill';
import type { Order, CorporatePaymentMethod } from '@/lib/services/types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export default function HeadOfficeApprovalsPage() {
  const { user } = useAuth();
  const accountId = user?.accountId || 'acc-001';

  const { orders, isLoading, refetch } = usePendingApprovals(accountId);
  const { approveOrder, rejectOrder, requestChanges, payOrder, isPending } = useOrderMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'CHANGES' | 'PAY' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<CorporatePaymentMethod>('CORPORATE_INVOICE');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSite = siteFilter === 'ALL' || o.siteId === siteFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.poReference && o.poReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const totalPendingValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleOpenAction = (order: Order, type: 'APPROVE' | 'REJECT' | 'CHANGES' | 'PAY') => {
    setSelectedOrder(order);
    setActionType(type);
    if (type === 'APPROVE') {
      setActionNotes('Approved by Head Office Financial Controller for procurement.');
    } else if (type === 'PAY') {
      setPaymentRefNumber(`CORP-STMT-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      setActionNotes('');
    }
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !actionType) return;

    try {
      const approverName = user?.name || 'Elena Rostova (Head Office)';

      if (actionType === 'APPROVE') {
        await approveOrder(selectedOrder.id, approverName, actionNotes);
        setFeedbackMessage({
          type: 'success',
          text: `PO ${selectedOrder.poReference || selectedOrder.orderNumber} approved. Ready for corporate payment.`,
        });
      } else if (actionType === 'CHANGES') {
        await requestChanges(selectedOrder.id, approverName, actionNotes || 'Please adjust branch address and quantities.');
        setFeedbackMessage({
          type: 'error',
          text: `Changes requested for PO ${selectedOrder.poReference || selectedOrder.orderNumber}. Feedback sent to site user.`,
        });
      } else if (actionType === 'PAY') {
        await payOrder(selectedOrder.id, selectedPaymentMethod, paymentRefNumber, approverName);
        setFeedbackMessage({
          type: 'success',
          text: `Corporate payment settled for PO ${selectedOrder.poReference || selectedOrder.orderNumber}. Order sent to print production!`,
        });
      } else if (actionType === 'REJECT') {
        await rejectOrder(selectedOrder.id, approverName, actionNotes || 'Budget threshold exceeded');
        setFeedbackMessage({
          type: 'error',
          text: `PO ${selectedOrder.poReference || selectedOrder.orderNumber} rejected. Notification logged.`,
        });
      }

      setSelectedOrder(null);
      setActionType(null);
      setActionNotes('');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(43, 37, 62, 0.08)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#2563eb',
            }}
          >
            <Building2 size={14} />
            <span>{user?.organization || 'Apex Healthcare Group'} • Head Office Approvals & Financial Control</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Purchase Order Approvals & Corporate Payments
          </h1>

          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Step 9, 10 & 11: Review customized artwork proofs, approve purchase orders, and authorize corporate payments to initiate production.
          </p>
        </div>

        {/* Total Value Pill */}
        <div
          style={{
            padding: '12px 20px',
            borderRadius: '16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>
              Queue Total ({filteredOrders.length} POs)
            </span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#1e3a8a' }}>
              ${totalPendingValue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: feedbackMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: feedbackMessage.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca',
            color: feedbackMessage.type === 'success' ? '#065f46' : '#991b1b',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* 2. Search & Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '440px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by PO #, Order ID, or Site Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '38px',
              paddingRight: '14px',
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '10px',
              border: '1.5px solid #e2e8f0',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
        </div>

        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
          Showing <strong>{filteredOrders.length}</strong> purchase orders awaiting financial review
        </span>
      </div>

      {/* 3. PO Queue List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading Approvals Queue...</div>
        ) : filteredOrders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '48px',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '32px auto',
            }}
          >
            <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>All Purchase Orders Clear</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
              There are currently no purchase orders awaiting approval or payment for your corporate account.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const firstItem = order.lineItems[0];
            const isApproved = order.status === 'APPROVED';

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: isApproved ? '1.5px solid #bfdbfe' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Top Row: PO Meta & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#2B253E',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      {order.poReference || order.orderNumber}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {order.siteName} ({order.siteCode})
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Requested by <strong>{order.userName}</strong> • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <StatusPill status={order.status} />
                </div>

                {/* Middle Row: Artwork Thumbnail, Specifications & Financials */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 220px',
                    gap: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    alignItems: 'center',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '10px',
                      backgroundColor: '#e2e8f0',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={firstItem?.thumbnailUrl || FALLBACK_IMAGE}
                      alt="Customized Artwork Proof"
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Spec Info */}
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                      {firstItem?.productName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      {order.itemCount} Units • Direct UV High-Definition Offset Printing
                    </div>
                    {firstItem?.customizations && (
                      <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
                        ✓ Custom Branch: {firstItem.customizations.businessName || order.siteName}
                      </div>
                    )}
                    {order.deliveryNotes && (
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Delivery Instructions: &quot;{order.deliveryNotes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Financials & Payer Note */}
                  <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>
                      Total Amount (Corporate Statement)
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: '#2B253E' }}>
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#059669', display: 'block', fontWeight: 700, marginTop: '2px' }}>
                      {order.paymentStatus === 'PAID' ? '✓ Paid' : 'HO Payment Required'}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleOpenAction(order, 'REJECT')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Reject PO
                  </button>

                  <button
                    onClick={() => handleOpenAction(order, 'CHANGES')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#fff7ed',
                      border: '1px solid #fed7aa',
                      color: '#c2410c',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Request Changes
                  </button>

                  {!isApproved && (
                    <button
                      onClick={() => handleOpenAction(order, 'APPROVE')}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                      }}
                    >
                      Approve PO
                    </button>
                  )}

                  {/* MAKE PAYMENT (Head Office Pays) */}
                  <button
                    onClick={() => handleOpenAction(order, 'PAY')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      borderRadius: '10px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                    }}
                  >
                    <CreditCard size={15} />
                    Make Payment (${order.totalAmount.toFixed(2)})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Action Confirmation / Corporate Payment Modal */}
      <AnimatePresence>
        {selectedOrder && actionType && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '560px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <form onSubmit={handleConfirmAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {actionType === 'PAY' && 'Step 11: Head Office Corporate Payment'}
                    {actionType === 'APPROVE' && 'Step 10: Approve Purchase Order'}
                    {actionType === 'CHANGES' && 'Request Changes from Site User'}
                    {actionType === 'REJECT' && 'Decline Purchase Order'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrder(null);
                      setActionType(null);
                    }}
                    style={{ background: 'none', border: 'none', fontSize: '16px', color: '#64748b', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>
                    PO #{selectedOrder.poReference || selectedOrder.orderNumber}
                  </div>
                  <div style={{ color: '#475569', marginTop: '2px' }}>
                    Branch: {selectedOrder.siteName} • Total: <strong>${selectedOrder.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>

                {actionType === 'PAY' ? (
                  /* Corporate Payment Form */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                        Select Corporate Payment Method
                      </label>
                      <select
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as CorporatePaymentMethod)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0f172a',
                        }}
                      >
                        <option value="CORPORATE_INVOICE">Corporate Net-30 Account Invoice</option>
                        <option value="PURCHASING_CARD">Corporate Purchasing Card (P-Card •••• 9021)</option>
                        <option value="CORPORATE_ACH">Direct Corporate ACH / BACS Transfer</option>
                        <option value="PREAPPROVED_CREDIT">Pre-Approved Commercial Credit Facility</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        Payment Reference / Authorization Code
                      </label>
                      <input
                        type="text"
                        value={paymentRefNumber}
                        onChange={(e) => setPaymentRefNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                      />
                    </div>

                    <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '12px', color: '#047857' }}>
                      💳 Authorizing this payment will immediately settle PO #{selectedOrder.poReference} and transition the order to <strong>&quot;Paid → In Production&quot;</strong>.
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                      Approval / Feedback Notes
                    </label>
                    <textarea
                      rows={3}
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add comments or instructions..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrder(null);
                      setActionType(null);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      color: '#475569',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '10px',
                      backgroundColor: actionType === 'PAY' ? '#059669' : actionType === 'REJECT' ? '#dc2626' : '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {isPending
                      ? 'Processing...'
                      : actionType === 'PAY'
                      ? 'Confirm & Settle Payment'
                      : actionType === 'APPROVE'
                      ? 'Confirm Approval'
                      : actionType === 'CHANGES'
                      ? 'Send Feedback'
                      : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
