// src/app/head-office/orders/all/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Download, X } from 'lucide-react';
import { useOrders } from '@/lib/hooks/useOrders';
import { StatusPill } from '@/components/admin/StatusPill';
import type { OrderStatus } from '@/lib/services/types';

const HO_ACCOUNT_ID = 'acc-001';

const SITES = [
  { id: 'all', name: 'All Sites' },
  { id: 'site-101', name: 'APX-MID-101 — Apex Midtown' },
  { id: 'site-102', name: 'APX-BK-102 — Apex Brooklyn' },
  { id: 'site-106', name: 'APX-QNS-106 — Apex Queens' },
];
const STATUSES: Array<{ id: OrderStatus | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'All Statuses' },
  { id: 'RECEIVED', label: 'Received' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'DISPATCHED', label: 'Dispatched' },
  { id: 'DELIVERED', label: 'Delivered' },
];

function Skeleton({ w = '100%', h = '1rem', br = '8px' }: { w?: string; h?: string; br?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: br,
      background: 'linear-gradient(90deg,#e8eaf0 25%,#f3f4f7 50%,#e8eaf0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

export default function HOOrdersAllPage() {
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch all orders for this account — scoped at service layer
  const { data: ordersData, isLoading } = useOrders({
    accountId: HO_ACCOUNT_ID,
    pageSize: 100,
  });

  // Client-side filter (additional refinement after server-side account scoping)
  const filteredOrders = useMemo(() => {
    if (!ordersData) return [];
    let results = ordersData.items;

    if (siteFilter !== 'all') results = results.filter((o) => o.siteId === siteFilter);
    if (statusFilter !== 'ALL') results = results.filter((o) => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.poReference && o.poReference.toLowerCase().includes(q)) ||
          o.siteName.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q)
      );
    }
    if (startDate) results = results.filter((o) => new Date(o.createdAt) >= new Date(startDate));
    if (endDate) results = results.filter((o) => new Date(o.createdAt) <= new Date(endDate + 'T23:59:59Z'));

    return results;
  }, [ordersData, siteFilter, statusFilter, search, startDate, endDate]);

  const clearFilters = () => {
    setSearch(''); setSiteFilter('all'); setStatusFilter('ALL');
    setStartDate(''); setEndDate('');
  };
  const hasFilters = search || siteFilter !== 'all' || statusFilter !== 'ALL' || startDate || endDate;

  const handleExportCSV = () => {
    const headers = ['Order #', 'Site Code', 'Site Name', 'Ordered By', 'PO Reference', 'Date', 'Items', 'Value', 'Status'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber, o.siteCode, `"${o.siteName}"`, `"${o.userName}"`,
      o.poReference ?? '', new Date(o.createdAt).toLocaleDateString('en-US'),
      o.itemCount, o.totalAmount.toFixed(2), o.status,
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `Apex_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.78rem', color: '#8b8599' }}>
            <Link href="/head-office/dashboard" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#2b253e', fontWeight: 700 }}>Cross-Site Orders</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2b253e', marginBottom: '0.25rem' }}>
            Cross-Site Order List
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#8b8599' }}>
            All orders across Apex Healthcare Group sites — read only
          </p>
        </div>
        <button onClick={handleExportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#F73582', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '0.6rem 1.15rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(247,53,130,0.3)',
          }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '1.25rem',
        border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)',
        display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8b8599' }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, PO ref, site, user..."
            style={{
              width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              border: '1.5px solid rgba(43,37,62,0.12)', borderRadius: '10px',
              fontSize: '0.82rem', background: '#f8f9fc', outline: 'none',
            }}
          />
        </div>
        {/* Site filter */}
        <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}
          style={{ padding: '0.6rem 0.9rem', border: '1.5px solid rgba(43,37,62,0.12)', borderRadius: '10px', fontSize: '0.82rem', background: '#f8f9fc', outline: 'none' }}>
          {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {/* Status filter */}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
          style={{ padding: '0.6rem 0.9rem', border: '1.5px solid rgba(43,37,62,0.12)', borderRadius: '10px', fontSize: '0.82rem', background: '#f8f9fc', outline: 'none' }}>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {/* Date range */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '0.55rem 0.75rem', border: '1.5px solid rgba(43,37,62,0.12)', borderRadius: '10px', fontSize: '0.82rem', background: '#f8f9fc', outline: 'none' }} />
          <span style={{ color: '#8b8599', fontSize: '0.8rem' }}>to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '0.55rem 0.75rem', border: '1.5px solid rgba(43,37,62,0.12)', borderRadius: '10px', fontSize: '0.82rem', background: '#f8f9fc', outline: 'none' }} />
        </div>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: 'none', border: '1.5px solid rgba(43,37,62,0.15)', borderRadius: '10px',
            padding: '0.6rem 0.9rem', fontSize: '0.78rem', fontWeight: 700, color: '#5c566e', cursor: 'pointer',
          }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.78rem', color: '#8b8599', fontWeight: 600, marginTop: '-8px' }}>
        {isLoading ? 'Loading...' : `${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead style={{ background: '#fafafa', borderBottom: '2px solid rgba(43,37,62,0.08)' }}>
              <tr>
                {['Order #', 'Site', 'Ordered By', 'PO Reference', 'Date', 'Items', 'Value', 'Status', ''].map((h) => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [0, 1, 2, 3, 4].map((i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(43,37,62,0.06)' }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                      <td key={j} style={{ padding: '0.9rem 1rem' }}>
                        <Skeleton h="0.8rem" w={j === 0 ? '100px' : j === 1 ? '140px' : '80px'} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#8b8599' }}>
                        <Filter size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                        <div style={{ fontWeight: 700 }}>No orders match your filters</div>
                        <button onClick={clearFilters} style={{ marginTop: '0.5rem', color: '#F73582', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o, idx) => (
                      <motion.tr key={o.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18, delay: idx * 0.02 }}
                        style={{ borderBottom: '1px solid rgba(43,37,62,0.06)', cursor: 'default' }}
                      >
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#F73582', whiteSpace: 'nowrap' }}>
                          {o.orderNumber}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: '#2b253e', fontSize: '0.8rem' }}>{o.siteName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#8b8599' }}>{o.siteCode}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#5c566e', whiteSpace: 'nowrap' }}>{o.userName}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#8b8599', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {o.poReference ?? '—'}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#8b8599', whiteSpace: 'nowrap' }}>
                          {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 600, color: '#5c566e' }}>{o.itemCount}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2b253e', whiteSpace: 'nowrap' }}>
                          ${o.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <StatusPill status={o.status as OrderStatus} />
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <Link href={`/head-office/orders/${o.id}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            color: '#F73582', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
                            background: 'rgba(247,53,130,0.08)', padding: '0.3rem 0.65rem', borderRadius: '8px',
                          }}>
                            View <ChevronRight size={12} />
                          </Link>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
