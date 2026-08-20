// src/components/shop/CartDrawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from './QuantitySelector';

export function CartDrawer() {
  const {
    items,
    subtotal,
    totalCount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateItemQty,
    removeItem,
    clearCart,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-[#F73582]">
                <ShoppingCart size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Shopping Cart</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} ready for order
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="text-base font-bold text-slate-800">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6 leading-relaxed">
                  Browse your approved site marketing catalogue and add items to place a collateral order.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#F73582] text-white text-xs font-semibold hover:bg-[#de206d] transition-all shadow-sm"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                      <Image
                        src={item.product.thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">
                            {item.product.sku}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                        <QuantitySelector
                          product={item.product}
                          value={item.qty}
                          onChange={(newQty) => updateItemQty(item.id, newQty)}
                          size="sm"
                          showInlineHelp={false}
                        />

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">
                            ${item.lineTotal.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ${item.unitPrice.toFixed(2)} / {item.product.uom}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3">
              {/* Account Billing Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs">
                <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                <span>Billed on monthly consolidated account. No card payment required.</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-slate-600">Order Subtotal:</span>
                <span className="text-xl font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/shop/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-colors"
                >
                  View Full Cart
                </Link>

                <Link
                  href="/shop/checkout/details"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all"
                >
                  Checkout <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
