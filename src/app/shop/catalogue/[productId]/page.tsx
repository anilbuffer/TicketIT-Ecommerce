// src/app/shop/catalogue/[productId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getProductWithPricing } from '@/lib/services/products.service';
import type { EffectiveProduct } from '@/lib/services/types';
import { QuantitySelector } from '@/components/shop/QuantitySelector';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Package,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Info,
  Tag,
  Truck,
  Sparkles,
  FileCheck,
  HelpCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, setIsCartDrawerOpen } = useCart();

  const productId = params?.productId as string;
  const [product, setProduct] = useState<EffectiveProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState<number>(1);
  const [isValidQty, setIsValidQty] = useState<boolean>(true);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const item = await getProductWithPricing(productId, user?.accountId || 'acc-001');
        if (item) {
          setProduct(item);
          setQty(item.moq || 1);
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId, user?.accountId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-[#F73582] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={30} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Product Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
          The requested marketing asset could not be found or is not approved for your site account.
        </p>
        <Link
          href="/shop/catalogue"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F73582] text-white text-xs font-bold shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Catalogue
        </Link>
      </div>
    );
  }

  const isAvailable = product.status === 'ACTIVE';
  const unitPrice = product.effectivePrice ?? product.basePrice;
  const lineTotal = Number((qty * unitPrice).toFixed(2));
  const moq = product.moq || 1;
  const multiple = product.orderMultiple || 1;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const res = addItem(product, qty, unitPrice);
    if (!res.success) {
      setAddError(res.error || 'Cannot add product to cart');
      return;
    }

    setAddError(null);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/shop/catalogue"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#F73582] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Asset Catalogue</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>ID: {product.id}</span>
          <span>•</span>
          <span>SKU: {product.sku}</span>
        </div>
      </div>

      {/* 2. Main Product Hero Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-slate-100 relative">
          <div className="relative aspect-square w-full max-w-md rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm">
            <Image
              src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              fill
              priority
              className={`object-cover ${!isAvailable ? 'grayscale contrast-75' : ''}`}
            />

            {/* Status Overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                <div className="bg-white/95 rounded-2xl p-4 shadow-xl border border-red-200 text-center max-w-xs">
                  <ShieldAlert size={28} className="text-red-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {product.status === 'SUPERSEDED' ? 'Item Superseded' : 'Item Unavailable'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {product.status === 'SUPERSEDED'
                      ? 'This revision has been archived and replaced with an updated specification.'
                      : 'This asset is currently not available for site dispatch.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rate Card tag badge if custom priced */}
          {product.isCustomPriced && (
            <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-[#F73582] text-xs font-bold">
              <Tag size={13} />
              <span>Contract Pricing Applied ({product.discountPct}% Discount)</span>
            </div>
          )}
        </div>

        {/* Right Column: Product Detail & Ordering Controls (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Status Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {product.categoryName || 'Marketing Collateral'}
              </span>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  product.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : product.status === 'SUPERSEDED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.status === 'ACTIVE' ? 'Approved for Site Orders' : product.status}
              </span>

              <span className="font-mono text-xs text-slate-400 ml-auto">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Logistics & Pack Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Pack Size</span>
                <span className="text-xs font-bold text-slate-800">{product.packSize || '1 Unit'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Unit of Measure</span>
                <span className="text-xs font-bold text-slate-800">{product.uom || 'EA'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Min Order Qty (MOQ)</span>
                <span className="text-xs font-bold text-slate-800">{moq} {product.uom}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Order Multiple</span>
                <span className="text-xs font-bold text-slate-800">
                  {multiple > 1 ? `Multiples of ${multiple}` : 'Any Qty ≥ MOQ'}
                </span>
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Unit Contract Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      ${unitPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ {product.uom}</span>
                    {product.isCustomPriced && product.discountPct > 0 && (
                      <span className="text-xs font-semibold text-slate-400 line-through">
                        ${product.basePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Extended Total */}
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium block">
                    Extended Total ({qty} {product.uom}):
                  </span>
                  <span className="text-2xl font-black text-[#F73582]">
                    ${lineTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {product.rateCardName && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                  <Tag size={11} className="text-[#F73582]" />
                  <span>Rate Card Tier: <strong>{product.rateCardName}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Ordering Validation & CTA Box */}
          <div className="pt-2 space-y-4">
            {isAvailable ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Select Quantity ({product.uom}):
                    </label>
                    <QuantitySelector
                      product={product}
                      value={qty}
                      onChange={(newQty, valid) => {
                        setQty(newQty);
                        setIsValidQty(valid);
                      }}
                      size="lg"
                    />
                  </div>

                  <div className="sm:self-end">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddToCart}
                      disabled={!isValidQty}
                      className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-200'
                          : isValidQty
                          ? 'bg-[#F73582] hover:bg-[#de206d] text-white shadow-pink-200 hover:shadow-lg'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isAdded ? (
                          <motion.span
                            key="added"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1.5"
                          >
                            <Check size={16} /> Added to Cart!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="add"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1.5"
                          >
                            <ShoppingCart size={16} /> Add to Collateral Order
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>

                {addError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle size={15} />
                    <span>{addError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700">
                  Ordering Disabled for this Asset
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  This product is unavailable or superseded by an updated marketing release. Please contact your Brand Administrator for latest marketing collateral assets.
                </p>
              </div>
            )}

            {/* On-Account reassurance notice */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
              <span>
                Orders are processed on-account and consolidated into your monthly billing report. Zero credit card or payment gateway step required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
