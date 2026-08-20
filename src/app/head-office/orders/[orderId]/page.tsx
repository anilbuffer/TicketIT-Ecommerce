// src/app/head-office/orders/[orderId]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Package, MapPin, FileText, Truck, Calendar, User } from 'lucide-react';
import { useOrder } from '@/lib/hooks/useOrders';
import { StatusPill } from '@/components/admin/StatusPill';
import type { OrderStatus } from '@/lib/services/types';

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

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: value ? '#2b253e' : '#c4c1cc' }}>{value || '—'}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(43,37,62,0.09)', boxShadow: '0 2px 8px rgba(43,37,62,0.04)', overflow: 'hidden' }}
    >
      <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(43,37,62,0.07)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ color: '#F73582' }}>{icon}</span>
        <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2b253e' }}>{title}</h2>
      </div>
      <div style={{ padding: '1.4rem 1.5rem' }}>{children}</div>
    </motion.div>
  );
}

export default function HOOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { order, isLoading } = useOrder(orderId);

  // Guard: if order doesn't belong to this account, show access denied
  const accessDenied = !isLoading && order && order.accountId !== HO_ACCOUNT_ID;

  if (isLoading) {
    return (
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
        <Skeleton h="1.4rem" w="200px" />
        <Skeleton h="2.4rem" w="340px" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(43,37,62,0.09)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton h="0.7rem" w="50%" />
              {[0, 1, 2].map((j) => <Skeleton key={j} h="0.85rem" w={j % 2 === 0 ? '80%' : '60%'} />)}
            </div>
          ))}
        </div>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0}}`}</style>
      </div>
    );
  }

  if (accessDenied || !order) {
    return (
      <div style={{ padding: '28px', textAlign: 'center', color: '#8b8599', maxWidth: '600px', margin: '4rem auto' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ color: '#2b253e', marginBottom: '0.5rem' }}>Order Not Found</h2>
        <p>This order doesn't exist or doesn't belong to your account.</p>
        <Link href="/head-office/orders/all" style={{ marginTop: '1.5rem', display: 'inline-block', color: '#F73582', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1040px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#8b8599' }}>
        <Link href="/head-office/dashboard" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
        <ChevronRight size={13} />
        <Link href="/head-office/orders/all" style={{ color: '#8b8599', textDecoration: 'none', fontWeight: 600 }}>Orders</Link>
        <ChevronRight size={13} />
        <span style={{ color: '#2b253e', fontWeight: 700 }}>{order.orderNumber}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#2b253e' }}>{order.orderNumber}</h1>
            <StatusPill status={order.status as OrderStatus} />
            <span style={{
              background: 'rgba(247,53,130,0.1)', color: '#F73582',
              padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800,
            }}>
              READ ONLY
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#8b8599', marginTop: '0.3rem' }}>
            {order.siteName} · {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2b253e' }}>
          ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Order & Delivery Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {/* Order Info */}
        <SectionCard title="Order Details" icon={<FileText size={16} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem' }}>
            <InfoRow label="Order Number" value={order.orderNumber} />
            <InfoRow label="Account" value={order.accountName} />
            <InfoRow label="Site" value={order.siteName} />
            <InfoRow label="Site Code" value={order.siteCode} />
            <InfoRow label="PO Reference" value={order.poReference} />
            <InfoRow label="Order Date" value={new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoRow label="Items" value={String(order.itemCount)} />
            <InfoRow label="Order Total" value={`$${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
          </div>
        </SectionCard>

        {/* Ordered By */}
        <SectionCard title="Ordered By" icon={<User size={16} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InfoRow label="Name" value={order.userName} />
            <InfoRow label="Email" value={order.userEmail} />
          </div>
        </SectionCard>

        {/* Delivery */}
        <SectionCard title="Delivery & Fulfilment" icon={<Truck size={16} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InfoRow label="Carrier" value={order.carrier} />
            <InfoRow label="Tracking Number" value={order.trackingNumber} />
            <InfoRow label="Dispatched" value={order.dispatchedAt ? new Date(order.dispatchedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined} />
            <InfoRow label="Delivered" value={order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined} />
            <InfoRow label="Delivery Instructions" value={order.deliveryNotes} />
          </div>
        </SectionCard>

        {/* Bill-To / Ship-To */}
        <SectionCard title="Address Information" icon={<MapPin size={16} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Ship To
              </span>
              <div style={{ fontSize: '0.84rem', color: '#2b253e', lineHeight: 1.6 }}>
                {order.siteName}<br />
                {order.siteCode}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Bill To
              </span>
              <div style={{ fontSize: '0.84rem', color: '#2b253e', lineHeight: 1.6 }}>
                {order.accountName}<br />
                Head Office — Centralized Billing
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Status Timeline */}
      <SectionCard title="Status History" icon={<Calendar size={16} />}>
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
          {(['RECEIVED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'] as OrderStatus[]).map((st, i, arr) => {
            const statusOrder = { RECEIVED: 0, PROCESSING: 1, DISPATCHED: 2, DELIVERED: 3 };
            const currentIdx = statusOrder[order.status];
            const thisIdx = statusOrder[st];
            const isPast = thisIdx < currentIdx;
            const isCurrent = thisIdx === currentIdx;
            const dateMap: Record<OrderStatus, string | undefined> = {
              RECEIVED: order.createdAt,
              PROCESSING: order.updatedAt,
              DISPATCHED: order.dispatchedAt,
              DELIVERED: order.deliveredAt,
            };

            return (
              <div key={st} style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '15px', left: '50%', right: '-50%', height: '3px',
                    background: isPast || isCurrent ? 'linear-gradient(90deg,#F73582,#ff7b83)' : '#e5e7eb',
                    zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', zIndex: 1,
                  background: isCurrent ? '#F73582' : isPast ? '#58b97d' : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(247,53,130,0.2)' : 'none',
                }}>
                  {isPast ? <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 900 }}>✓</span>
                    : isCurrent ? <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }} />
                    : null}
                </div>
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: isCurrent ? '#F73582' : isPast ? '#059669' : '#8b8599', textTransform: 'uppercase' }}>
                    {st}
                  </div>
                  {dateMap[st] && (isPast || isCurrent) && (
                    <div style={{ fontSize: '0.65rem', color: '#8b8599', marginTop: '0.2rem' }}>
                      {new Date(dateMap[st]!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Line Items */}
      <SectionCard title={`Line Items (${order.lineItems.length})`} icon={<Package size={16} />}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead style={{ borderBottom: '2px solid rgba(43,37,62,0.08)' }}>
              <tr>
                {['Product', 'SKU', 'Pack Size', 'UOM', 'Qty', 'Unit Price', 'Line Total'].map((h) => (
                  <th key={h} style={{ padding: '0.7rem 0.85rem', textAlign: h === 'Qty' || h === 'Unit Price' || h === 'Line Total' ? 'right' : 'left', fontSize: '0.68rem', fontWeight: 800, color: '#8b8599', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((li, i) => (
                <tr key={li.id} style={{ borderBottom: i < order.lineItems.length - 1 ? '1px solid rgba(43,37,62,0.06)' : 'none' }}>
                  <td style={{ padding: '0.9rem 0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {li.thumbnailUrl && (
                        <img src={li.thumbnailUrl} alt={li.productName} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px' }} />
                      )}
                      <span style={{ fontWeight: 700, color: '#2b253e' }}>{li.productName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 0.85rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#8b8599' }}>{li.sku}</td>
                  <td style={{ padding: '0.9rem 0.85rem', color: '#5c566e' }}>{li.packSize ?? '—'}</td>
                  <td style={{ padding: '0.9rem 0.85rem', color: '#5c566e' }}>{li.uom ?? '—'}</td>
                  <td style={{ padding: '0.9rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#2b253e' }}>{li.qty}</td>
                  <td style={{ padding: '0.9rem 0.85rem', textAlign: 'right', color: '#5c566e' }}>
                    ${li.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '0.9rem 0.85rem', textAlign: 'right', fontWeight: 800, color: '#2b253e' }}>
                    ${li.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(247,53,130,0.04)', borderTop: '2px solid rgba(43,37,62,0.08)' }}>
                <td colSpan={6} style={{ padding: '0.9rem 0.85rem', textAlign: 'right', fontWeight: 800, fontSize: '0.85rem', color: '#2b253e' }}>
                  Order Total
                </td>
                <td style={{ padding: '0.9rem 0.85rem', textAlign: 'right', fontWeight: 900, fontSize: '1rem', color: '#F73582' }}>
                  ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Read-only notice */}
      <div style={{
        background: 'rgba(247,53,130,0.06)', border: '1px solid rgba(247,53,130,0.2)',
        borderRadius: '12px', padding: '0.85rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        fontSize: '0.78rem', fontWeight: 700, color: '#c5245e',
      }}>
        🔒 <span>This order is read-only. Status updates and edits require Admin Portal access.</span>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0}}
      `}</style>
    </div>
  );
}
