// src/components/shop/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Eye, Tag, ShieldAlert } from 'lucide-react';
import type { EffectiveProduct } from '@/lib/services/types';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from './QuantitySelector';

interface ProductCardProps {
  product: EffectiveProduct;
  index?: number;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState<number>(product.moq || 1);
  const [isValidQty, setIsValidQty] = useState<boolean>(true);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.thumbnailUrl || FALLBACK_IMAGE);

  const isAvailable = product.status === 'ACTIVE';
  const unitPrice = product.effectivePrice ?? product.basePrice;
  const lineTotal = Number((qty * unitPrice).toFixed(2));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable || !isValidQty) return;

    const res = addItem(product, qty, unitPrice);
    if (!res.success) return;

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3), ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isAvailable ? '#ffffff' : '#f8fafc',
        borderRadius: '16px',
        border: isHovered && isAvailable ? '1px solid #fbcfe8' : '1px solid #e2e8f0',
        boxShadow: isHovered && isAvailable
          ? '0 10px 25px -5px rgba(247, 53, 130, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        opacity: isAvailable ? 1 : 0.85,
        height: '100%',
      }}
    >
      {/* 1. Thumbnail Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: '#f1f5f9',
          overflow: 'hidden',
        }}
      >
        <Link
          href={`/shop/catalogue/${product.id}`}
          style={{
            display: 'block',
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              style={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                transform: isHovered && isAvailable ? 'scale(1.04)' : 'scale(1)',
                filter: !isAvailable ? 'grayscale(80%) contrast(85%)' : 'none',
              }}
            />
          </div>
        </Link>

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {/* Category Chip */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            {product.categoryName || 'Marketing Asset'}
          </span>

          {/* Status Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {!isAvailable && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: product.status === 'SUPERSEDED' ? '#fef3c7' : '#fee2e2',
                  color: product.status === 'SUPERSEDED' ? '#92400e' : '#991b1b',
                  border: product.status === 'SUPERSEDED' ? '1px solid #fde68a' : '1px solid #fecaca',
                }}
              >
                <ShieldAlert size={12} />
                {product.status === 'SUPERSEDED' ? 'Superseded' : 'Unavailable'}
              </span>
            )}

            {isAvailable && product.isCustomPriced && product.discountPct > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: '#f73582',
                  color: '#ffffff',
                  boxShadow: '0 2px 5px rgba(247, 53, 130, 0.3)',
                }}
              >
                <Tag size={10} />
                {product.discountPct}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Hover Quick View Button */}
        {isAvailable && isHovered && (
          <Link
            href={`/shop/catalogue/${product.id}`}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                color: '#0f172a',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Eye size={13} color="#f73582" />
              View Specs
            </span>
          </Link>
        )}
      </div>

      {/* 2. Content Details */}
      <div
        style={{
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          {/* SKU and Pack Size */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#64748b',
              marginBottom: '6px',
            }}
          >
            <span>SKU: {product.sku}</span>
            <span
              style={{
                fontFamily: 'inherit',
                fontSize: '10px',
                fontWeight: 600,
                color: '#475569',
                backgroundColor: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {product.packSize || `1 ${product.uom}`}
            </span>
          </div>

          {/* Product Title */}
          <Link
            href={`/shop/catalogue/${product.id}`}
            style={{
              fontWeight: 700,
              fontSize: '14px',
              color: '#0f172a',
              textDecoration: 'none',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </Link>

          {/* Product Description */}
          <p
            style={{
              fontSize: '12px',
              color: '#64748b',
              marginTop: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              minHeight: '34px',
            }}
          >
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Price / {product.uom || 'unit'} <span style={{ fontSize: '9px', fontWeight: 600, color: '#64748b' }}>(excl. GST)</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                  ${unitPrice.toFixed(2)}
                </span>
                {product.isCustomPriced && product.discountPct > 0 && (
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textDecoration: 'line-through' }}>
                    ${product.basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {isAvailable && qty > 1 && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>
                  Total ({qty} {product.uom})
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f73582' }}>
                  ${lineTotal.toFixed(2)} <span style={{ fontSize: '9px', fontWeight: 500, color: '#94a3b8' }}>ex. GST</span>
                </span>
              </div>
            )}
          </div>

          {/* Ordering controls */}
          {isAvailable ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isValidQty}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isValidQty ? 'pointer' : 'not-allowed',
                    backgroundColor: isAdded ? '#059669' : isValidQty ? '#2B253E' : '#cbd5e1',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: isValidQty && !isAdded ? '0 2px 6px rgba(43, 37, 62, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isAdded ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Added!
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShoppingCart size={13} /> Add
                    </span>
                  )}
                </button>
              </div>

              {/* Template customization CTA */}
              <Link
                href="/shop/templates"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  color: '#be185d',
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Browse Design Templates ({product.templatesCount || 4}) →</span>
              </Link>

              {/* Order rules mini pill */}
              {(product.moq > 1 || product.orderMultiple > 1) && (
                <div
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>MOQ: {product.moq}</span>
                  {product.orderMultiple > 1 && <span>Multiple: {product.orderMultiple}</span>}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                {product.status === 'SUPERSEDED' ? 'Item superseded' : 'Unavailable for ordering'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
