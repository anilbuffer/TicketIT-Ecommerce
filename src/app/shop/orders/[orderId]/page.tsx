// src/app/shop/orders/[orderId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getOrderById } from '@/lib/services/orders.service';
import type { Order } from '@/lib/services/types';
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge';
import {
  ArrowLeft,
  Building2,
  Truck,
  FileText,
  Clock,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Package,
  Receipt,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function SiteOrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-[#F73582] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Order Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          This order does not exist or does not belong to your site account.
        </p>
        <Link
          href="/shop/orders/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F73582] text-white text-xs font-bold shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Order History
        </Link>
      </div>
    );
  }

  // Steps for timeline
  const statusSteps = [
    { key: 'RECEIVED', label: 'Order Received', desc: 'Logged on-account' },
    { key: 'PROCESSING', label: 'In Fulfilment', desc: 'Central warehouse staging' },
    { key: 'DISPATCHED', label: 'Dispatched', desc: order.carrier ? `${order.carrier}` : 'In transit to site' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Signed at site dock' },
  ];

  const statusOrder: Record<string, number> = {
    RECEIVED: 0,
    PROCESSING: 1,
    DISPATCHED: 2,
    DELIVERED: 3,
  };

  const currentStepIdx = statusOrder[order.status] ?? 0;

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* 1. Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/shop/orders/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F73582] hover:underline mb-1"
          >
            <ArrowLeft size={13} /> Back to My Site Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} size="md" />
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              <Lock size={11} /> Read-Only Status
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors self-start sm:self-auto shadow-sm"
        >
          <Printer size={14} /> Print Summary
        </button>
      </div>

      {/* 2. Status Progression Stepper (Read-Only) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock size={15} className="text-[#F73582]" />
            <span>Fulfilment Tracking Progression</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Managed by Platform Operations
          </span>
        </div>

        <div className="relative flex items-center justify-between max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>

          {statusSteps.map((step, idx) => {
            const isPassed = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isPassed
                      ? 'bg-emerald-600 border-2 border-emerald-600 text-white shadow-sm'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isPassed ? <CheckCircle2 size={16} /> : idx + 1}
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`text-xs font-bold block ${
                      isCurrent
                        ? 'text-emerald-700 font-extrabold'
                        : isPassed
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:block max-w-[110px] leading-tight">
                    {step.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tracking info pill if dispatched */}
        {order.trackingNumber && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Truck size={16} />
              </div>
              <div>
                <span className="font-bold text-purple-950 block">Courier Tracking: {order.trackingNumber}</span>
                <span className="text-[11px] text-purple-700">Carrier: {order.carrier || 'Rahhawan Direct Logistics'}</span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-purple-800 bg-white px-3 py-1.5 rounded-lg border border-purple-200 self-start sm:self-auto">
              In Transit to Loading Dock
            </span>
          </div>
        )}
      </div>

      {/* 3. Order Details & Line Items */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Site & Branch:</span>
            <strong className="text-slate-900 font-bold text-sm block mt-0.5">{order.siteName}</strong>
            <span className="text-slate-500 font-mono">Code: {order.siteCode}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">PO / Reference:</span>
            <strong className="text-[#F73582] font-mono font-bold text-sm block mt-0.5">
              {order.poReference || '—'}
            </strong>
            <span className="text-slate-500">Ordered by {order.userName}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Billing & Settlement:</span>
            <strong className="text-emerald-700 font-bold text-sm block mt-0.5">
              Monthly Consolidated
            </strong>
            <span className="text-slate-500">Account: {order.accountName}</span>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Itemized Collateral Assets ({order.itemCount} units)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-center">Pack Size</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.lineItems.map((line) => (
                  <tr key={line.id}>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{line.productName}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{line.sku}</td>
                    <td className="py-3.5 px-3 text-center text-slate-600">{line.packSize || line.uom || 'Unit'}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">{line.qty}</td>
                    <td className="py-3.5 px-3 text-right">${line.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                      ${line.lineTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals and Notes */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="text-xs space-y-2 text-slate-600">
            {order.deliveryNotes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Delivery Instructions:</span>
                <p className="italic text-slate-600">{order.deliveryNotes}</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Consolidated Shipping:</span>
              <span className="font-semibold text-emerald-600">Included</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Billed to Account:</span>
              <span className="text-xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
