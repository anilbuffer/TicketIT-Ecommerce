// src/app/shop/checkout/review/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/services/orders.service';
import {
  ClipboardCheck,
  Building2,
  Truck,
  FileText,
  User,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Package,
  Receipt,
  AlertCircle,
} from 'lucide-react';

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, totalCount, checkoutState, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultBillTo = {
    street: '550 Lexington Avenue',
    suite: '14th Floor (Corporate Accounts)',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'USA',
  };

  const defaultShipTo = checkoutState.customShipToAddress || {
    street: '550 Lexington Avenue',
    suite: 'Ground Floor Dispensary Receiving',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'USA',
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderPayload = {
        accountId: user?.accountId || 'acc-001',
        accountName: user?.accountName || 'Apex Healthcare Group',
        siteId: user?.siteId || 'site-101',
        siteCode: user?.siteCode || 'APX-MID-101',
        siteName: user?.siteName || 'Apex Midtown Central Pharmacy',
        userId: user?.id || 'usr_site_101',
        userName: user?.name || 'Marcus Vance',
        userEmail: user?.email || 'marcus.vance@apexhealth.org',
        poReference: checkoutState.poReference || `PO-APX-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'RECEIVED' as const,
        totalAmount: subtotal,
        deliveryNotes: `${checkoutState.deliveryInstructions || 'Standard site delivery'} | Contact: ${checkoutState.deliveryContactName} (${checkoutState.deliveryContactPhone})`,
        lineItems: items.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          orderId: '',
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          thumbnailUrl: item.product.thumbnailUrl,
          qty: item.qty,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          packSize: item.product.packSize,
          uom: item.product.uom,
        })),
      };

      const created = await createOrder(orderPayload);
      clearCart();
      router.push(`/shop/order-confirmation/${created.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setSubmitError(err?.message || 'Failed to submit on-account order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#F73582] uppercase tracking-wider">Step 3 of 3</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Review & Submit On-Account Order
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your order details before final submission. Billed directly on-account with zero card payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Review Section (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Items Breakdown Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Package size={15} className="text-[#F73582]" />
                <span>Collateral Items ({totalCount} items)</span>
              </h3>
              <Link
                href="/shop/cart"
                className="text-xs font-bold text-[#F73582] hover:underline"
              >
                Edit Cart
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image
                        src={item.product.thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {item.product.sku} • {item.qty} {item.product.uom} @ ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-slate-900 shrink-0">
                    ${item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Subtotal</span>
              <span className="text-base font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* 2. Customer & Address Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account & PO Info */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#2B253E]" />
                  <span>Account & PO Reference</span>
                </span>
                <Link href="/shop/checkout/details" className="text-[#F73582] font-bold hover:underline">
                  Edit
                </Link>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <p>
                  <strong className="text-slate-900 font-semibold block">Customer Account:</strong>
                  {user?.accountName || 'Apex Healthcare Group'}
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold block">Site Branch:</strong>
                  {user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold block">PO Number:</strong>
                  <span className="font-mono font-bold text-[#F73582]">{checkoutState.poReference}</span>
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck size={14} className="text-[#F73582]" />
                  <span>Delivery Destination</span>
                </span>
                <Link href="/shop/checkout/delivery" className="text-[#F73582] font-bold hover:underline">
                  Edit
                </Link>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <p>
                  <strong className="text-slate-900 font-semibold block">Recipient Contact:</strong>
                  {checkoutState.deliveryContactName} {checkoutState.deliveryContactPhone && `(${checkoutState.deliveryContactPhone})`}
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold block">Ship-To Address:</strong>
                  {defaultShipTo.street} {defaultShipTo.suite && `, ${defaultShipTo.suite}`}, {defaultShipTo.city}, {defaultShipTo.state} {defaultShipTo.postalCode}
                </p>
                {checkoutState.deliveryInstructions && (
                  <p className="text-[11px] italic text-slate-500 pt-1">
                    "{checkoutState.deliveryInstructions}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action / Submit Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5 sticky top-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Receipt size={17} className="text-[#F73582]" />
            <span>Authorization Summary</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total Order Value:</span>
              <span className="text-xl font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Freight & Handling:</span>
              <span className="font-semibold text-emerald-600">Included (Contract Fleet)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Settlement:</span>
              <span className="font-bold text-emerald-700">Net 30 Monthly Invoice</span>
            </div>
          </div>

          {/* On-Account confirmation banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-emerald-50/60 border border-pink-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Charge-to-Account Order</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              No online card payment required. This order will be routed to Central Fulfilment and consolidated on your Head Office statement.
            </p>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full py-4 px-4 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Submit Order On-Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <Link
            href="/shop/checkout/delivery"
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center block transition-colors"
          >
            Back to Delivery Details
          </Link>
        </div>
      </div>
    </div>
  );
}
