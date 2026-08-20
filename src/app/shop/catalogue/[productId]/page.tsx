// src/app/shop/catalogue/[productId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getProductWithPricing } from '@/lib/services/products.service';
import type { EffectiveProduct } from '@/lib/services/types';
import { QuantitySelector } from '@/components/shop/QuantitySelector';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  ShieldCheck,
  ShieldAlert,
  Tag,
  AlertTriangle,
  Download,
  FileDown,
  Sparkles,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

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
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMAGE);

  // Dynamic Personalization state
  const [customBranchHeadline, setCustomBranchHeadline] = useState('');
  const [customPromoTag, setCustomPromoTag] = useState('Spring Health & Wellness Campaign');
  const [customPhone, setCustomPhone] = useState('+1 (212) 555-0199');
  const [customHours, setCustomHours] = useState('Mon-Sat 8AM-9PM');

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const item = await getProductWithPricing(productId, user?.accountId || 'acc-001');
        if (item) {
          setProduct(item);
          setQty(item.moq || 1);
          setImgSrc(item.thumbnailUrl || FALLBACK_IMAGE);
          setCustomBranchHeadline(user?.siteName || 'Apex Midtown Central Pharmacy');
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId, user?.accountId, user?.siteName]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
        <div style={{ width: '180px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9' }} />
        <div style={{ height: '480px', borderRadius: '24px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center', maxWidth: '440px', margin: '48px auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Product Not Found</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', marginBottom: '20px' }}>
          The requested marketing asset does not exist or is not available for your site.
        </p>
        <Link
          href="/shop/catalogue"
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: '#f73582',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Return to Catalogue
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
    if (!isAvailable || !isValidQty) return;
    const res = addItem(product, qty, unitPrice);
    if (!res.success) {
      setAddError(res.error || 'Cannot add product to cart');
      return;
    }

    setAddError(null);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* 1. Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href="/shop/catalogue"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#475569',
            backgroundColor: '#ffffff',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Asset Catalogue</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
          <span>ID: {product.id}</span>
          <span>•</span>
          <span>SKU: {product.sku}</span>
        </div>
      </div>

      {/* 2. Main Product Hero */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 5fr) minmax(360px, 7fr)',
          gap: 0,
        }}
      >
        {/* Left Column: Image */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: '1px solid #f1f5f9',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1 / 1',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              style={{
                objectFit: 'cover',
                filter: !isAvailable ? 'grayscale(80%) contrast(85%)' : 'none',
              }}
            />

            {/* Customization live overlay badge on preview */}
            {customBranchHeadline && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#F472B6' }}>✓ Custom Template:</div>
                <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {customBranchHeadline}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>{customPromoTag}</div>
              </div>
            )}

            {!isAvailable && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.45)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    maxWidth: '280px',
                  }}
                >
                  <ShieldAlert size={28} color="#ef4444" style={{ margin: '0 auto 8px auto' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {product.status === 'SUPERSEDED' ? 'Item Superseded' : 'Item Unavailable'}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', margin: 0 }}>
                    {product.status === 'SUPERSEDED'
                      ? 'This revision has been archived and replaced with an updated specification.'
                      : 'This asset is currently not available for site dispatch.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {product.isCustomPriced && (
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: '#fdf2f8',
                border: '1px solid #fbcfe8',
                color: '#f73582',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <Tag size={13} />
              <span>Contract Pricing Applied ({product.discountPct}% Discount)</span>
            </div>
          )}
        </div>

        {/* Right Column: Details & Order Controls */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Category & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                }}
              >
                {product.categoryName || 'Marketing Collateral'}
              </span>

              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: product.status === 'ACTIVE' ? '#ecfdf5' : '#fef2f2',
                  color: product.status === 'ACTIVE' ? '#065f46' : '#991b1b',
                  border: product.status === 'ACTIVE' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                }}
              >
                {product.status === 'ACTIVE' ? 'Approved for Site Orders' : product.status}
              </span>

              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
                SKU: {product.sku}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>
              {product.name}
            </h1>

            {/* Description */}
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>

            {/* Logistics Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                padding: '12px 0',
                borderTop: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 500 }}>Pack Size</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{product.packSize || '1 Unit'}</span>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 500 }}>UOM</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{product.uom || 'EA'}</span>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 500 }}>MOQ</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{moq} {product.uom}</span>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 500 }}>Order Multiple</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                  {multiple > 1 ? `Multiples of ${multiple}` : 'Any Qty ≥ MOQ'}
                </span>
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Unit Contract Price: <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '4px' }}>Excl. GST</span>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                      ${unitPrice.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>/ {product.uom}</span>
                    {product.isCustomPriced && product.discountPct > 0 && (
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textDecoration: 'line-through' }}>
                        ${product.basePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, display: 'block' }}>
                    Extended Subtotal ({qty} {product.uom}):
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#f73582' }}>
                    ${lineTotal.toFixed(2)}
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    + GST (10%): ${(lineTotal * 0.1).toFixed(2)} = <strong style={{ color: '#0f172a' }}>${(lineTotal * 1.1).toFixed(2)}</strong> incl. GST
                  </div>
                </div>
              </div>

              {product.rateCardName && (
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                  <Tag size={12} color="#f73582" />
                  <span>Rate Card Tier: <strong>{product.rateCardName}</strong></span>
                </div>
              )}
            </div>

            {/* Dynamic Template Personalization Tool */}
            <div
              style={{
                padding: '16px 18px',
                borderRadius: '16px',
                backgroundColor: '#FDF2F8',
                border: '1px solid #FBCFE8',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#BE185D" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#9D174D' }}>
                    Personalize Marketing Asset Template
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fff', color: '#BE185D', border: '1px solid #FBCFE8' }}>
                  Web-to-Print Ready
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#831843', margin: 0, lineHeight: 1.4 }}>
                Customize this asset with your branch details before submission. Customized graphics are rendered and attached to your order.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9D174D', marginBottom: '4px' }}>
                    Branch / Location Headline
                  </label>
                  <input
                    type="text"
                    value={customBranchHeadline}
                    onChange={(e) => setCustomBranchHeadline(e.target.value)}
                    placeholder="e.g. Apex Midtown Central"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid #FBCFE8',
                      fontSize: '12px',
                      backgroundColor: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9D174D', marginBottom: '4px' }}>
                    Campaign Promo Tagline
                  </label>
                  <input
                    type="text"
                    value={customPromoTag}
                    onChange={(e) => setCustomPromoTag(e.target.value)}
                    placeholder="e.g. Spring Health & Wellness Expo"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid #FBCFE8',
                      fontSize: '12px',
                      backgroundColor: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9D174D', marginBottom: '4px' }}>
                    Local Branch Phone
                  </label>
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="e.g. +1 (212) 555-0199"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid #FBCFE8',
                      fontSize: '12px',
                      backgroundColor: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9D174D', marginBottom: '4px' }}>
                    Operating Hours / Date Note
                  </label>
                  <input
                    type="text"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    placeholder="e.g. Mon-Sat 8AM-9PM"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid #FBCFE8',
                      fontSize: '12px',
                      backgroundColor: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Optional Downloadable Artwork / Reference File */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    flexShrink: 0,
                  }}
                >
                  <FileDown size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                    Download Approved Artwork & Reference Spec
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Print-ready vector guidelines, dimensions, and brand compliance file (.PDF)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([
                    `--- TICKETIT ASSET SPECIFICATION & ARTWORK REFERENCE ---\n` +
                    `SKU: ${product.sku}\n` +
                    `Asset Name: ${product.name}\n` +
                    `Category: ${product.categoryName || 'Marketing Asset'}\n` +
                    `Pack Size: ${product.packSize || '1 Unit'}\n` +
                    `Unit of Measure: ${product.uom || 'EA'}\n` +
                    `Unit Price (ex. GST): $${unitPrice.toFixed(2)}\n` +
                    `MOQ: ${moq}\n` +
                    `Order Multiples: ${multiple}\n` +
                    `Status: ${product.status}\n` +
                    `Description: ${product.description}\n` +
                    `Customization Headline: ${customBranchHeadline}\n` +
                    `Customization Tagline: ${customPromoTag}\n` +
                    `Customization Phone: ${customPhone}\n` +
                    `Customization Hours: ${customHours}\n` +
                    `Reference URL: ${product.thumbnailUrl}\n` +
                    `Generated On: ${new Date().toISOString()}\n`
                  ], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${product.sku}_Artwork_Reference_Spec.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Download size={13} />
                <span>Download Spec</span>
              </button>
            </div>
          </div>

          {/* Ordering Validation & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isAvailable ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
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

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isValidQty}
                    style={{
                      padding: '14px 24px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: isValidQty ? 'pointer' : 'not-allowed',
                      backgroundColor: isAdded ? '#059669' : isValidQty ? '#2B253E' : '#cbd5e1',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: isValidQty && !isAdded ? '0 4px 12px rgba(43, 37, 62, 0.3)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} /> Add to Cart
                      </>
                    )}
                  </button>

                  <Link
                    href="/shop/templates"
                    style={{
                      padding: '14px 24px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: 800,
                      backgroundColor: '#f73582',
                      color: '#ffffff',
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(247, 53, 130, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Choose Template & Customize →</span>
                  </Link>
                </div>

                {addError && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={15} />
                    <span>{addError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f1f5f9', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569', margin: 0 }}>
                  Ordering Disabled for this Asset
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                  This product is unavailable or superseded by an updated marketing release.
                </p>
              </div>
            )}

            {/* On-Account Reassurance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', paddingTop: '8px' }}>
              <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0 }} />
              <span>
                Orders are processed on-account and consolidated into your monthly billing report. Zero credit card required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
