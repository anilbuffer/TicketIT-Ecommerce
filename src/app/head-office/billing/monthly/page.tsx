// src/app/head-office/billing/monthly/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, Download, ChevronRight, Calendar, RefreshCw, BarChart3 } from 'lucide-react';
import { useHOMonthlyBillingReport } from '@/lib/hooks/useHeadOffice';
import type { HOBillingLineItem } from '@/lib/services/types';

const HO_ACCOUNT_ID = 'acc-001';

const AVAILABLE_PERIODS = [
  { key: 'august-2026', label: 'August 2026', shortLabel: 'Aug 26' },
  { key: 'july-2026', label: 'July 2026', shortLabel: 'Jul 26' },
  { key: 'june-2026', label: 'June 2026', shortLabel: 'Jun 26' },
];

function Skeleton({ w = '100%', h = '1rem', br = '8px' }: { w?: string; h?: string; br?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: br,
      background: 'linear-gradient(90deg,#e8eaf0 25%,#f3f4f7 50%,#e8eaf0 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
    >
      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#2b253e', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#8b8599', marginTop: '0.3rem' }}>{sub}</div>}
    </motion.div>
  );
}

function CategoryBar({ category, spend, pct, index }: { category: string; spend: number; pct: number; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2b253e' }}>{category}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F73582' }}>
          ${spend.toLocaleString('en-US', { minimumFractionDigits: 0 })} <span style={{ color: '#8b8599', fontWeight: 600 }}>({pct.toFixed(1)}%)</span>
        </span>
      </div>
      <div style={{ height: '8px', background: '#e7eaef', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.85rem' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, delay: index * 0.07, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, #F73582, #ff7b83)`, borderRadius: '999px' }}
        />
      </div>
    </motion.div>
  );
}

