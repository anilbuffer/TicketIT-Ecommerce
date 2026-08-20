// src/app/head-office/billing/monthly/[period]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Download, FileSpreadsheet } from 'lucide-react';
import { useHOMonthlyBillingReport } from '@/lib/hooks/useHeadOffice';
import type { HOBillingLineItem } from '@/lib/services/types';

const HO_ACCOUNT_ID = 'acc-001';

function Skeleton({ w = '100%', h = '1rem', br = '8px' }: { w?: string; h?: string; br?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: br,
      background: 'linear-gradient(90deg,#e8eaf0 25%,#f3f4f7 50%,#e8eaf0 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function exportCSV(lineItems: HOBillingLineItem[], period: string, accountName: string) {
  const headers = [
    'Order Number', 'Order Date', 'Account Name', 'Account ID', 'Site Name', 'Site ID', 'Site Code',
    'Ordered By User', 'Ordered By Email', 'PO Reference', 'Product Name', 'SKU', 'Pack Size', 'UOM',
    'Qty', 'Unit Price', 'Line Value', 'Tax Treatment', 'Order Total', 'Ship To Address',
    'Delivery Contact', 'Delivery Instructions', 'Bill To Address', 'Bill To Entity', 'Status', 'Notes',
  ];
  const rows = lineItems.map((li) => [
    li.orderNumber, new Date(li.orderDate).toLocaleDateString('en-US'),
    `"${li.accountName}"`, li.accountId, `"${li.siteName}"`, li.siteId, li.siteCode,
    `"${li.orderedByUser}"`, li.orderedByEmail, li.poReference,
    `"${li.productName}"`, li.sku, `"${li.packSize}"`, li.uom,
    li.qty, li.unitPrice.toFixed(2), li.lineValue.toFixed(2),
    `"${li.taxTreatment}"`, li.orderTotal.toFixed(2),
    `"${li.shipToAddress}"`, `"${li.deliveryContact}"`, `"${li.deliveryInstructions}"`,
    `"${li.billToAddress}"`, `"${li.billToEntity}"`, li.status, `"${li.notes}"`,
  ]);
  const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', `${accountName.replace(/\s+/g, '_')}_Billing_${period}.csv`);
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

export default function HOBillingPeriodPage() {
  const params = useParams();
  const period = params.period as string;
  const { data: report, isLoading } = useHOMonthlyBillingReport(HO_ACCOUNT_ID, period);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#8b8599' }}>
        <Link href="/head-office/dashboard" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
        <ChevronRight size={13} />
        <Link href="/head-office/billing/monthly" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Monthly Billing</Link>
        <ChevronRight size={13} />
        <span style={{ color: '#2b253e', fontWeight: 700 }}>{report?.periodLabel ?? period}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2b253e', marginBottom: '0.25rem' }}>
            {isLoading ? 'Loading Report...' : `${report?.periodLabel} — Billing Report`}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#8b8599' }}>
            {isLoading ? '' : `${report?.accountName} · Invoice Ref: ${report?.invoiceRef}`}
          </p>
        </div>
        {!isLoading && report && (
          <button
            onClick={() => exportCSV(report.lineItems, period, report.accountName)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#F73582', color: '#fff', border: 'none', borderRadius: '10px',
              padding: '0.65rem 1.2rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(247,53,130,0.3)',
            }}>
            <Download size={15} /> Export Full CSV
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.4rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Skeleton h="0.7rem" w="50%" />
                <Skeleton h="2rem" w="70%" />
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} h="0.8rem" w={`${50 + i * 6}%`} />)}
          </div>
        </div>
      ) : !report ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#8b8599' }}>
          <FileSpreadsheet size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p>No billing data found for this period.</p>
          <Link href="/head-office/billing/monthly" style={{ color: '#F73582', fontWeight: 700, textDecoration: 'none' }}>
            ← Back to Billing
          </Link>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            {[
              { label: 'Total Amount Owed', value: `$${report.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: `Invoice: ${report.invoiceRef}` },
              { label: 'Total Orders', value: String(report.totalOrders), sub: `in ${report.periodLabel}` },
              { label: 'Line Items', value: String(report.totalLineItems), sub: 'across all orders' },
              { label: 'Active Sites', value: String(report.activeSitesCount), sub: 'with orders this period' },
            ].map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{c.label}</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#2b253e', lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#8b8599', marginTop: '0.3rem' }}>{c.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Site Breakdown */}
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(43,37,62,0.09)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}>
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(43,37,62,0.07)' }}>
              <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2b253e' }}>Site Breakdown — {report.periodLabel}</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead style={{ background: '#fafafa', borderBottom: '1.5px solid rgba(43,37,62,0.07)' }}>
                <tr>
                  {['Site', 'Site Code', 'Orders', 'Total Spend', '% of Total'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'Total Spend' || h === '% of Total' ? 'right' : 'left', fontSize: '0.65rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.siteBreakdowns.map((s, i) => (
                  <tr key={s.siteId} style={{ borderBottom: i < report.siteBreakdowns.length - 1 ? '1px solid rgba(43,37,62,0.06)' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#2b253e' }}>{s.siteName}</td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#8b8599' }}>{s.siteCode}</td>
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

          {/* Full Reconciliation Table */}
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(43,37,62,0.09)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}>
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(43,37,62,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2b253e' }}>Full Transaction-Level Detail</h2>
                <p style={{ fontSize: '0.72rem', color: '#8b8599', marginTop: '0.2rem' }}>{report.totalLineItems} line items · all reconciliation fields</p>
              </div>
              <button onClick={() => exportCSV(report.lineItems, period, report.accountName)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1.5px solid rgba(247,53,130,0.3)', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#F73582', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                <Download size={13} /> Export
              </button>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '560px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead style={{ background: '#fafafa', position: 'sticky', top: 0, zIndex: 2, borderBottom: '2px solid rgba(43,37,62,0.08)' }}>
                  <tr>
                    {['Order #', 'Date', 'Site', 'Ordered By', 'PO Ref', 'Product', 'SKU', 'Qty', 'Unit Price', 'Line Value', 'Order Total', 'Ship To', 'Bill To', 'Status'].map((h) => (
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
                      <td style={{ padding: '0.65rem 0.75rem', color: '#8b8599', whiteSpace: 'nowrap' }}>
                        {new Date(li.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap', fontWeight: 600 }}>{li.siteName}</td>
                      <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>{li.orderedByUser}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', color: '#8b8599', whiteSpace: 'nowrap', fontSize: '0.7rem' }}>{li.poReference || '—'}</td>
                      <td style={{ padding: '0.65rem 0.75rem', maxWidth: '140px', fontWeight: 600 }}>{li.productName}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', color: '#8b8599', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{li.sku}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>{li.qty}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: '#5c566e', whiteSpace: 'nowrap' }}>${li.unitPrice.toFixed(2)}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 800, whiteSpace: 'nowrap' }}>${li.lineValue.toFixed(2)}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>${li.orderTotal.toFixed(2)}</td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#5c566e', maxWidth: '140px', fontSize: '0.68rem' }}>{li.shipToAddress}</td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#5c566e', maxWidth: '140px', fontSize: '0.68rem' }}>{li.billToAddress}</td>
                      <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '999px',
                          background: li.status === 'DELIVERED' ? '#ecfdf5' : li.status === 'DISPATCHED' ? '#eff6ff' : '#fefce8',
                          color: li.status === 'DELIVERED' ? '#059669' : li.status === 'DISPATCHED' ? '#2563eb' : '#d97706',
                        }}>
                          {li.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back link */}
          <div>
            <Link href="/head-office/billing/monthly" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: '#8b8599', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
            }}>
              ← Back to Billing Periods
            </Link>
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0}}
      `}</style>
    </div>
  );
}
