// src/app/shop/order-confirmation/[orderId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getOrderById } from '@/lib/services/orders.service';
import type { Order } from '@/lib/services/types';
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShoppingBag,
  Clock,
  FileText,
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setIsLoading(true);
      try {
        const res = await getOrderById(orderId);
        setOrder(res);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '3px solid #fbcfe8',
            borderTopColor: '#f73582',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: '440px',
          margin: '48px auto',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Order Placed</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
          Your order has been recorded in the central platform.
        </p>
        <Link
          href="/shop/orders/history"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: '#f73582',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <span>View My Orders</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '920px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '80px',
      }}
    >
      {/* 1. Celebratory Success Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '36px 24px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 0 8px #f0fdf4',
          }}
        >
          <CheckCircle2 size={42} />
        </div>

        <span
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            marginBottom: '12px',
          }}
        >
          Order Successfully Recorded • On-Account
        </span>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0',
          }}
        >
          Thank you! Order #{order.orderNumber} is Confirmed
        </h1>

        <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
          Your marketing collateral requisition has been routed to Central Fulfilment operations and scheduled for dispatch.
        </p>

        {/* Reference tags row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9',
            fontSize: '12px',
            width: '100%',
          }}
        >
          <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Order Reference</span>
            <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{order.orderNumber}</strong>
          </div>

          <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>PO Number</span>
            <strong style={{ color: '#f73582', fontFamily: 'monospace' }}>{order.poReference || 'N/A'}</strong>
          </div>

          <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Settlement Method</span>
            <strong style={{ color: '#059669' }}>Consolidated Account</strong>
          </div>

          <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Status</span>
            <OrderStatusBadge status={order.status} size="sm" />
          </div>
        </div>
      </motion.div>

      {/* 2. What Happens Next Roadmap Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2B253E 0%, #1e1b38 100%)',
          borderRadius: '24px',
          padding: '28px',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(43, 37, 62, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Clock size={18} color="#f73582" />
          <span>What Happens Next with Your Order</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f73582', color: '#ffffff', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              1
            </span>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Central Warehouse Staging</h4>
            <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Platform ops review specifications, pull print collateral from inventory, and stage for courier packing.
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f73582', color: '#ffffff', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </span>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Site Dispatch & Tracking</h4>
            <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Consolidated logistics fleet delivers directly to your site loading bay with tracking and signed receipt.
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f73582', color: '#ffffff', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              3
            </span>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Monthly Billing Roll-Up</h4>
            <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              This order (${order.totalAmount.toFixed(2)}) is reconciled into your Head Office consolidated monthly billing report.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Requisition Breakdown Table Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>Order Requisition Details</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Printer size={14} /> Print Receipt
            </button>

            <Link
              href={`/shop/orders/${order.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: '#2B253E',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <FileText size={14} /> View Order Record
            </Link>
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>
                <th style={{ padding: '8px 4px' }}>Asset / Item</th>
                <th style={{ padding: '8px 4px' }}>SKU</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>Pack / UOM</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>Quantity</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((line) => (
                <tr key={line.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 4px', fontWeight: 700, color: '#0f172a' }}>{line.productName}</td>
                  <td style={{ padding: '12px 4px', fontFamily: 'monospace', color: '#64748b' }}>{line.sku}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'center', color: '#475569' }}>{line.packSize || line.uom || 'Unit'}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'center', fontWeight: 700 }}>{line.qty}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'right' }}>${line.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>${line.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>Site Branch:</strong>
              {order.siteName} ({order.siteCode})
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>Ordered By:</strong>
              {order.userName} ({order.userEmail})
            </p>
            {order.deliveryNotes && (
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>Dispatch Instructions:</strong>
                {order.deliveryNotes}
              </p>
            )}
          </div>

          <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Items Total:</span>
              <strong style={{ color: '#0f172a' }}>${order.totalAmount.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Delivery & Transport:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>Consolidated Fleet</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Billed to Account:</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Navigation CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <Link
          href="/shop/catalogue"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ShoppingBag size={15} /> Continue Shopping Catalogue
        </Link>

        <Link
          href="/shop/orders/history"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: '#f73582',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
          }}
        >
          <span>Go to My Site Order History</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
