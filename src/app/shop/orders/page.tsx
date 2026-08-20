// src/app/shop/orders/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Search,
  Eye,
  Building2,
  Calendar,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  QrCode,
  Layers,
  ArrowRight,
  Filter,
  FileText,
  DollarSign,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/lib/services/orders.service';
import type { Order, OrderStatus } from '@/lib/services/types';

const STATUS_PIPELINE: { key: OrderStatus; label: string; bg: string; color: string; desc: string }[] = [
  { key: 'PENDING_APPROVAL', label: 'Pending HO Approval', bg: '#fef3c7', color: '#92400e', desc: 'Submitted to Head Office' },
  { key: 'CHANGES_REQUESTED', label: 'Changes Requested', bg: '#fff7ed', color: '#c2410c', desc: 'Head Office requested edits' },
  { key: 'APPROVED', label: 'Approved (Payment Pending)', bg: '#eff6ff', color: '#1d4ed8', desc: 'Approved by Head Office' },
  { key: 'PAID', label: 'Paid by Head Office', bg: '#f0fdf4', color: '#166534', desc: 'Corporate payment settled' },
  { key: 'IN_PRODUCTION', label: 'In Production', bg: '#faf5ff', color: '#7e22ce', desc: 'Direct UV printing active' },
  { key: 'DISPATCHED', label: 'Shipped', bg: '#ecfeff', color: '#0e7490', desc: 'In transit to branch' },
  { key: 'DELIVERED', label: 'Delivered', bg: '#f0fdf4', color: '#15803d', desc: 'Delivered to branch desk' },
  { key: 'REJECTED', label: 'Rejected', bg: '#fef2f2', color: '#b91c1c', desc: 'Declined by Head Office' },
];

export default function SiteUserOrdersPage() {
  const { user } = useAuth();
  const siteId = user?.siteId || 'site-101';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProofOrder, setActiveProofOrder] = useState<Order | null>(null);

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
        console.error('Failed to load site orders', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSiteOrders();
  }, [siteId]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.poReference && order.poReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.lineItems.some((li) => li.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const pendingApprovalsCount = orders.filter((o) => o.status === 'PENDING_APPROVAL').length;
  const inProductionCount = orders.filter((o) => o.status === 'IN_PRODUCTION' || o.status === 'APPROVED' || o.status === 'PAID').length;
  const shippedCount = orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'DELIVERED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '64px' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '28px 32px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: '#fdf2f8',
              color: '#f73582',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            <Building2 size={13} />
            <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Branch Purchase Orders & Artwork Pipeline
          </h1>

          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            Track customized print proofs, Head Office approval status, and commercial fulfillment with zero site payment liability.
          </p>
        </div>

        <Link
          href="/shop/templates"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '12px',
            backgroundColor: '#f73582',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(247, 53, 130, 0.3)',
          }}
        >
          <Sparkles size={16} />
          Create New Print PO
        </Link>
      </div>

      {/* 2. Pipeline Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontSize: '12px', fontWeight: 700 }}>
            <Clock size={16} />
            <span>Pending Head Office Approval</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {pendingApprovalsCount}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Awaiting controller approval</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7e22ce', fontSize: '12px', fontWeight: 700 }}>
            <Layers size={16} />
            <span>Approved / In Production</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {inProductionCount}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Paid & printing in progress</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0e7490', fontSize: '12px', fontWeight: 700 }}>
            <Truck size={16} />
            <span>Dispatched & Delivered</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {shippedCount}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Shipped via direct carrier</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '12px', fontWeight: 700 }}>
            <ShieldCheck size={16} />
            <span>Site Payment Liability</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#166534', marginTop: '6px' }}>
            $0.00 (HO Billed)
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Billed to corporate account</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '440px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by PO reference, order #, or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '38px',
              paddingRight: '14px',
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '10px',
              border: '1.5px solid #e2e8f0',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0f172a',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="ALL">All PO Statuses</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_PRODUCTION">In Production</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* 4. Orders & PO Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading Purchase Orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <ClipboardList size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>No Purchase Orders Found</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              You have not created any purchase orders matching the current filter.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 20px' }}>PO Reference / Order #</th>
                <th style={{ padding: '14px 16px' }}>Print Product & Customized Artwork</th>
                <th style={{ padding: '14px 16px' }}>Qty & Price</th>
                <th style={{ padding: '14px 16px' }}>Pipeline Status</th>
                <th style={{ padding: '14px 16px' }}>Delivery Destination</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const firstItem = order.lineItems[0];
                const meta = STATUS_PIPELINE.find((p) => p.key === order.status) || {
                  label: order.status,
                  bg: '#f1f5f9',
                  color: '#475569',
                  desc: 'In system',
                };

                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <strong style={{ color: '#0f172a', display: 'block', fontSize: '13px' }}>
                        {order.poReference || 'N/A'}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{order.orderNumber}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            position: 'relative',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={firstItem?.thumbnailUrl || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&auto=format&fit=crop&q=80'}
                            alt="Proof thumbnail"
                            fill
                            unoptimized
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{firstItem?.productName}</div>
                          {firstItem?.customizations && (
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                              ✓ Personalized for {firstItem.customizations.businessName || user?.siteName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '14px' }}>${order.totalAmount.toFixed(2)}</strong>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                        {order.itemCount} units
                      </span>
                      <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                        HO Corporate Billed
                      </span>
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: meta.bg,
                          color: meta.color,
                        }}
                      >
                        {meta.label}
                      </span>
                      {order.changesRequestedNotes && (
                        <div style={{ fontSize: '11px', color: '#c2410c', marginTop: '4px', maxWidth: '200px' }}>
                          ⚠️ HO Feedback: &quot;{order.changesRequestedNotes}&quot;
                        </div>
                      )}
                      {order.trackingNumber && (
                        <div style={{ fontSize: '11px', color: '#0891b2', marginTop: '4px' }}>
                          📦 {order.carrier}: {order.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '16px 16px', color: '#475569', fontSize: '12px' }}>
                      <div>{order.siteName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {order.recipientContact?.name || user?.name}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setActiveProofOrder(order)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#0f172a',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        View Artwork Proof
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Artwork Proof Inspection Modal */}
      <AnimatePresence>
        {activeProofOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '28px',
                maxWidth: '650px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Artwork Proof: PO #{activeProofOrder.poReference || activeProofOrder.orderNumber}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Status: <strong>{activeProofOrder.status}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setActiveProofOrder(null)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Close
                </button>
              </div>

              {/* Artwork Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  borderRadius: '12px',
                  backgroundColor: '#0f172a',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={activeProofOrder.customizedArtwork?.previewUrl || activeProofOrder.lineItems[0]?.thumbnailUrl || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&auto=format&fit=crop&q=80'}
                  alt="Customized Artwork Proof"
                  fill
                  unoptimized
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Status Audit Log */}
              {activeProofOrder.statusHistory && activeProofOrder.statusHistory.length > 0 && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Audit & Approval History
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {activeProofOrder.statusHistory.map((h, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#334155' }}>
                        <span style={{ fontWeight: 700 }}>{h.actorName}</span> ({h.actorRole}) •{' '}
                        <span style={{ color: '#64748b' }}>{new Date(h.timestamp).toLocaleTimeString()}</span>:{' '}
                        <em>{h.comment || h.status}</em>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