function exportCSV(lineItems: HOBillingLineItem[], period: string, accountName: string) {
  const headers = [
    'Order Number', 'Order Date',
    'Account Name', 'Account ID', 'Site Name', 'Site ID', 'Site Code',
    'Ordered By User', 'Ordered By Email', 'PO Reference',
    'Product Name', 'SKU', 'Pack Size', 'UOM',
    'Qty', 'Unit Price', 'Line Value', 'Tax Treatment', 'Order Total',
    'Ship To Address', 'Delivery Contact', 'Delivery Instructions',
    'Bill To Address', 'Bill To Entity', 'Status', 'Notes',
  ];

  const rows = lineItems.map((li) => [
    li.orderNumber,
    new Date(li.orderDate).toLocaleDateString('en-US'),
    `"${li.accountName}"`, li.accountId,
    `"${li.siteName}"`, li.siteId, li.siteCode,
    `"${li.orderedByUser}"`, li.orderedByEmail,
    li.poReference,
    `"${li.productName}"`, li.sku, `"${li.packSize}"`, li.uom,
    li.qty, li.unitPrice.toFixed(2), li.lineValue.toFixed(2),
    `"${li.taxTreatment}"`, li.orderTotal.toFixed(2),
    `"${li.shipToAddress}"`, `"${li.deliveryContact}"`, `"${li.deliveryInstructions}"`,
    `"${li.billToAddress}"`, `"${li.billToEntity}"`,
    li.status, `"${li.notes}"`,
  ]);

  const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', `${accountName.replace(/\s+/g, '_')}_Billing_${period}.csv`);
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

export default function HOMonthlyBillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('august-2026');
  const { data: report, isLoading } = useHOMonthlyBillingReport(HO_ACCOUNT_ID, selectedPeriod);
  const [showBacking, setShowBacking] = useState(false);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.78rem', color: '#8b8599' }}>
          <Link href="/head-office/dashboard" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
          <ChevronRight size={13} />
          <span style={{ color: '#2b253e', fontWeight: 700 }}>Monthly Billing</span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2b253e', marginBottom: '0.25rem' }}>
          Consolidated Monthly Billing
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#8b8599' }}>
          Generate monthly billing summaries with full transaction-level reconciliation detail.
        </p>
      </div>

      {/* Period selector + Actions */}
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
        border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 300px' }}>
          <Calendar size={17} color="#F73582" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2b253e' }}>Billing Period:</span>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ padding: '0.55rem 1rem', border: '1.5px solid rgba(43,37,62,0.15)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, color: '#2b253e', background: '#fafafa', outline: 'none' }}
          >
            {AVAILABLE_PERIODS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowBacking(!showBacking)} style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.6rem 1.1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700,
            border: `1.5px solid ${showBacking ? '#F73582' : 'rgba(43,37,62,0.15)'}`,
            background: showBacking ? 'rgba(247,53,130,0.06)' : '#fafafa',
            color: showBacking ? '#F73582' : '#5c566e', cursor: 'pointer',
          }}>
            <BarChart3 size={15} />
            {showBacking ? 'Hide' : 'Show'} Line Detail
          </button>

          {report && (
            <button
              onClick={() => exportCSV(report.lineItems, selectedPeriod, report.accountName)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: '#F73582', color: '#fff', border: 'none', borderRadius: '10px',
                padding: '0.6rem 1.15rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(247,53,130,0.3)',
              }}>
              <Download size={15} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.4rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Skeleton h="0.7rem" w="60%" />
                  <Skeleton h="2rem" w="80%" />
                  <Skeleton h="0.7rem" w="40%" />
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Skeleton h="0.8rem" w={`${40 + i * 5}%`} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b8599', fontSize: '0.82rem', fontWeight: 600 }}>
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Generating billing report…
            </div>
          </motion.div>
        ) : report ? (
          <motion.div key={selectedPeriod} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              <SummaryCard label="Total Amount Owed"
                value={`$${report.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                sub={`Invoice: ${report.invoiceRef}`}
              />
              <SummaryCard label="Total Orders" value={String(report.totalOrders)} sub={`in ${report.periodLabel}`} />
              <SummaryCard label="Line Items" value={String(report.totalLineItems)} sub="across all orders" />
              <SummaryCard label="Active Sites" value={String(report.activeSitesCount)} sub="with orders this period" />
            </div>

            {/* Site Breakdown + Category Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '24px' }}>
              {/* Site Breakdown Table */}
              <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(43,37,62,0.09)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}>
                <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(43,37,62,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2b253e' }}>Site Breakdown</h2>
                  <span style={{ fontSize: '0.7rem', color: '#8b8599', fontWeight: 600 }}>{report.periodLabel}</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead style={{ borderBottom: '1.5px solid rgba(43,37,62,0.07)' }}>
                      <tr>
                        {['Site', 'Orders', 'Total Spend', '% of Total'].map((h) => (
                          <th key={h} style={{ padding: '0.7rem 1rem', textAlign: h === 'Total Spend' || h === '% of Total' ? 'right' : 'left', fontSize: '0.65rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.siteBreakdowns.map((s, i) => (
                        <tr key={s.siteId} style={{ borderBottom: i < report.siteBreakdowns.length - 1 ? '1px solid rgba(43,37,62,0.06)' : 'none' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: '#2b253e', fontSize: '0.8rem' }}>{s.siteName}</div>
                            <div style={{ fontSize: '0.7rem', color: '#8b8599' }}>{s.siteCode}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#5c566e' }}>{s.ordersCount}</td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#2b253e' }}>
                            ${s.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#F73582' }}>
                            {s.percentageOfTotal.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(43,37,62,0.09)', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}>
                <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2b253e', marginBottom: '1.25rem' }}>Spend by Category</h2>
                {report.categoryBreakdown.map((c, i) => (
                  <CategoryBar key={c.category} category={c.category} spend={c.spend} pct={c.percentage} index={i} />
                ))}
              </div>
            </div>

            {/* Backing Detail Table */}
            <AnimatePresence>
              {showBacking && (
                <motion.div key="backing" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: '#fff', borderRadius: '18px', border: '1px solid rgba(43,37,62,0.09)',
                    overflow: 'hidden', boxShadow: '0 2px 8px rgba(43,37,62,0.04)',
                  }}
                >
                  <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(43,37,62,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2b253e' }}>Transaction-Level Reconciliation Detail</h2>
                      <p style={{ fontSize: '0.72rem', color: '#8b8599', marginTop: '0.2rem' }}>{report.totalLineItems} line items · all reconciliation fields</p>
                    </div>
                    <button onClick={() => exportCSV(report.lineItems, selectedPeriod, report.accountName)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1.5px solid rgba(247,53,130,0.3)', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#F73582', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      <Download size={13} /> Export
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <thead style={{ background: '#fafafa', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid rgba(43,37,62,0.08)' }}>
                        <tr>
                          {['Order #', 'Date', 'Account', 'Site', 'Site Code', 'Ordered By', 'PO Ref', 'Product', 'SKU', 'Pack', 'UOM', 'Qty', 'Unit Price', 'Line Value', 'Tax', 'Order Total', 'Ship To', 'Bill To', 'Status'].map((h) => (
                            <th key={h} style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontSize: '0.62rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {report.lineItems.map((li, i) => (
                          <tr key={`${li.orderNumber}-${li.sku}-${i}`}
                            style={{ borderBottom: '1px solid rgba(43,37,62,0.05)', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}
                          >
                            <td style={{ padding: '0.65rem 0.75rem', fontWeight: 800, color: '#F73582', whiteSpace: 'nowrap' }}>{li.orderNumber}</td>
                            <td style={{ padding: '0.65rem 0.75rem', color: '#8b8599', whiteSpace: 'nowrap' }}>{new Date(li.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                            <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{li.accountName}</td>
                            <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>{li.siteName}</td>
                            <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', color: '#8b8599', whiteSpace: 'nowrap' }}>{li.siteCode}</td>
                            <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>{li.orderedByUser}</td>
                            <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', color: '#8b8599', whiteSpace: 'nowrap' }}>{li.poReference || '—'}</td>
                            <td style={{ padding: '0.65rem 0.75rem', maxWidth: '160px', fontWeight: 600 }}>{li.productName}</td>
                            <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', color: '#8b8599', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{li.sku}</td>
                            <td style={{ padding: '0.65rem 0.75rem', color: '#5c566e', whiteSpace: 'nowrap' }}>{li.packSize || '—'}</td>
                            <td style={{ padding: '0.65rem 0.75rem', color: '#5c566e', whiteSpace: 'nowrap' }}>{li.uom || '—'}</td>
                            <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>{li.qty}</td>
                            <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: '#5c566e', whiteSpace: 'nowrap' }}>${li.unitPrice.toFixed(2)}</td>
                            <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 800, whiteSpace: 'nowrap' }}>${li.lineValue.toFixed(2)}</td>
                            <td style={{ padding: '0.65rem 0.75rem', color: '#8b8599', whiteSpace: 'nowrap', fontSize: '0.68rem' }}>{li.taxTreatment}</td>
                            <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>${li.orderTotal.toFixed(2)}</td>
                            <td style={{ padding: '0.65rem 0.75rem', color: '#5c566e', maxWidth: '160px', fontSize: '0.68rem' }}>{li.shipToAddress}</td>
                            <td style={{ padding: '0.65rem 0.75rem', color: '#5c566e', maxWidth: '160px', fontSize: '0.68rem' }}>{li.billToAddress}</td>
                            <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>
                              <span style={{
                                fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '999px',
                                background: li.status === 'DELIVERED' ? '#ecfdf5' : li.status === 'DISPATCHED' ? '#eff6ff' : li.status === 'PROCESSING' ? '#fefce8' : '#f3f4f6',
                                color: li.status === 'DELIVERED' ? '#059669' : li.status === 'DISPATCHED' ? '#2563eb' : li.status === 'PROCESSING' ? '#d97706' : '#6b7280',
                              }}>
                                {li.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Historical period links */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2b253e', marginBottom: '0.85rem' }}>Historical Reports</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {AVAILABLE_PERIODS.map((p) => (
                  <Link key={p.key} href={`/head-office/billing/monthly/${p.key}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.6rem 1rem', borderRadius: '10px',
                      border: `1.5px solid ${p.key === selectedPeriod ? '#F73582' : 'rgba(43,37,62,0.12)'}`,
                      background: p.key === selectedPeriod ? 'rgba(247,53,130,0.06)' : '#fafafa',
                      color: p.key === selectedPeriod ? '#F73582' : '#5c566e',
                      fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none',
                    }}>
                    <FileSpreadsheet size={14} /> {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0}}
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
