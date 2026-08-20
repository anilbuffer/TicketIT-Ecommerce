// src/components/shop/CartDrawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from './QuantitySelector';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export function CartDrawer() {
  const {
    items,
    subtotal,
    totalCount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateItemQty,
    removeItem,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsCartDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            height: '100%',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafbfc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#fdf2f8',
                  color: '#f73582',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCart size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Shopping Cart</h3>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, margin: 0 }}>
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} ready for order
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                backgroundColor: '#f1f5f9',
                border: 'none',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Cart Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    marginBottom: '16px',
                  }}
                >
                  <ShoppingBag size={28} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Your Cart is Empty</h4>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '280px', marginTop: '6px', marginBottom: '24px', lineHeight: 1.5 }}>
                  Browse your approved site marketing catalogue and add items to place a collateral order.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
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
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        position: 'relative',
                        width: '64px',
                        height: '64px',
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
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <h4
                            style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#0f172a',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '190px',
                            }}
                          >
                            {item.product.name}
                          </h4>
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
                            {item.product.sku}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            color: '#94a3b8',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '4px',
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '8px',
                          paddingTop: '6px',
                          borderTop: '1px solid #e2e8f0',
                        }}
                      >
                        <QuantitySelector
                          product={item.product}
                          value={item.qty}
                          onChange={(newQty) => updateItemQty(item.id, newQty)}
                          size="sm"
                          showInlineHelp={false}
                        />

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                            ${item.lineTotal.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
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
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Account Billing Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0 }} />
                <span>Billed on monthly consolidated account. No card required.</span>
              </div>

              {/* Subtotal */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Order Subtotal:</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>${subtotal.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link
                  href="/shop/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  View Full Cart
                </Link>

                <Link
                  href="/shop/checkout/details"
                  onClick={() => setIsCartDrawerOpen(false)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: '#f73582',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 3px 8px rgba(247, 53, 130, 0.3)',
                  }}
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
