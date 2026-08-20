// src/app/head-office/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ShoppingCart, Building2, DollarSign,
  ChevronRight, ArrowUpRight, FileSpreadsheet, BarChart3,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useHODashboardKPIs } from '@/lib/hooks/useHeadOffice';
import { StatusPill } from '@/components/admin/StatusPill';
import type { OrderStatus } from '@/lib/services/types';

// ─── Constants ───────────────────────────────────────────────────────────────
const HO_ACCOUNT_ID = 'acc-001'; // Apex Healthcare Group — demo Head Office account

// ─── Animation Variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = '1rem', br = '8px' }: { w?: string; h?: string; br?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: br,
      background: 'linear-gradient(90deg, #e8eaf0 25%, #f3f4f7 50%, #e8eaf0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

// ─── Spend Trend SVG Chart ────────────────────────────────────────────────────
function SpendTrendChart({ data }: { data: { month: string; spend: number }[] }) {
  if (!data || data.length === 0) return null;
  const maxSpend = Math.max(...data.map((d) => d.spend), 1);
  const W = 480, H = 120, PAD = 16;
  const points = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - 2 * PAD),
    y: H - PAD - ((d.spend / maxSpend) * (H - 2 * PAD)),
    spend: d.spend,
    month: d.month,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F73582" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F73582" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((pct) => (
        <line key={pct}
          x1={PAD} y1={H - PAD - pct * (H - 2 * PAD)}
          x2={W - PAD} y2={H - PAD - pct * (H - 2 * PAD)}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}
      {/* Area fill */}
      <motion.path d={areaD} fill="url(#areaGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
      {/* Line */}
      <motion.path d={pathD} fill="none" stroke="#F73582" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#F73582" stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={H} textAnchor="middle" fontSize="9" fill="#8b8599" fontFamily="inherit" fontWeight="600">
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Bar chart for site spend ─────────────────────────────────────────────────
function SiteSpendBar({ siteName, spend, pct, index }: { siteName: string; spend: number; pct: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.25 }}
      style={{ marginBottom: '0.75rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2b253e' }}>{siteName}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F73582' }}>
          ${spend.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </span>
      </div>
      <div style={{ height: '8px', background: '#e7eaef', borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #F73582, #ff7b83)', borderRadius: '999px' }}
        />
      </div>
    </motion.div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KPICard({
  label, value, delta, deltaPositive, icon, subtitle, index,
}: {
  label: string; value: string; delta?: string; deltaPositive?: boolean;
  icon: React.ReactNode; subtitle?: string; index: number;
}) {
  return (
    <motion.div variants={cardVariants}
      style={{
        background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
        border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <div style={{ color: '#F73582', background: 'rgba(247,53,130,0.1)', borderRadius: '8px', padding: '6px' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2b253e', lineHeight: 1 }}>{value}</div>
      {subtitle && (
        <div style={{ fontSize: '0.72rem', color: '#8b8599', marginTop: '0.35rem' }}>{subtitle}</div>
      )}
      {delta && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem',
          fontSize: '0.72rem', fontWeight: 700,
          color: deltaPositive ? '#059669' : '#dc2626',
        }}>
          {deltaPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta} vs last month
        </div>
      )}
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HODashboardPage() {
  const { user } = useAuth();
  const { data: kpis, isLoading } = useHODashboardKPIs(HO_ACCOUNT_ID);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e192c 0%, #2b253e 60%, #362f4e 100%)',
        borderRadius: '24px', padding: '2rem 2.25rem',
        boxShadow: '0 8px 32px rgba(43,37,62,0.18)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(247,53,130,0.2)', color: '#f73582',
            padding: '0.3rem 0.85rem', borderRadius: '999px',
            fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.85rem',
            border: '1px solid rgba(247,53,130,0.35)',
          }}>
            <Building2 size={13} />
            CUSTOMER HEAD OFFICE • MULTI-SITE VISIBILITY
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: '#ffffff', fontWeight: 900, marginBottom: '0.4rem' }}>
            {isLoading ? 'Loading...' : kpis?.accountName ?? 'Head Office Dashboard'}
          </h1>
          <p style={{ color: '#a09cbf', fontSize: '0.88rem', maxWidth: '560px' }}>
            Consolidated spend visibility across all sites — read-only access, monthly billing & reporting.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/head-office/approvals" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#F59E0B', color: '#ffffff',
            border: '1px solid transparent', borderRadius: '10px',
            padding: '0.6rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
          }}>
            <span>⚖️ Approvals Queue</span>
          </Link>
          <Link href="/head-office/orders/all" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.1)', color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px',
            padding: '0.6rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
          }}>
            <ShoppingCart size={15} /> All Orders
          </Link>
          <Link href="/head-office/billing/monthly" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#F73582', color: '#ffffff',
            border: '1px solid transparent', borderRadius: '10px',
            padding: '0.6rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(247,53,130,0.4)',
          }}>
            <FileSpreadsheet size={15} /> Monthly Billing
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}
      >
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton h="0.7rem" w="60%" />
              <Skeleton h="2rem" w="80%" />
              <Skeleton h="0.7rem" w="50%" />
            </div>
          ))
        ) : (
          <>
            <KPICard index={0} label="Total Spend This Month"
              value={`$${(kpis?.totalSpendThisMonth ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
              delta={`${Math.abs(kpis?.spendDeltaPct ?? 0).toFixed(1)}%`}
              deltaPositive={(kpis?.spendDeltaPct ?? 0) >= 0}
              icon={<DollarSign size={17} />}
              subtitle="Across all account sites"
            />
            <KPICard index={1} label="Orders This Month"
              value={String(kpis?.orderCountThisMonth ?? 0)}
              delta={`${Math.abs(kpis?.ordersDeltaPct ?? 0).toFixed(1)}%`}
              deltaPositive={(kpis?.ordersDeltaPct ?? 0) >= 0}
              icon={<ShoppingCart size={17} />}
              subtitle={`vs ${kpis?.orderCountLastMonth ?? 0} last month`}
            />
            <KPICard index={2} label="Active Sites"
              value={String(kpis?.activeSitesCount ?? 0)}
              icon={<Building2 size={17} />}
              subtitle="Sites under this account"
            />
            <KPICard index={3} label="Top Ordering Site"
              value={kpis?.topSite?.siteCode ?? '—'}
              icon={<TrendingUp size={17} />}
              subtitle={`$${(kpis?.topSite?.spend ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })} this month`}
            />
          </>
        )}
      </motion.div>

      {/* Spend Trend + Site Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2b253e', marginBottom: '0.2rem' }}>
                Monthly Spend Trend
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#8b8599' }}>6-month rolling — {kpis?.accountName ?? 'account'}</p>
            </div>
            <Link href="/head-office/reports/spend-by-site" style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.75rem', fontWeight: 700, color: '#F73582', textDecoration: 'none',
            }}>
              Full Report <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ height: '130px', position: 'relative' }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%' }}>
                {[60, 80, 50, 90, 70, 100].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '6px 6px 0 0', background: '#e8eaf0' }} />
                ))}
              </div>
            ) : (
              <SpendTrendChart data={kpis?.spendTrend ?? []} />
            )}
          </div>
        </motion.div>

        {/* Site Spend Breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2b253e' }}>Spend by Site</h2>
            <BarChart3 size={16} color="#8b8599" />
          </div>
          {isLoading ? (
            [0, 1, 2].map((i) => (
              <div key={i} style={{ marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Skeleton h="0.75rem" w="70%" />
                <Skeleton h="8px" />
              </div>
            ))
          ) : (
            kpis?.spendBySite?.map((s, i) => (
              <SiteSpendBar key={s.siteId} siteName={s.siteName} spend={s.totalSpend} pct={s.percentageOfTotal} index={i} />
            ))
          )}
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2b253e', marginBottom: '0.2rem' }}>Recent Orders</h2>
            <p style={{ fontSize: '0.75rem', color: '#8b8599' }}>Latest across all sites — read only</p>
          </div>
          <Link href="/head-office/orders/all" style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.75rem', fontWeight: 700, color: '#F73582', textDecoration: 'none',
          }}>
            View All <ChevronRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} style={{ padding: '0.9rem 0', borderBottom: '1px solid rgba(43,37,62,0.07)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Skeleton h="2.5rem" w="2.5rem" br="50%" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Skeleton h="0.8rem" w="40%" />
                <Skeleton h="0.7rem" w="60%" />
              </div>
              <Skeleton h="1.5rem" w="80px" br="999px" />
            </div>
          ))
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(43,37,62,0.08)' }}>
                  {['Order #', 'Site', 'Ordered By', 'PO Reference', 'Date', 'Value', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '0.6rem 0.85rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis?.recentOrders?.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < (kpis.recentOrders.length - 1) ? '1px solid rgba(43,37,62,0.06)' : 'none' }}>
                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#F73582' }}>{o.orderNumber}</td>
                    <td style={{ padding: '0.85rem', fontWeight: 600, color: '#2b253e' }}>{o.siteName}</td>
                    <td style={{ padding: '0.85rem', color: '#5c566e' }}>{o.userName}</td>
                    <td style={{ padding: '0.85rem', color: '#8b8599' }}>{o.poReference ?? '—'}</td>
                    <td style={{ padding: '0.85rem', color: '#8b8599' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#2b253e' }}>
                      ${o.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <StatusPill status={o.status as OrderStatus} />
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <Link href={`/head-office/orders/${o.id}`} style={{
                        fontSize: '0.75rem', fontWeight: 700, color: '#F73582', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '0.2rem',
                      }}>
                        View <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
