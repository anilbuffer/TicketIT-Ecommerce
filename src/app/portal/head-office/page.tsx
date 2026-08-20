'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileSpreadsheet,
  Download,
  Printer,
  DollarSign,
  Store,
  Layers,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { SaaSLayout } from '../../../components/layout/SaaSLayout';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import {
  MONTHLY_BILLING_SUMMARY,
  MOCK_ORDERS,
  SiteOrder,
} from '../../../data/marketingAssets';

function HeadOfficePortalContent() {
  const { user } = useAuth();
  const [billingData] = useState(MONTHLY_BILLING_SUMMARY);
  const [searchSiteQuery, setSearchSiteQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('August 2026');
  const [isPreviewInvoiceOpen, setIsPreviewInvoiceOpen] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filter site breakdowns
  const filteredSites = billingData.siteBreakdowns.filter(
    (s) =>
      s.siteName.toLowerCase().includes(searchSiteQuery.toLowerCase()) ||
      s.siteCode.toLowerCase().includes(searchSiteQuery.toLowerCase()) ||
      s.primaryCategory.toLowerCase().includes(searchSiteQuery.toLowerCase())
  );

  // Live CSV Export Generator
  const handleExportCSV = () => {
    setIsExportingCsv(true);

    setTimeout(() => {
      // Build CSV content
      const headers = [
        'Billing Period',
        'Invoice Ref',
        'Site Code',
        'Site Branch Name',
        'Orders Count',
        'Purchase Orders Count',
        'Primary Collateral Category',
        'Total Spend (USD)',
      ];

      const rows = billingData.siteBreakdowns.map((s) => [
        `"${billingData.period}"`,
        `"${billingData.invoiceNumber}"`,
        `"${s.siteCode}"`,
        `"${s.siteName}"`,
        s.orderCount,
        s.poCount,
        `"${s.primaryCategory}"`,
        s.totalSpend.toFixed(2),
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `Apex_Retail_Consolidated_Billing_Backing_${selectedPeriod.replace(' ', '_')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingCsv(false);
      setExportNotice('CSV Transaction Spreadsheet successfully generated and downloaded.');
      setTimeout(() => setExportNotice(null), 4000);
    }, 800);
  };

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <Container>
        {/* Banner Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e192c 0%, #362f4e 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            color: '#ffffff',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(124, 92, 219, 0.25)',
                color: '#bda6ff',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                border: '1px solid rgba(124, 92, 219, 0.4)',
              }}
            >
              <Building2 size={14} />
              <span>ROLE 02 • CUSTOMER HEAD OFFICE PORTAL</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
              Consolidated Billing & Multi-Site Visibility
            </h1>
            <p style={{ color: '#c3bfd4', fontSize: 'var(--font-size-sm)', maxWidth: '680px', lineHeight: 1.5 }}>
              Enterprise financial backing and order oversight across all 34 retail locations. Download consolidated monthly invoices with line-item spreadsheet reconciliation.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="md"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}
              onClick={() => setIsPreviewInvoiceOpen(true)}
              leftIcon={<Printer size={16} />}
            >
              Print Invoice PDF
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleExportCSV}
              isLoading={isExportingCsv}
              leftIcon={<Download size={16} />}
            >
              Export CSV Backing
            </Button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                TOTAL MONTHLY CONSOLIDATED SPEND
              </span>
              <DollarSign size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
              ${billingData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '0.25rem' }}>
              ↑ 12.4% vs last billing cycle (August 2026)
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                ACTIVE RETAIL SITES
              </span>
              <Store size={18} color="#7c5cdb" />
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
              {billingData.totalSitesActive} Stores
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginTop: '0.25rem' }}>
              100% sites under centralized PO management
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                COLLATERAL DISPATCHED
              </span>
              <Layers size={18} color="#58b97d" />
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
              {billingData.totalItemsDispatched} Units
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginTop: '0.25rem' }}>
              Across {billingData.totalOrders} total site orders
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                INVOICE STATUS
              </span>
              <Clock size={18} color="#d97706" />
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, color: '#d97706', marginTop: '0.25rem' }}>
              {billingData.status}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginTop: '0.35rem' }}>
              Due: {billingData.dueDate}
            </div>
          </div>
        </div>

        {/* Multi-Site Spend Distribution Table */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>
                Site-by-Site Spend Breakdown ({billingData.period})
              </h2>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)' }}>
                Transaction backing for consolidated invoice ref: <strong>{billingData.invoiceNumber}</strong>
              </p>
            </div>

            {/* Search Filter */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search branch name or code..."
                value={searchSiteQuery}
                onChange={(e) => setSearchSiteQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem 0.55rem 2.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: 'rgba(231, 234, 239, 0.4)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', fontWeight: 800 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>SITE CODE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>RETAIL LOCATION</th>
                  <th style={{ padding: '0.75rem 1rem' }}>ORDERS</th>
                  <th style={{ padding: '0.75rem 1rem' }}>PO ALLOCATION</th>
                  <th style={{ padding: '0.75rem 1rem' }}>PRIMARY ASSET CATEGORY</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>CONSOLIDATED SPEND</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site) => (
                  <tr
                    key={site.siteCode}
                    style={{
                      borderBottom: '1px solid rgba(43, 37, 62, 0.08)',
                      transition: 'background 0.2s',
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      <code>{site.siteCode}</code>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                      {site.siteName}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{site.orderCount} Orders</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-sub)' }}>{site.poCount} Active POs</td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          background: 'rgba(231, 234, 239, 0.7)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        {site.primaryCategory}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 900, color: 'var(--color-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      ${site.totalSpend.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Multi-Site Orders Overview */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
              Live Multi-Site Fulfillment Stream
            </h2>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              All 34 Retail Branches
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {MOCK_ORDERS.map((ord) => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(231, 234, 239, 0.35)',
                  border: '1px solid var(--color-border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {ord.siteName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      ({ord.orderNumber})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginTop: '2px' }}>
                    Ordered by <strong>{ord.orderedBy}</strong> • PO: {ord.poNumber} • Date: {new Date(ord.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, color: 'var(--color-secondary)' }}>
                    ${ord.totalValue.toFixed(2)}
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: ord.status === 'Delivered' ? '#059669' : '#2563eb',
                      background: ord.status === 'Delivered' ? '#ecfdf5' : '#eff6ff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Preview Modal */}
        <AnimatePresence>
          {isPreviewInvoiceOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(43, 37, 62, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  width: '100%',
                  maxWidth: '720px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '2.5rem',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', fontWeight: 900 }}>
                      CONSOLIDATED MONTHLY STATEMENT
                    </h2>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Yellow Marketing Delivery Platform • Central Procurement
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                      {billingData.invoiceNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>
                      Period: {billingData.period}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: 'var(--font-size-xs)' }}>
                  <div>
                    <strong>BILLED CLIENT:</strong>
                    <p style={{ color: 'var(--color-text-sub)', marginTop: '4px' }}>
                      Apex Retail Group HQ<br />
                      Attn: Elena Rostova (VP Marketing & Finance)<br />
                      500 Madison Ave, New York, NY
                    </p>
                  </div>
                  <div>
                    <strong>PAYMENT TERMS:</strong>
                    <p style={{ color: 'var(--color-text-sub)', marginTop: '4px' }}>
                      Net 30 Consolidated Account Billing<br />
                      Due Date: {billingData.dueDate}<br />
                      Total Sites Invoiced: 34 Branches
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 'var(--font-size-md)', color: 'var(--color-secondary)' }}>
                    <span>Consolidated Balance Outstanding:</span>
                    <span style={{ color: 'var(--color-primary)' }}>${billingData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <Button variant="outline" size="md" onClick={() => setIsPreviewInvoiceOpen(false)}>
                    Close
                  </Button>
                  <Button variant="primary" size="md" onClick={() => window.print()} leftIcon={<Printer size={16} />}>
                    Print Statement
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CSV Export Success Toast */}
        {exportNotice && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 1000,
              background: '#059669',
              color: '#ffffff',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <CheckCircle size={18} />
            <span>{exportNotice}</span>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function HeadOfficePortalPage() {
  return (
    <AuthGuard allowedRoles={['head_office', 'admin']} requiredPermission="view_consolidated_billing">
      <SaaSLayout>
        <HeadOfficePortalContent />
      </SaaSLayout>
    </AuthGuard>
  );
}
