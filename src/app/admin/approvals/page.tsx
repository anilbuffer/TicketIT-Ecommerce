// src/app/admin/approvals/page.tsx
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
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { usePendingApprovals, useOrderMutations } from '@/lib/hooks/useOrders';
import type { Order } from '@/lib/services/types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export default function AdminApprovalsPage() {
  const { orders, isLoading, refetch } = usePendingApprovals();
  const { approveOrder, rejectOrder, isPending } = useOrderMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesAccount = accountFilter === 'ALL' || o.accountId === accountFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.poReference && o.poReference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAccount && matchesSearch;
  });

  const totalPendingAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !actionType) return;

    try {
      if (actionType === 'APPROVE') {
        await approveOrder(selectedOrder.id, 'Platform Operations Admin', actionNotes || 'Authorized by Global Admin');
        setFeedback(`Order ${selectedOrder.orderNumber} authorized successfully.`);
      } else {
        await rejectOrder(selectedOrder.id, 'Platform Operations Admin', actionNotes || 'Administrative policy rejection');
        setFeedback(`Order ${selectedOrder.orderNumber} rejected.`);
      }
      setSelectedOrder(null);
      setActionType(null);
      setActionNotes('');
      refetch();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AdminHeader
        title="Multi-Tenant Approval Ledger"
        subtitle="Global governance queue for orders pending corporate sign-off across all customer accounts"
        actionButton={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#B45309',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            <ShieldAlert size={16} />
            <span>${totalPendingAmount.toFixed(2)} Under Review</span>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {feedback && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            ✓ {feedback}
          </div>
        )}

        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            backgroundColor: '#FFFFFF',
            padding: '14px 18px',
            borderRadius: '14px',
            border: '1px solid rgba(43, 37, 62, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search order #, account, site, PO reference..."
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
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
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
            <option value="ALL">All Accounts</option>
            <option value="acc-001">Apex Healthcare Group</option>
            <option value="acc-002">Meridian Care Homes</option>
            <option value="acc-003">Pinnacle BioPharma</option>
          </select>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            Loading pending approvals...
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
              No Orders Pending Approval
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              All customer account orders are currently approved or processed.
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(43, 37, 62, 0.08)',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Order Ref</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Customer Account</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Branch / Site</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>PO Number</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Items</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Total Value</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.2s',
                      }}
                    >
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0F172A' }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: '#334155' }}>
                        {order.accountName}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B' }}>
                        {order.siteName} ({order.siteCode})
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A' }}>
                        {order.poReference || '—'}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B' }}>
                        {order.itemCount} units
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0F172A' }}>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <StatusPill status={order.status} size="sm" />
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setActionType('APPROVE');
                              setActionNotes('Authorized by Admin HQ');
                            }}
                            disabled={isPending}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#10B981',
                              color: '#fff',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setActionType('REJECT');
                              setActionNotes('');
                            }}
                            disabled={isPending}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#fff',
                              color: '#EF4444',
                              border: '1px solid #FCA5A5',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
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
                maxWidth: '460px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                margin: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                {actionType === 'APPROVE' ? 'Admin Authorization' : 'Admin Rejection'}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
                Actioning order <strong>{selectedOrder.orderNumber}</strong> (${selectedOrder.totalAmount.toFixed(2)}) for{' '}
                <strong>{selectedOrder.accountName}</strong>.
              </p>

              <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Audit Reason
                  </label>
                  <textarea
                    rows={3}
                    required={actionType === 'REJECT'}
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
                      padding: '8px 14px',
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
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: actionType === 'APPROVE' ? '#10b981' : '#ef4444',
                      color: '#fff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isPending ? 'Processing...' : 'Confirm Action'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
