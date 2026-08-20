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
  Receipt,
  ShoppingCart,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export default function CartPage() {
  const { user } = useAuth();
  const { items, subtotal, totalCount, updateItemQty, removeItem, clearCart } = useCart();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#f73582',
            }}
          >
            <Building2 size={14} />
            <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Collateral Order Cart
          </h1>

          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Review your marketing materials, update order quantities, or proceed to on-account checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Trash2 size={13} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* 2. Main Cart Content */}
      {items.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '56px 24px',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '32px auto',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#fdf2f8',
              color: '#f73582',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(247, 53, 130, 0.15)',
            }}
          >
            <ShoppingBag size={34} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Your Collateral Cart is Empty
          </h2>

          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5, maxWidth: '360px' }}>
            You haven't added any approved marketing materials or packaging assets to your session cart yet.
          </p>

          <Link
            href="/shop/catalogue"
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
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={15} />
            <span>Return to Asset Catalogue</span>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Cart Items Column (Left) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9',
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <span>Asset & Specification</span>
              <span>Quantity & Total</span>
            </div>

            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Left: Thumbnail & Spec details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px', flex: 1 }}>
                      {/* Image container with strict dimensions & relative positioning */}
                      <div
                        style={{
                          position: 'relative',
                          width: '68px',
                          height: '68px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={item.product.thumbnailUrl || FALLBACK_IMAGE}
                          alt={item.product.name}
                          fill
                          unoptimized
                          sizes="68px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                        <Link
                          href={`/shop/catalogue/${item.id}`}
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#0f172a',
                            textDecoration: 'none',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '300px',
                          }}
                        >
                          {item.product.name}
                        </Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b' }}>
                          <span style={{ fontFamily: 'monospace' }}>SKU: {item.product.sku}</span>
                          <span>•</span>
                          <span
                            style={{
                              backgroundColor: '#e2e8f0',
                              color: '#334155',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                              fontSize: '10px',
                            }}
                          >
                            {item.product.packSize || `1 ${item.product.uom}`}
                          </span>
                        </div>

                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '2px' }}>
                          ${item.unitPrice.toFixed(2)}{' '}
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>
                            / {item.product.uom}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Selector & Line Total */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '20px',
                        flexShrink: 0,
                      }}
                    >
                      <QuantitySelector
                        product={item.product}
                        value={item.qty}
                        onChange={(newQty) => updateItemQty(item.id, newQty)}
                        size="md"
                        showInlineHelp={false}
                      />

                      <div style={{ textAlign: 'right', minWidth: '90px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                          ${item.lineTotal.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#ef4444',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'transparent',
                            padding: '2px 0',
                            marginTop: '2px',
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom helper info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              <Link
                href="/shop/catalogue"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  color: '#f73582',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={14} />
                <span>Add more collateral from catalogue</span>
              </Link>

              <span>
                <strong>{totalCount}</strong> total items in session cart
              </span>
            </div>
          </div>

          {/* Order Summary Column (Right - Sticky) */}
          <div
            style={{
              position: 'sticky',
              top: '80px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <Receipt size={18} color="#f73582" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Order Summary
              </h3>
            </div>

            {/* Site & Account Info Box */}
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Customer Account:</span>
                <strong style={{ color: '#0f172a' }}>{user?.accountName || 'Apex Healthcare Group'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Ordering Branch:</span>
                <strong style={{ color: '#0f172a' }}>{user?.siteCode || 'APX-MID-101'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Payment Terms:</span>
                <strong style={{ color: '#059669' }}>Monthly On-Account</strong>
              </div>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Items Subtotal:</span>
                <strong style={{ color: '#0f172a' }}>${subtotal.toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Consolidated Freight:</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>Free (Fleet Delivery)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Applicable Taxes:</span>
                <span style={{ color: '#64748b' }}>Consolidated on HQ Invoice</span>
              </div>

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                    Total Order Value
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>On-Account Settlement</span>
                </div>

                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Reassurance Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '11px',
                lineHeight: 1.4,
              }}
            >
              <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>No credit card or online payment required. Your order will be placed on-account.</span>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/shop/checkout/details"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                borderRadius: '12px',
                backgroundColor: '#f73582',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
                transition: 'all 0.15s ease',
              }}
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
