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
  Package,
  ShoppingCart,
  Building2,
  Tag,
  Sparkles,
} from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
      {/* 1. Header Banner & Scope Info */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #2B253E 0%, #1e1b38 50%, #16122a 100%)',
          color: '#ffffff',
          padding: '32px',
          boxShadow: '0 10px 30px rgba(43, 37, 62, 0.15)',
          border: '1px solid #332d4a',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '650px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#f472b6',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                width: 'fit-content',
              }}
            >
              <Building2 size={14} />
              <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
            </div>

            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              Approved Marketing & Collateral Catalogue
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Order pre-approved print, point-of-sale displays, and packaging. Billed on-account directly to your Head Office monthly statement with zero online payment required.
            </p>

            {activeRateCardName && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', paddingTop: '4px', fontSize: '12px', color: '#fbcfe8' }}>
                <Tag size={13} color="#f73582" />
                <span>Active Rate Card: <strong>{activeRateCardName}</strong></span>
              </div>
            )}
          </div>

          {/* Quick Cart Summary Pill */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#f73582',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 10px rgba(247, 53, 130, 0.4)',
                }}
              >
                <ShoppingCart size={18} />
                {totalCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      borderRadius: '50%',
                      fontSize: '10px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #1e1b38',
                    }}
                  >
                    {totalCount}
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Session Cart</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                  ${subtotal.toFixed(2)} ({totalCount} items)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            backgroundColor: 'rgba(247, 53, 130, 0.18)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 2. Filter & Search Controls */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '460px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search by product name, SKU, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '38px',
                paddingRight: searchQuery ? '60px' : '14px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Showing <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> approved assets
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            paddingTop: '2px',
          }}
        >
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '7px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s ease',
              backgroundColor: selectedCategory === 'All' ? '#2B253E' : '#f1f5f9',
              color: selectedCategory === 'All' ? '#ffffff' : '#475569',
              boxShadow: selectedCategory === 'All' ? '0 2px 6px rgba(43, 37, 62, 0.2)' : 'none',
            }}
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
                style={{
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease',
                  backgroundColor: isSelected ? '#f73582' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#475569',
                  boxShadow: isSelected ? '0 2px 6px rgba(247, 53, 130, 0.3)' : 'none',
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Products Grid */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              style={{
                height: '340px',
                borderRadius: '16px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '48px 24px',
            textAlign: 'center',
            maxWidth: '440px',
            margin: '32px auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#fdf2f8',
              color: '#f73582',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Package size={30} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>No Products Found</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', marginBottom: '24px', lineHeight: 1.5 }}>
            {searchQuery || selectedCategory !== 'All'
              ? 'No products match your current search and filter criteria. Try clearing filters to see all available items.'
              : 'There are currently no products configured for your account catalogue visibility. Please contact your Platform Administrator.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: '#f73582',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 3px 8px rgba(247, 53, 130, 0.3)',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
