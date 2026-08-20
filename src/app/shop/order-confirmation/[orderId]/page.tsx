// src/app/shop/order-confirmation/[orderId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getOrderById } from '@/lib/services/orders.service';
import type { Order } from '@/lib/services/types';
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowRight,
  ShoppingBag,
  Building2,
  Truck,
  FileText,
  Clock,
  CheckCircle,
  Receipt,
  Mail,
  ShieldCheck,
  Download,
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-[#F73582] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Order Placed</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Your order has been recorded in the central platform.
        </p>
        <Link
          href="/shop/orders/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F73582] text-white text-xs font-bold shadow-sm"
        >
          View My Orders <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Celebratory Success Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center shadow-sm relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 size={40} />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
          Order Successfully Recorded • On-Account
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Thank you! Order #{order.orderNumber} is Confirmed
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Your marketing collateral requisition has been routed to Central Fulfilment operations and scheduled for dispatch.
        </p>

        {/* Reference tags row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono">
            <span className="text-slate-400 block text-[10px] font-sans">Order Reference</span>
            <strong className="text-slate-900 font-bold">{order.orderNumber}</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono">
            <span className="text-slate-400 block text-[10px] font-sans">PO Number</span>
            <strong className="text-[#F73582] font-bold">{order.poReference || 'N/A'}</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Settlement Method</span>
            <strong className="text-emerald-700 font-bold">Consolidated Account</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Order Status</span>
            <div className="pt-0.5">
              <OrderStatusBadge status={order.status} size="sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. "What Happens Next" Roadmap Card */}
      <div className="bg-gradient-to-br from-[#2B253E] to-[#1e1b38] rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock size={18} className="text-[#F73582]" />
          <span>What Happens Next with Your Order</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#F73582] text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs font-bold text-white pt-1">Central Warehouse Processing</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Platform ops review specifications, pull print collateral from inventory, and stage for courier packing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#F73582] text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs font-bold text-white pt-1">Site Dispatch & Tracking</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Consolidated logistics fleet delivers directly to your site loading bay with tracking and signed receipt.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#F73582] text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-bold text-white pt-1">Monthly Billing Roll-Up</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              This order (${order.totalAmount.toFixed(2)}) is reconciled into your Head Office consolidated monthly billing report.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Structured Confirmation & Receipt Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Order Requisition Details</h3>
            <p className="text-xs text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <Printer size={14} /> Print Receipt
            </button>

            <Link
              href={`/shop/orders/${order.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <FileText size={14} /> View Order Record
            </Link>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-2.5">Asset / Item</th>
                <th className="py-2.5">SKU</th>
                <th className="py-2.5 text-center">Pack / UOM</th>
                <th className="py-2.5 text-center">Quantity</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.lineItems.map((line) => (
                <tr key={line.id} className="text-slate-800">
                  <td className="py-3 font-bold text-slate-900">{line.productName}</td>
                  <td className="py-3 font-mono text-slate-500">{line.sku}</td>
                  <td className="py-3 text-center text-slate-600">{line.packSize || line.uom || 'Unit'}</td>
                  <td className="py-3 text-center font-bold">{line.qty}</td>
                  <td className="py-3 text-right">${line.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-right font-extrabold">${line.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Routing Details Row */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong className="text-slate-900 font-semibold block">Site Branch:</strong>
              {order.siteName} ({order.siteCode})
            </p>
            <p>
              <strong className="text-slate-900 font-semibold block">Ordered By:</strong>
              {order.userName} ({order.userEmail})
            </p>
            {order.deliveryNotes && (
              <p>
                <strong className="text-slate-900 font-semibold block">Dispatch Instructions:</strong>
                {order.deliveryNotes}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery & Transport:</span>
              <span className="font-semibold text-emerald-600">Consolidated Logistics Fleet</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Total Billed to Account:</span>
              <span className="text-xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Navigation CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href="/shop/catalogue"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all"
        >
          <ShoppingBag size={15} /> Continue Shopping Catalogue
        </Link>

        <Link
          href="/shop/orders/history"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <span>Go to My Site Order History</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
