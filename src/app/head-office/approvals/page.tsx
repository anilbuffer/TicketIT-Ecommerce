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
  FileSpreadsheet,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Package,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePendingApprovals, useOrderMutations } from '@/lib/hooks/useOrders';
import { StatusPill } from '@/components/admin/StatusPill';
import type { Order } from '@/lib/services/types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export default function HeadOfficeApprovalsPage() {
  const { user } = useAuth();
  const accountId = user?.accountId || 'acc-001';

  const { orders, isLoading, refetch } = usePendingApprovals(accountId);
  const { approveOrder, rejectOrder, isPending } = useOrderMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSite = siteFilter === 'ALL' || o.siteId === siteFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.poReference && o.poReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.campaignCode && o.campaignCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSite && matchesSearch;
  });

  const totalPendingValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleOpenAction = (order: Order, type: 'APPROVE' | 'REJECT') => {
    setSelectedOrder(order);
    setActionType(type);
    setActionNotes(type === 'APPROVE' ? 'Approved by Head Office Controller' : '');
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !actionType) return;

    try {
      const approverName = user?.name || 'Head Office Controller';
      if (actionType === 'APPROVE') {
        await approveOrder(selectedOrder.id, approverName, actionNotes);
        setFeedbackMessage({
          type: 'success',
          text: `Order ${selectedOrder.orderNumber} successfully approved for fulfillment.`,
        });
      } else {
        await rejectOrder(selectedOrder.id, approverName, actionNotes || 'Budget threshold exceeded');
        setFeedbackMessage({
          type: 'error',
          text: `Order ${selectedOrder.orderNumber} has been rejected. Notification sent to site.`,
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
            <span>{user?.organization || 'Apex Healthcare Group'} • Corporate Governance</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Requisition Approval Queue
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Review, authorize, or reject branch marketing collateral orders exceeding threshold limits ($1,000.00).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: '#fff',
              border: '1px solid rgba(43, 37, 62, 0.1)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <DollarSign size={18} color="#2563eb" />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Pending Spend
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                ${totalPendingValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: feedbackMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${feedbackMessage.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
              color: feedbackMessage.type === 'success' ? '#065F46' : '#991B1B',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {feedbackMessage.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          backgroundColor: '#fff',
          padding: '14px 18px',
          borderRadius: '14px',
          border: '1px solid rgba(43, 37, 62, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search order #, PO, branch, campaign code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              outline: 'none',
            }}
          />
        </div>

        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
            outline: 'none',
            color: '#334155',
            fontWeight: 600,
          }}
        >
          <option value="ALL">All Branch Sites</option>
          <option value="site-101">APX-MID-101 (Midtown)</option>
          <option value="site-102">APX-BK-102 (Brooklyn)</option>
          <option value="site-106">APX-QNS-106 (Queens)</option>
        </select>
      </div>

      {/* 3. Approvals List */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          Loading pending requisitions...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed #cbd5e1',
          }}
        >
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            All Requisitions Cleared
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto' }}>
            There are no branch orders currently pending Head Office managerial sign-off. All submitted orders are within standard budget thresholds.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid rgba(43, 37, 62, 0.09)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D97706',
                    }}
                  >
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                        {order.orderNumber}
                      </span>
                      <StatusPill status={order.status} size="sm" />
                      {order.campaignCode && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            border: '1px solid #C7D2FE',
                          }}
                        >
                          {order.campaignCode}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Requested by <strong style={{ color: '#334155' }}>{order.userName}</strong> on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Requisition</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                      ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenAction(order, 'APPROVE')}
                      disabled={isPending}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleOpenAction(order, 'REJECT')}
                      disabled={isPending}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#ef4444',
                        border: '1px solid #fca5a5',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body - Line Items */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Branch Location: <strong style={{ color: '#0f172a' }}>{order.siteName} ({order.siteCode})</strong> • PO: <strong style={{ color: '#0f172a' }}>{order.poReference || 'N/A'}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.lineItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            position: 'relative',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#e2e8f0',
                          }}
                        >
                          <Image
                            src={item.thumbnailUrl || FALLBACK_IMAGE}
                            alt={item.productName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                            {item.productName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            SKU: {item.sku} • Qty: {item.qty} ({item.packSize || 'Units'})
                          </div>
                          {item.customizations && (
                            <div style={{ marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {Object.entries(item.customizations).map(([k, v]) => (
                                <span
                                  key={k}
                                  style={{
                                    fontSize: '10px',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: '#FDF2F8',
                                    color: '#BE185D',
                                    border: '1px solid #FBCFE8',
                                  }}
                                >
                                  {k}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                          ${item.lineTotal.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          ${item.unitPrice.toFixed(2)} / unit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {order.deliveryNotes && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFDF0',
                      border: '1px solid #FEF08A',
                      fontSize: '12px',
                      color: '#854D0E',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <MessageSquare size={16} />
                    <span><strong>Branch Delivery Instructions:</strong> {order.deliveryNotes}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Modal (Approve / Reject) */}
      <AnimatePresence>
        {selectedOrder && actionType && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                margin: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                {actionType === 'APPROVE' ? 'Authorize Requisition' : 'Reject Requisition'}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                Order <strong>{selectedOrder.orderNumber}</strong> (${selectedOrder.totalAmount.toFixed(2)}) for{' '}
                <strong>{selectedOrder.siteName}</strong>.
              </p>

              <form onSubmit={handleConfirmAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {actionType === 'APPROVE' ? 'Approval Audit Notes (Optional)' : 'Rejection Reason (Required)'}
                  </label>
                  <textarea
                    rows={3}
                    required={actionType === 'REJECT'}
                    placeholder={actionType === 'APPROVE' ? 'e.g. Approved within Q3 promotional allocation budget' : 'e.g. Exceeds branch monthly budget cap. Please re-submit with reduced quantities.'}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrder(null);
                      setActionType(null);
                    }}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      fontSize: '13px',
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
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: actionType === 'APPROVE' ? '#10b981' : '#ef4444',
                      color: '#fff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isPending ? 'Processing...' : actionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
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
