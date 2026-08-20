// src/app/shop/orders/history/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/lib/services/orders.service';
import type { Order, OrderStatus } from '@/lib/services/types';
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge';
import {
  ClipboardList,
  Search,
  Eye,
  Building2,
  Calendar,
  Package,
  Clock,
  Truck,
  Receipt,
} from 'lucide-react';

export default function SiteOrderHistoryPage() {
  const { user } = useAuth();
  const siteId = user?.siteId || 'site-101';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '30d' | '90d'>('all');

  useEffect(() => {
    async function loadSiteOrders() {
      setIsLoading(true);
      try {
        const res = await getOrders({
          siteId,
          pageSize: 100,
        });
        setOrders(res.items);
      } catch (err) {
        console.error('Failed to load orders for site', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSiteOrders();
  }, [siteId]);

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.poReference && order.poReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.lineItems.some(
        (li) =>
          li.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          li.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      if (dateFilter === '30d') matchesDate = diffDays <= 30;
      if (dateFilter === '90d') matchesDate = diffDays <= 90;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  // Metrics
  const totalSiteSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'RECEIVED' || o.status === 'PROCESSING').length;
  const dispatchedCount = orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'DELIVERED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '64px' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#f73582' }}>
            <Building2 size={14} />
            <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '4px 0 2px 0' }}>
            Site Collateral Order History
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Read-only audit history of orders placed for this site branch.
          </p>
        </div>

        <Link
          href="/shop/catalogue"
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
            boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
          }}
        >
          <Package size={15} /> New Collateral Order
        </Link>
      </div>

      {/* 2. KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '18px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Site Orders</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{orders.length}</span>
            <span style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#334155' }}>
              <ClipboardList size={16} />
            </span>
          </div>
        </div>

        <div style={{ padding: '18px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Active In-Fulfilment</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#d97706' }}>{activeOrdersCount}</span>
            <span style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Clock size={16} />
            </span>
          </div>
        </div>

        <div style={{ padding: '18px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Dispatched & Delivered</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#059669' }}>{dispatchedCount}</span>
            <span style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Truck size={16} />
            </span>
          </div>
        </div>

        <div style={{ padding: '18px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Site Spend</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#f73582' }}>${totalSiteSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#fdf2f8', color: '#f73582' }}>
              <Receipt size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Order #, PO Reference, or Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '9px',
                paddingBottom: '9px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#f8fafc',
                outline: 'none',
              }}
            />
          </div>

          {/* Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={15} color="#64748b" />
            <select
              value={dateFilter}
              onChange={(e: any) => setDateFilter(e.target.value)}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 12px',
                outline: 'none',
              }}
            >
              <option value="all">All Dates</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
          {(['ALL', 'RECEIVED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'] as const).map((status) => {
            const isSelected = statusFilter === status;
            const count =
              status === 'ALL'
                ? orders.length
                : orders.filter((o) => o.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isSelected ? '#2B253E' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#475569',
                  boxShadow: isSelected ? '0 2px 6px rgba(43, 37, 62, 0.2)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {status === 'ALL' ? 'All Statuses' : status.charAt(0) + status.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Orders Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid #fbcfe8',
                borderTopColor: '#f73582',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px auto',
              }}
            />
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Loading site orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#f1f5f9',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <ClipboardList size={26} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>No Orders Found</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {searchQuery || statusFilter !== 'ALL' || dateFilter !== 'all'
                ? 'No past orders matched your filters. Try resetting the search or status filter.'
                : 'No collateral orders have been placed for this branch yet.'}
            </p>
            <Link
              href="/shop/catalogue"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: '#f73582',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Order Marketing Assets
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px' }}>
                  <th style={{ padding: '14px 20px' }}>Order Number</th>
                  <th style={{ padding: '14px 16px' }}>Date Placed</th>
                  <th style={{ padding: '14px 16px' }}>PO Reference</th>
                  <th style={{ padding: '14px 16px' }}>Items / Assets</th>
                  <th style={{ padding: '14px 16px' }}>Fulfilment Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Order Total</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <Link
                        href={`/shop/orders/${order.id}`}
                        style={{ fontWeight: 700, color: '#0f172a', textDecoration: 'none', display: 'block' }}
                      >
                        {order.orderNumber}
                      </Link>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>ID: {order.id}</span>
                    </td>

                    <td style={{ padding: '16px 16px', color: '#475569' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#334155', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                        {order.poReference || '—'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <div style={{ maxWidth: '240px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>
                          {order.itemCount} items ({order.lineItems.length} lines)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {order.lineItems.map((li) => li.productName).join(', ')}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <OrderStatusBadge status={order.status} size="sm" />
                      {order.carrier && (
                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                          {order.carrier}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 900, color: '#0f172a', display: 'block', fontSize: '13px' }}>
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>On-Account</span>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Link
                        href={`/shop/orders/${order.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
