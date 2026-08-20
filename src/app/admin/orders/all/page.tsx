// src/app/admin/orders/all/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Search,
  Download,
  ExternalLink,
  Plus,
  Truck,
  Eye,
  CheckCircle,
  Clock,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { OrderActionModal } from '@/components/admin/OrderActionModal';
import { useOrders, useOrderMutations } from '@/lib/hooks/useOrders';
import { exportOrdersCSV, downloadCSV } from '@/lib/export/csv';
import type { Order, OrderStatus } from '@/lib/services/types';
import { useAuth } from '@/context/AuthContext';

export default function AllOrdersPage() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: ordersData, isLoading, refetch } = useOrders({
    status: selectedStatus,
    search: searchQuery || undefined,
  });

  const { updateOrderStatus } = useOrderMutations();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: any, metadata?: any) => {
    await updateOrderStatus(id, status, metadata);
    refetch();
  };

  const handleExportCSV = () => {
    if (!ordersData?.items) return;
    const csv = exportOrdersCSV(ordersData.items);
    downloadCSV(csv, `all-orders-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const statusTabs: { id: OrderStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'RECEIVED', label: 'Received' },
    { id: 'PROCESSING', label: 'Processing' },
    { id: 'DISPATCHED', label: 'Dispatched' },
    { id: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <>
      <AdminHeader
        title="Live Orders & Fulfilment Log"
        subtitle="Operational command center: monitor branch orders, inspect line items, assign dispatch tracking"
        actionButton={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleExportCSV}
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
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <Link
              href="/admin/orders/fulfilment"
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
                textDecoration: 'none',
              }}
            >
              <Truck size={15} />
              <span>Fulfilment Board</span>
            </Link>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status Filter Tabs & Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(43, 37, 62, 0.04)',
            flexWrap: 'wrap',
          }}
        >
          {/* Status Pills Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
            {statusTabs.map((tab) => {
              const isActive = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#F73582' : '#64748B',
                    boxShadow: isActive ? '0 2px 6px rgba(43, 37, 62, 0.08)' : 'none',
                    transition: 'all 150ms ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px 12px',
              minWidth: '280px',
            }}
          >
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by order #, PO, site, courier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.85rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              Loading operational orders from service layer...
            </div>
          ) : !ordersData?.items.length ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <ShoppingCart size={36} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 700, color: '#2B253E' }}>No orders matching current filter</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Order #</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Date Placed</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Branch & Org</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>PO Reference</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Logistics / Waybill</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Total Amount</th>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.items.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => handleOpenOrder(order)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF8FB')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 24px', fontWeight: 800, color: '#2B253E' }}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: '#2B253E',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{order.orderNumber}</span>
                          <ExternalLink size={12} color="#94A3B8" />
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#2B253E' }}>
                        <div style={{ fontWeight: 600 }}>{order.siteName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{order.accountName}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#475569' }}>
                        {order.poReference || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusPill status={order.status} />
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                        <div>{order.carrier || 'Unassigned'}</div>
                        {order.trackingNumber && (
                          <div style={{ fontFamily: 'monospace', color: '#F73582', fontWeight: 600 }}>
                            {order.trackingNumber}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#2B253E' }}>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenOrder(order);
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#2B253E',
                              color: '#FFFFFF',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            Action
                          </button>
                        ) : (
                          <Link
                            href={`/admin/orders/${order.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              color: '#475569',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
