// src/components/shop/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Eye, AlertCircle, Sparkles, Tag, ShieldAlert } from 'lucide-react';
import type { EffectiveProduct } from '@/lib/services/types';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from './QuantitySelector';

interface ProductCardProps {
  product: EffectiveProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, setIsCartDrawerOpen } = useCart();
  const [qty, setQty] = useState<number>(product.moq || 1);
  const [isValidQty, setIsValidQty] = useState<boolean>(true);
  const [isAdded, setIsAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAvailable = product.status === 'ACTIVE';
  const unitPrice = product.effectivePrice ?? product.basePrice;
  const lineTotal = Number((qty * unitPrice).toFixed(2));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;

    const res = addItem(product, qty, unitPrice);
    if (!res.success) {
      setErrorMsg(res.error || 'Cannot add item');
      return;
    }

    setErrorMsg(null);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4), ease: 'easeOut' }}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        isAvailable
          ? 'border-slate-200/90 hover:border-pink-200'
          : 'border-slate-200 bg-slate-50/70 opacity-80'
      }`}
    >
      {/* 1. Thumbnail & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-100">
        <Link href={`/shop/catalogue/${product.id}`} className="block w-full h-full">
          <Image
            src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${
              isAvailable ? 'group-hover:scale-105' : 'grayscale contrast-75'
            }`}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          {/* Category Chip */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm border border-slate-100">
            {product.categoryName || 'Marketing Asset'}
          </span>

          {/* Status Badge (if not active or discounted) */}
          <div className="flex flex-col items-end gap-1">
            {!isAvailable && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                  product.status === 'SUPERSEDED'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                <ShieldAlert size={12} />
                {product.status === 'SUPERSEDED' ? 'Superseded' : 'Unavailable'}
              </span>
            )}

            {isAvailable && product.isCustomPriced && product.discountPct > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#F73582] text-white shadow-sm">
                <Tag size={10} />
                {product.discountPct}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Hover Quick View overlay button */}
        {isAvailable && (
          <Link
            href={`/shop/catalogue/${product.id}`}
            className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 shadow-lg hover:bg-slate-50 transition-all scale-95 group-hover:scale-100">
              <Eye size={14} className="text-[#F73582]" />
              View Specifications
            </span>
          </Link>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* SKU and MOQ/Multiple Tags */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1">
            <span>SKU: {product.sku}</span>
            <span className="font-sans font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {product.packSize || `1 ${product.uom}`}
            </span>
          </div>

          {/* Product Name */}
          <Link
            href={`/shop/catalogue/${product.id}`}
            className="font-bold text-slate-900 hover:text-[#F73582] transition-colors line-clamp-1 text-base leading-snug"
          >
            {product.name}
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Ordering Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
          {/* Price Block */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Price per {product.uom || 'unit'}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-slate-900">
                  ${unitPrice.toFixed(2)}
                </span>
                {product.isCustomPriced && product.discountPct > 0 && (
                  <span className="text-xs font-medium text-slate-400 line-through">
                    ${product.basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Extended Line Preview if qty > 1 */}
            {isAvailable && qty > 1 && (
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Extended ({qty} {product.uom})</span>
                <span className="text-sm font-bold text-[#F73582]">
                  ${lineTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Ordering Action or Disabled Notice */}
          {isAvailable ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <QuantitySelector
                  product={product}
                  value={qty}
                  onChange={(newQty, valid) => {
                    setQty(newQty);
                    setIsValidQty(valid);
                  }}
                  size="sm"
                  showInlineHelp={false}
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={!isValidQty}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : isValidQty
                      ? 'bg-[#F73582] hover:bg-[#de206d] text-white hover:shadow'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.span
                        key="added"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-1"
                      >
                        <Check size={14} /> Added!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1"
                      >
                        <ShoppingCart size={13} /> Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Order rules mini pill */}
              {(product.moq > 1 || product.orderMultiple > 1) && (
                <div className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center justify-between">
                  <span>MOQ: {product.moq}</span>
                  {product.orderMultiple > 1 && <span>Multiple: {product.orderMultiple}</span>}
                </div>
              )}
            </div>
          ) : (
            <div className="py-2 px-3 bg-slate-100 rounded-lg text-center">
              <span className="text-xs font-medium text-slate-500">
                {product.status === 'SUPERSEDED' ? 'Item superseded by newer version' : 'Item currently unavailable'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
