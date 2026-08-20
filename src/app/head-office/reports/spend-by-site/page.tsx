// src/app/head-office/reports/spend-by-site/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, BarChart3, Building2 } from 'lucide-react';
import { useHODashboardKPIs } from '@/lib/hooks/useHeadOffice';

const HO_ACCOUNT_ID = 'acc-001';

// ─── Period filter labels ────────────────────────────────────────────────────
const PERIODS = [
  { key: '2026-08', label: 'Aug 26' },
  { key: '2026-07', label: 'Jul 26' },
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

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function SiteBarChart({ data }: { data: { siteName: string; siteCode: string; totalSpend: number; ordersCount: number }[] }) {
  if (!data.length) return null;
  const maxSpend = Math.max(...data.map((d) => d.totalSpend), 1);
  const barColors = ['#F73582', '#ff7b83', '#2563eb', '#059669', '#d97706'];
  const H = 220, barWidth = 60, gap = 32, PAD_X = 40, PAD_Y = 24;
  const totalWidth = PAD_X * 2 + data.length * (barWidth + gap) - gap;

  return (
    <svg viewBox={`0 0 ${totalWidth} ${H + 56}`} style={{ width: '100%', overflow: 'visible' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD_Y + (1 - pct) * H;
        return (
          <g key={pct}>
            <line x1={PAD_X - 8} y1={y} x2={totalWidth - PAD_X + 8} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD_X - 12} y={y + 4} textAnchor="end" fontSize="9" fill="#8b8599" fontFamily="inherit">
              ${Math.round(maxSpend * pct / 1000)}k
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const x = PAD_X + i * (barWidth + gap);
        const barH = (d.totalSpend / maxSpend) * H;
        const y = PAD_Y + H - barH;
        const color = barColors[i % barColors.length];
        return (
          <g key={d.siteCode}>
            {/* Bar shadow */}
            <rect x={x + 3} y={y + 3} width={barWidth} height={barH} rx="8" fill={color} opacity="0.12" />
            {/* Bar fill */}
            <motion.rect x={x} y={PAD_Y + H} width={barWidth} height={0} rx="8" fill={color}
              animate={{ y, height: barH }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: 'easeOut' }}
            />
            {/* Value label */}
            <motion.text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="10" fill={color} fontWeight="800" fontFamily="inherit"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.09 + 0.4 }}
            >
              ${(d.totalSpend / 1000).toFixed(1)}k
            </motion.text>
            {/* Site code label */}
            <text x={x + barWidth / 2} y={PAD_Y + H + 20} textAnchor="middle" fontSize="8" fill="#2b253e" fontWeight="700" fontFamily="inherit">
              {d.siteCode.split('-').slice(0, 2).join('-')}
            </text>
            <text x={x + barWidth / 2} y={PAD_Y + H + 33} textAnchor="middle" fontSize="7.5" fill="#8b8599" fontFamily="inherit">
              {d.ordersCount} orders
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Trend Line ───────────────────────────────────────────────────────────────
function TrendLineChart({ data }: { data: { month: string; spend: number; orders: number }[] }) {
  if (!data.length) return null;
  const maxSpend = Math.max(...data.map((d) => d.spend), 1);
  const W = 480, H = 100, PAD = 16;
  const points = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - 2 * PAD),
    y: H - PAD - (d.spend / maxSpend) * (H - 2 * PAD),
    ...d,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.5, 1].map((pct) => (
        <line key={pct}
          x1={PAD} y1={H - PAD - pct * (H - 2 * PAD)}
          x2={W - PAD} y2={H - PAD - pct * (H - 2 * PAD)}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}
      <motion.path d={areaD} fill="url(#trendArea)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
      <motion.path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={H + 2} textAnchor="middle" fontSize="9" fill="#8b8599" fontFamily="inherit" fontWeight="600">
            {p.month}
          </text>
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800" fontFamily="inherit">
            ${(p.spend / 1000).toFixed(1)}k
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HOSpendInsightsPage() {
  const { data: kpis, isLoading } = useHODashboardKPIs(HO_ACCOUNT_ID);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Breadcrumb */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.78rem', color: '#8b8599' }}>
          <Link href="/head-office/dashboard" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
          <ChevronRight size={13} />
          <span style={{ color: '#2b253e', fontWeight: 700 }}>Spend Insights</span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2b253e', marginBottom: '0.25rem' }}>
          Spend Insights & Analytics
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#8b8599' }}>
          {isLoading ? '...' : `${kpis?.accountName} — cross-site spend analytics, scoped to your account`}
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        {isLoading ? (
          [0, 1, 2].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton h="0.7rem" w="50%" /><Skeleton h="1.8rem" w="75%" />
            </div>
          ))
        ) : (
          [
            { label: 'Spend This Month', value: `$${(kpis?.totalSpendThisMonth ?? 0).toLocaleString('en-US')}`, color: '#F73582' },
            { label: 'Spend Last Month', value: `$${(kpis?.totalSpendLastMonth ?? 0).toLocaleString('en-US')}`, color: '#2563eb' },
            { label: 'Month-on-Month Change', value: `${(kpis?.spendDeltaPct ?? 0) >= 0 ? '+' : ''}${kpis?.spendDeltaPct?.toFixed(1) ?? 0}%`, color: (kpis?.spendDeltaPct ?? 0) >= 0 ? '#059669' : '#dc2626' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{c.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: c.color, lineHeight: 1 }}>{c.value}</div>
            </motion.div>
          ))
        )}
      </div>

      {/* Spend by Site Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <BarChart3 size={18} color="#F73582" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2b253e' }}>Spend by Site — This Month</h2>
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
            {[70, 50, 85, 40].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: '#e8eaf0', borderRadius: '8px 8px 0 0' }} />
            ))}
          </div>
        ) : (
          <div style={{ height: '290px', position: 'relative' }}>
            <SiteBarChart data={kpis?.spendBySite ?? []} />
          </div>
        )}
      </motion.div>

      {/* 6-Month Trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <TrendingUp size={18} color="#2563eb" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2b253e' }}>6-Month Spend Trend</h2>
        </div>
        {isLoading ? (
          <div style={{ height: '130px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton h="90px" />
            <Skeleton h="0.7rem" w="80%" />
          </div>
        ) : (
          <div style={{ height: '145px', position: 'relative' }}>
            <TrendLineChart data={kpis?.spendTrend ?? []} />
          </div>
        )}
      </motion.div>

      {/* Site detail cards */}
      <div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2b253e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={18} color="#8b8599" /> Site Performance — This Month
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
          {isLoading ? (
            [0, 1, 2].map((i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Skeleton h="0.75rem" w="70%" />
                <Skeleton h="1.5rem" w="50%" />
                <Skeleton h="0.7rem" w="60%" />
              </div>
            ))
          ) : (
            kpis?.spendBySite?.map((s, i) => (
              <motion.div key={s.siteId}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                style={{
                  background: '#fff', borderRadius: '18px', padding: '1.35rem',
                  border: `1.5px solid ${i === 0 ? 'rgba(247,53,130,0.25)' : 'rgba(43,37,62,0.09)'}`,
                  boxShadow: i === 0 ? '0 4px 16px rgba(247,53,130,0.1)' : '0 2px 8px rgba(43,37,62,0.04)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: '#F73582', color: '#fff', borderRadius: '999px',
                    padding: '0.15rem 0.55rem', fontSize: '0.62rem', fontWeight: 800,
                  }}>
                    TOP SITE
                  </div>
                )}
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s.siteCode}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2b253e', marginBottom: '0.75rem' }}>
                  {s.siteName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#8b8599', fontWeight: 700 }}>SPEND</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#F73582' }}>
                      ${s.totalSpend.toLocaleString('en-US')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#8b8599', fontWeight: 700 }}>ORDERS</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2b253e' }}>{s.ordersCount}</div>
                  </div>
                </div>
                <div style={{ height: '7px', background: '#e7eaef', borderRadius: '999px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentageOfTotal}%` }}
                    transition={{ duration: 0.55, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#F73582,#ff7b83)', borderRadius: '999px' }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8b8599', marginTop: '0.35rem', fontWeight: 600 }}>
                  {s.percentageOfTotal.toFixed(1)}% of account total
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0}}
      `}</style>
    </div>
  );
}
