// src/app/shop/catalogue/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  getVisibleProductsForAccount,
  getProductCategories,
} from '@/lib/services/products.service';
import type { EffectiveProduct, ProductCategory } from '@/lib/services/types';
import { ProductCard } from '@/components/shop/ProductCard';
import {
  Search,
  Filter,
  Package,
  Layers,
  ShoppingCart,
  Building2,
  Sparkles,
  RefreshCw,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShopCataloguePage() {
  const { user } = useAuth();
  const { totalCount, subtotal, setIsCartDrawerOpen } = useCart();

  const [products, setProducts] = useState<EffectiveProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const accountId = user?.accountId || 'acc-001';

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prodResult, catResult] = await Promise.all([
          getVisibleProductsForAccount(accountId, {
            pageSize: 50,
          }),
          getProductCategories(),
        ]);
        setProducts(prodResult.items);
        setCategories(catResult);
      } catch (err) {
        console.error('Failed to load catalogue', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [accountId]);

  // Client filtering on top of server result
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const activeRateCardName = products.find((p) => p.rateCardName)?.rateCardName;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Scope Info */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B253E] via-[#1e1b38] to-[#16122a] text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-pink-300 border border-white/10">
              <Building2 size={13} />
              <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Approved Marketing & Collateral Catalogue
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Order pre-approved print, point-of-sale displays, and packaging. Billed on-account directly to your Head Office monthly statement with zero online payment required.
            </p>

            {activeRateCardName && (
              <div className="inline-flex items-center gap-1.5 pt-1 text-xs text-pink-200">
                <Tag size={13} className="text-[#F73582]" />
                <span>Active Rate Card: <strong>{activeRateCardName}</strong></span>
              </div>
            )}
          </div>

          {/* Quick Cart Summary Pill */}
          <div className="flex items-center md:flex-col items-end gap-3 shrink-0">
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/15 transition-all shadow-sm hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F73582] text-white flex items-center justify-center shadow-md relative">
                <ShoppingCart size={18} />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#1e1b38] animate-bounce">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-300 block font-medium">Session Cart</span>
                <span className="text-sm font-bold text-white">
                  ${subtotal.toFixed(2)} ({totalCount} items)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#F73582]/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by product name, SKU, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F73582] focus:ring-2 focus:ring-pink-100 transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium self-center sm:self-auto">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> approved assets
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#2B253E] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#F73582] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 text-[#F73582] flex items-center justify-center mx-auto mb-4">
            <Package size={30} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Products Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            {searchQuery || selectedCategory !== 'All'
              ? 'No products match your current search and filter criteria. Try clearing filters to see all available items.'
              : 'There are currently no products configured for your account catalogue visibility. Please contact your Platform Administrator.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold transition-all shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
