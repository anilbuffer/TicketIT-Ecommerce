// src/app/admin/reports/monthly-billing/page.tsx
'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Building2,
  Package,
  TrendingUp,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useMonthlyBillingReport } from '@/lib/hooks/useReports';
import { exportBillingReportCSV, downloadCSV } from '@/lib/export/csv';
import { exportBillingReportXLSX } from '@/lib/export/xlsx';
import { printBillingReportPDF } from '@/lib/export/pdf';

export default function MonthlyBillingReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('August 2026');
  const { data: report, isLoading } = useMonthlyBillingReport(selectedPeriod);

  const handleExportCSV = () => {
    if (!report) return;
    const csv = exportBillingReportCSV(report);
    downloadCSV(csv, `billing-report-${selectedPeriod.replace(/\s+/g, '-').toLowerCase()}.csv`);
  };

  const handleExportXLSX = () => {
    if (!report) return;
    exportBillingReportXLSX(report);
  };

  const handlePrintPDF = () => {
    if (!report) return;
    printBillingReportPDF(report);
  };

  return (
    <>
      <AdminHeader
        title="Monthly Consolidated Billing & Spend Report"
        subtitle="Consolidated multi-site invoicing, collateral category allocations, and verified contract billing"
        actionButton={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handlePrintPDF}
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
              <Printer size={15} />
              <span>Print PDF Invoice</span>
            </button>
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
            <button
              type="button"
              onClick={handleExportXLSX}
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
              }}
            >
              <FileSpreadsheet size={15} />
              <span>Export Excel</span>
            </button>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Period Selector & Top Invoicing Summary */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Invoicing Period
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#2B253E',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <option value="August 2026">August 2026 (Active Invoicing)</option>
                <option value="July 2026">July 2026 (Settled)</option>
                <option value="June 2026">June 2026 (Settled)</option>
              </select>
              {report && (
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748B',
                    backgroundColor: '#F1F5F9',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                  }}
                >
                  Invoice Ref: {report.invoiceNumber}
                </span>
              )}
            </div>
          </div>

          {report && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Consolidated Spend</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F73582' }}>
                  ${report.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Active Site Branches</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B253E' }}>
                  {report.activeSitesCount}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Fulfilled Orders</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B253E' }}>
                  {report.totalOrders}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Site Breakdown Table */}
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
                Branch-by-Branch Spend Allocation
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, marginTop: '2px' }}>
                Breakdown feeding the monthly consolidated healthcare network invoice
              </p>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading billing statement...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Site Branch</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Site Code</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Parent Account</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'center' }}>Orders</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Top Collateral Category</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Total Spend (USD)</th>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Billing Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.siteBreakdowns.map((site) => (
                    <tr key={site.siteId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 24px', fontWeight: 700, color: '#2B253E' }}>
                        {site.siteName}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#64748B', fontSize: '0.8rem' }}>
                        {site.siteCode}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#2B253E', fontWeight: 600 }}>
                        {site.accountName}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#2B253E' }}>
                        {site.ordersCount}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}>
                        {site.topCategory}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#F73582' }}>
                        ${site.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <StatusPill status={site.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Spend Allocation */}
        {report && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', marginBottom: '16px' }}>
              Category Spend Distribution (% of Total Budget)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {report.categoryBreakdown.map((cat, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>{cat.category}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B253E', marginTop: '4px' }}>
                    ${cat.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${cat.percentage}%`, height: '100%', backgroundColor: '#F73582', borderRadius: '9999px' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F73582' }}>{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
