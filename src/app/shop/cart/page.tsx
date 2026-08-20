// src/app/shop/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from '@/components/shop/QuantitySelector';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  Building2,
  AlertCircle,
  Package,
  Receipt,
} from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const { items, subtotal, totalCount, updateItemQty, removeItem, clearCart } = useCart();

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
            <Building2 size={13} className="text-[#F73582]" />
            <span>{user?.siteName || 'Apex Midtown Central Pharmacy'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Collateral Order Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review your items and amend quantities before proceeding to checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 size={14} />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {/* 2. Main Cart Layout */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
          <div className="w-20 h-20 rounded-full bg-pink-50 text-[#F73582] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
            You have not added any marketing collateral or packaging assets to your session cart yet.
          </p>
          <Link
            href="/shop/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={14} /> Return to Asset Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Item & Specification</span>
              <span>Quantity & Total</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    {/* Thumbnail & Meta */}
                    <div className="flex gap-3.5 items-center min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                        <Image
                          src={item.product.thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/shop/catalogue/${item.id}`}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#F73582] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span>SKU: {item.product.sku}</span>
                          <span>•</span>
                          <span className="font-sans text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded text-[10px]">
                            {item.product.packSize || item.product.uom}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          ${item.unitPrice.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ {item.product.uom}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                      <QuantitySelector
                        product={item.product}
                        value={item.qty}
                        onChange={(newQty) => updateItemQty(item.id, newQty)}
                        size="md"
                      />

                      <div className="text-right min-w-[90px]">
                        <span className="text-base font-extrabold text-slate-900 block">
                          ${item.lineTotal.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1 transition-colors mt-0.5"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link
                href="/shop/catalogue"
                className="inline-flex items-center gap-1 font-bold text-[#F73582] hover:underline"
              >
                <ArrowLeft size={13} /> Add more collateral from catalogue
              </Link>
              <span>{totalCount} total items in cart</span>
            </div>
          </div>

          {/* Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5 sticky top-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Receipt size={17} className="text-[#F73582]" />
              <span>Order Summary</span>
            </h3>

            {/* Account & Billing context */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Customer Account:</span>
                <span className="font-bold text-slate-800">{user?.accountName || 'Apex Healthcare Group'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Ordering Site:</span>
                <span className="font-bold text-slate-800">{user?.siteCode || 'APX-MID-101'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Terms:</span>
                <span className="font-bold text-emerald-700">Monthly On-Account</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping:</span>
                <span className="font-semibold text-emerald-600">Free (Consolidated Fleet)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable Taxes:</span>
                <span className="text-slate-500 font-medium">Billed to Head Office</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Total Order Value</span>
                  <span className="text-[11px] text-slate-400">On-Account Billing</span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Reassurance Notice */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">
                No credit card or online payment required. Your order will be placed on-account.
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/shop/checkout/details"
              className="w-full py-3.5 px-4 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
