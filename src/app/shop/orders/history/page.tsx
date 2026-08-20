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
  Filter,
  Eye,
  Building2,
  Calendar,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  Receipt,
  ArrowRight,
  ShieldCheck,
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
          siteId, // STRICT SERVER-SIDE SCOPING TO OWN SITE ONLY
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
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
            <Building2 size={13} className="text-[#F73582]" />
            <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Site Collateral Order History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Read-only audit history of orders placed for this site branch.
          </p>
        </div>

        <Link
          href="/shop/catalogue"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold shadow-sm self-start sm:self-auto transition-all"
        >
          <Package size={14} /> New Collateral Order
        </Link>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Site Orders</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <ClipboardList size={16} />
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active In-Fulfilment</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">{activeOrdersCount}</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={16} />
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Dispatched & Delivered</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">{dispatchedCount}</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Truck size={16} />
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Site Spend</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#F73582]">${totalSiteSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className="p-2 rounded-xl bg-pink-50 text-[#F73582]">
              <Receipt size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order #, PO Reference, or Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F73582] focus:ring-2 focus:ring-pink-100 bg-slate-50/50"
            />
          </div>

          {/* Date Filter Selector */}
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-slate-400 shrink-0" />
            <select
              value={dateFilter}
              onChange={(e: any) => setDateFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#F73582]"
            >
              <option value="all">All Dates</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
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
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2B253E] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All Statuses' : status.charAt(0) + status.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-pink-200 border-t-[#F73582] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading site orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ClipboardList size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
              {searchQuery || statusFilter !== 'ALL' || dateFilter !== 'all'
                ? 'No past orders matched your filters. Try resetting the search or status filter.'
                : 'No collateral orders have been placed for this branch yet.'}
            </p>
            <Link
              href="/shop/catalogue"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F73582] text-white text-xs font-bold shadow-sm"
            >
              Order Marketing Assets
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Order Number</th>
                  <th className="py-3.5 px-4">Date Placed</th>
                  <th className="py-3.5 px-4">PO Reference</th>
                  <th className="py-3.5 px-4">Items / Assets</th>
                  <th className="py-3.5 px-4">Fulfilment Status</th>
                  <th className="py-3.5 px-4 text-right">Order Total</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <Link
                        href={`/shop/orders/${order.id}`}
                        className="font-bold text-slate-900 hover:text-[#F73582] transition-colors block"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="text-[11px] font-mono text-slate-400">ID: {order.id}</span>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {order.poReference || '—'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="max-w-[220px]">
                        <span className="font-semibold text-slate-800 block">
                          {order.itemCount} items ({order.lineItems.length} lines)
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {order.lineItems.map((li) => li.productName).join(', ')}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <OrderStatusBadge status={order.status} size="sm" />
                      {order.carrier && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {order.carrier}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-extrabold text-slate-900 block">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">On-Account</span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <Link
                        href={`/shop/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
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
