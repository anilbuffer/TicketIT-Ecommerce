// src/app/admin/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Kanban,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  Package,
  Clock,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { OrderActionModal } from '@/components/admin/OrderActionModal';
import { useDashboardKPIs } from '@/lib/hooks/useReports';
import { useOrders, useOrderMutations } from '@/lib/hooks/useOrders';
import type { Order } from '@/lib/services/types';

export default function AdminDashboardPage() {
  const { data: kpis, isLoading: isKpisLoading } = useDashboardKPIs();
  const { data: ordersData, isLoading: isOrdersLoading, refetch: refetchOrders } = useOrders({ pageSize: 6 });
  const { updateOrderStatus } = useOrderMutations();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: any, metadata?: any) => {
    await updateOrderStatus(id, status, metadata);
    refetchOrders();
  };

  return (
    <>
      <AdminHeader
        title="Operational Platform Overview"
        subtitle="Live multi-tenant marketing collateral orders, fulfilment pipeline & consolidated revenue dashboard"
        actionButton={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/admin/catalogue/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#2B253E',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Package size={15} />
              <span>Catalogue</span>
            </Link>
            <Link
              href="/admin/orders/all"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#F73582',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(247, 53, 130, 0.25)',
              }}
            >
              <Plus size={15} />
              <span>Manage Orders</span>
            </Link>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* KPI Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
          }}
        >
          {/* Card 1: Monthly Spend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Total Monthly Volume
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#FFF0F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarSign size={18} color="#F73582" />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B253E', letterSpacing: '-0.02em' }}>
                ${kpis?.totalRevenueMonth ? kpis.totalRevenueMonth.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '36,850.00'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
                <span style={{ color: '#58B97D', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={14} style={{ marginRight: '2px' }} /> +14.8%
                </span>
                <span style={{ color: '#94A3B8' }}>vs last month</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Active Orders */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Active Fulfillment Orders
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCart size={18} color="#D97706" />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B253E', letterSpacing: '-0.02em' }}>
                {ordersData?.total || 5} Orders
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
                <span style={{ color: '#58B97D', fontWeight: 700 }}>100% on SLA</span>
                <span style={{ color: '#94A3B8' }}>• 2 in packaging</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Fulfilment Queue */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Fulfilment Kanban
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Kanban size={18} color="#0284C7" />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B253E', letterSpacing: '-0.02em' }}>
                4 Active Stages
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
                <Link href="/admin/orders/fulfilment" style={{ color: '#F73582', fontWeight: 700, textDecoration: 'none' }}>
                  Open Kanban Board →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Network Scale */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Client Branches
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#EAF8EF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={18} color="#58B97D" />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B253E', letterSpacing: '-0.02em' }}>
                5 Active Sites
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
                <span style={{ color: '#58B97D', fontWeight: 700 }}>3 Enterprise Clients</span>
                <span style={{ color: '#94A3B8' }}>• Tiered rate cards</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Operational Orders Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2B253E', margin: 0 }}>
                Recent Operational Orders
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, marginTop: '2px' }}>
                Click any order to inspect full line items, assign dispatch tracking, or transition status.
              </p>
            </div>
            <Link
              href="/admin/orders/all"
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#F73582',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
              }}
            >
              <span>View all orders</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {isOrdersLoading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748B', fontSize: '0.88rem' }}>
              Loading operational orders from service layer...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Order Ref</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Branch & Account</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>PO Reference</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'center' }}>Items</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Total Amount</th>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData?.items.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => handleOpenOrder(order)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F6')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 24px', fontWeight: 700, color: '#2B253E' }}>
                        <div>{order.orderNumber}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#2B253E' }}>
                        <div style={{ fontWeight: 600 }}>{order.siteName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{order.accountName}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {order.poReference || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusPill status={order.status} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#2B253E' }}>
                        {order.itemCount}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#2B253E' }}>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              color: '#475569',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <ChevronRight size={11} /> Full Details
                          </Link>
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
                              border: 'none',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Split: Revenue Trend & Quick Category Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Revenue Trend Visual */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', margin: 0 }}>
                  Consolidated Monthly Spend Trend
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, marginTop: '2px' }}>
                  Aggregated across all branches and active rate-card agreements
                </p>
              </div>
              <Link
                href="/admin/reports/monthly-billing"
                style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F73582', textDecoration: 'none' }}
              >
                Full Report →
              </Link>
            </div>

            {/* Simple CSS-rendered bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', paddingTop: '20px' }}>
              {kpis?.revenueTrend.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2B253E' }}>
                    ${(t.spend / 1000).toFixed(1)}k
                  </div>
                  <div
                    style={{
                      width: '36px',
                      height: `${(t.spend / 40000) * 110}px`,
                      backgroundColor: idx === kpis.revenueTrend.length - 1 ? '#F73582' : '#2B253E',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 200ms ease',
                    }}
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    {t.month}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', margin: 0 }}>
                Operations Shortcuts
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, marginTop: '2px', marginBottom: '16px' }}>
                Quick workflows for administrator duty
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/admin/orders/fulfilment"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'none',
                    color: '#2B253E',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Kanban size={16} color="#F73582" />
                    <span>Fulfilment Stage Board</span>
                  </div>
                  <ChevronRight size={14} color="#94A3B8" />
                </Link>

                <Link
                  href="/admin/pricing/rate-cards"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'none',
                    color: '#2B253E',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DollarSign size={16} color="#58B97D" />
                    <span>Rate Cards & Pricing Tiers</span>
                  </div>
                  <ChevronRight size={14} color="#94A3B8" />
                </Link>

                <Link
                  href="/admin/reports/audit-log"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'none',
                    color: '#2B253E',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={16} color="#0284C7" />
                    <span>HIPAA / Enterprise Audit Trail</span>
                  </div>
                  <ChevronRight size={14} color="#94A3B8" />
                </Link>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#FFF0F6',
                border: '1px solid rgba(247, 53, 130, 0.2)',
                fontSize: '0.75rem',
                color: '#B01654',
              }}
            >
              <strong>Platform Notice:</strong> Mock adapter running with simulated latency. Stable service interface active.
            </div>
          </div>
        </div>
      </main>

      {/* Order Inspection / Status Action Modal */}
      <OrderActionModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
