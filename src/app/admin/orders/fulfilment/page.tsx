// src/app/admin/orders/fulfilment/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Kanban,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  User,
  Building,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { OrderActionModal } from '@/components/admin/OrderActionModal';
import { useFulfilmentQueue, useOrderMutations } from '@/lib/hooks/useOrders';
import { useAuth } from '@/context/AuthContext';
import type { Order, OrderStatus } from '@/lib/services/types';

export default function FulfilmentKanbanPage() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const { queue, isLoading, refetch } = useFulfilmentQueue();
  const { updateOrderStatus } = useOrderMutations();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleAdvanceStatus = async (
    order: Order,
    nextStatus: OrderStatus,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!isAdmin) return;
    await updateOrderStatus(order.id, nextStatus);
    refetch();
  };

  const handleStatusUpdate = async (id: string, status: any, metadata?: any) => {
    if (!isAdmin) return;
    await updateOrderStatus(id, status, metadata);
    refetch();
  };

  const columns: {
    id: OrderStatus;
    title: string;
    items: Order[];
    color: string;
    bg: string;
    nextStatus?: OrderStatus;
    nextLabel?: string;
  }[] = [
    {
      id: 'RECEIVED',
      title: 'Received',
      items: queue.received,
      color: '#F73582',
      bg: '#FFF0F6',
      nextStatus: 'PROCESSING',
      nextLabel: 'Start Processing',
    },
    {
      id: 'PROCESSING',
      title: 'Packaging & Staging',
      items: queue.processing,
      color: '#D97706',
      bg: '#FEF3C7',
      nextStatus: 'DISPATCHED',
      nextLabel: 'Dispatch Courier',
    },
    {
      id: 'DISPATCHED',
      title: 'In Transit / Courier',
      items: queue.dispatched,
      color: '#0284C7',
      bg: '#E0F2FE',
      nextStatus: 'DELIVERED',
      nextLabel: 'Confirm Delivery',
    },
    {
      id: 'DELIVERED',
      title: 'Completed & Delivered',
      items: queue.delivered,
      color: '#228B53',
      bg: '#EAF8EF',
    },
  ];

  return (
    <>
      <AdminHeader
        title="Fulfilment & Dispatch Kanban Board"
        subtitle="Real-time multi-stage operational workflow pipeline across active orders"
        actionButton={
          <button
            type="button"
            onClick={() => refetch()}
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
            }}
          >
            <RefreshCw size={15} />
            <span>Refresh Board</span>
          </button>
        }
      />

      <main style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            Loading live fulfilment stage board...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '18px',
              alignItems: 'flex-start',
            }}
          >
            {columns.map((col) => (
              <div
                key={col.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 180px)',
                  overflow: 'hidden',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    padding: '16px 18px',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: col.color,
                      }}
                    />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2B253E' }}>
                      {col.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: col.bg,
                      color: col.color,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {col.items.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div
                  style={{
                    padding: '14px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    flex: 1,
                  }}
                >
                  {col.items.length === 0 ? (
                    <div
                      style={{
                        padding: '30px 14px',
                        textAlign: 'center',
                        color: '#94A3B8',
                        fontSize: '0.78rem',
                        border: '2px dashed #E2E8F0',
                        borderRadius: '12px',
                      }}
                    >
                      No orders in this stage
                    </div>
                  ) : (
                    col.items.map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleOpenOrder(order)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 2px 6px rgba(43, 37, 62, 0.04)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          transition: 'all 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = col.color;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Order Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2B253E' }}>
                            {order.orderNumber}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Branch & Requester */}
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2B253E' }}>
                            {order.siteName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {order.accountName} • PO: {order.poReference || '—'}
                          </div>
                        </div>

                        {/* Items Snapshot */}
                        <div
                          style={{
                            padding: '8px 10px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: '#475569',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 600 }}>{order.itemCount} unit(s) across {order.lineItems.length} item(s)</div>
                            <span style={{ fontWeight: 800, color: '#F73582', fontSize: '0.82rem' }}>${order.totalAmount.toFixed(2)}</span>
                          </div>
                          <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '2px' }}>
                            {order.lineItems[0]?.productName} {order.lineItems.length > 1 ? `+${order.lineItems.length - 1} more` : ''}
                          </div>
                        </div>

                        {/* Card Footer with Advance Button */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid #F1F5F9',
                            paddingTop: '8px',
                            marginTop: '2px',
                          }}
                        >
                          <Link
                            href={`/admin/orders/${order.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#64748B',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <ExternalLink size={11} /> Full Details
                          </Link>

                          {isAdmin && col.nextStatus && col.nextLabel ? (
                            <button
                              type="button"
                              onClick={(e) => handleAdvanceStatus(order, col.nextStatus!, e)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: col.bg,
                                color: col.color,
                                border: `1px solid ${col.color}40`,
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <span>{col.nextLabel}</span>
                              <ArrowRight size={12} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                              {order.carrier ? `${order.carrier}` : 'In queue'}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <OrderActionModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
