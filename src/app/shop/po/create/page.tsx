// src/app/shop/po/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Building2,
  Calendar,
  Truck,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  QrCode,
  Lock,
  ChevronRight,
  Plus,
  Minus,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrderMutations } from '@/lib/hooks/useOrders';
import type { Order, TemplateLayer } from '@/lib/services/types';

// Default fallback sample template data in case user lands directly on /shop/po/create
const DEFAULT_PO_DATA = {
  templateId: 'tpl-tpl-001',
  templateName: 'Heavy-Duty Vinyl Retractable Banner (33" x 80")',
  productId: 'prod-002',
  productName: 'Heavy-Duty Vinyl Retractable Banner (33" x 80")',
  category: 'Banners',
  thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
  dimensions: { width: 33, height: 80, unit: 'in' },
  aspectRatio: '1:2',
  canvasConfig: {
    backgroundColor: '#2B253E',
    bgGradient: 'linear-gradient(180deg, #2B253E 0%, #1e1b38 40%, #0f172a 100%)',
  },
  layers: [
    {
      id: 'layer-header-banner',
      type: 'shape',
      name: 'Header Geometric Frame',
      isEditableBySiteUser: false,
      label: 'Master Brand Frame',
      x: 0,
      y: 0,
      width: 100,
      height: 16,
      content: '',
      style: { backgroundColor: '#f73582', opacity: 0.9 },
      zIndex: 1,
    },
    {
      id: 'layer-banner-title',
      type: 'text',
      name: 'Exhibition Main Headline',
      isEditableBySiteUser: true,
      fieldKey: 'businessName',
      label: 'Main Headline / Branch Name',
      x: 8,
      y: 20,
      width: 84,
      height: 15,
      content: 'Apex Midtown Central Pharmacy',
      style: { fontSize: 22, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 },
      zIndex: 3,
    },
    {
      id: 'layer-tagline',
      type: 'text',
      name: 'Event Tagline',
      isEditableBySiteUser: true,
      fieldKey: 'tagline',
      label: 'Event Subtitle',
      x: 8,
      y: 38,
      width: 84,
      height: 12,
      content: 'Leading Patient Care & Next-Gen Diagnostic Services',
      style: { fontSize: 13, fontWeight: 600, color: '#38bdf8' },
      zIndex: 3,
    },
    {
      id: 'layer-promo-offer',
      type: 'text',
      name: 'Core Services List',
      isEditableBySiteUser: true,
      fieldKey: 'promoOffer',
      label: 'Services Bullet List',
      x: 8,
      y: 52,
      width: 84,
      height: 24,
      content: '✓ 24/7 Digital Health Consultations ✓ Same-Day Prescription Delivery ✓ Comprehensive Preventive Screenings ✓ Accredited Clinical Care Team',
      style: { fontSize: 11, fontWeight: 500, color: '#cbd5e1' },
      zIndex: 3,
    },
  ],
  customValues: {
    businessName: 'Apex Midtown Central Pharmacy',
    tagline: 'Leading Patient Care & Next-Gen Diagnostic Services',
    promoOffer: '✓ 24/7 Digital Health Consultations ✓ Same-Day Prescription Delivery ✓ Comprehensive Preventive Screenings ✓ Accredited Clinical Care Team',
    website: 'https://apexhealth.org/expo',
    phone: 'Call Us: 1-800-555-APEX | info@apexhealth.org',
  },
  selectedQuantity: 10,
  unitBasePrice: 65.0,
};

// Volume discount tiers
const VOLUME_TIERS = [
  { minQty: 50, discountPct: 0.25, label: '25% Super-Saver Tier' },
  { minQty: 25, discountPct: 0.20, label: '20% High-Volume Tier' },
  { minQty: 10, discountPct: 0.15, label: '15% Recommended Tier' },
  { minQty: 5, discountPct: 0.10, label: '10% Standard Volume Tier' },
  { minQty: 1, discountPct: 0.00, label: 'Standard Rate' },
];

function getVolumeDiscount(qty: number) {
  const tier = VOLUME_TIERS.find((t) => qty >= t.minQty) || VOLUME_TIERS[VOLUME_TIERS.length - 1];
  return tier;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder, isPending } = useOrderMutations();

  const [poData, setPoData] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(10);
  const [recipientName, setRecipientName] = useState(user?.name || 'Marcus Vance');
  const [recipientPhone, setRecipientPhone] = useState('+1 (212) 555-0199');
  const [recipientEmail, setRecipientEmail] = useState(user?.email || 'marcus.vance@apexhealth.org');
  const [requestedDate, setRequestedDate] = useState('2026-08-28');
  const [deliveryNotes, setDeliveryNotes] = useState('Deliver to front dispensary desk. Attn: Pharmacy Lead.');
  const [poReference, setPoReference] = useState(`PO-APX-MID-${Math.floor(1000 + Math.random() * 9000)}`);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('TICKETIT_CURRENT_PO_CUSTOMIZATION');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPoData(parsed);
          if (parsed.selectedQuantity && parsed.selectedQuantity > 0) {
            setQuantity(parsed.selectedQuantity);
          }
        } catch (e) {
          console.error('Error parsing stored PO customization', e);
          setPoData(DEFAULT_PO_DATA);
          setIsDemoFallback(true);
        }
      } else {
        // Fallback for direct browser access
        setPoData(DEFAULT_PO_DATA);
        setIsDemoFallback(true);
      }
    }
  }, []);

  if (!poData && !submittedOrder) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', margin: '40px auto', maxWidth: '480px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Loading Customization...</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', marginBottom: '20px' }}>
          Preparing Purchase Order preview and pricing details.
        </p>
      </div>
    );
  }

  // Dynamic pricing calculations based on selected unit quantity
  const unitBasePrice = poData?.unitBasePrice || 65.0;
  const currentTier = getVolumeDiscount(quantity);
  const discountPct = currentTier.discountPct;
  const discountedUnitPrice = Number((unitBasePrice * (1 - discountPct)).toFixed(2));
  const totalSaved = Number(((unitBasePrice - discountedUnitPrice) * quantity).toFixed(2));
  const subtotal = Number((quantity * discountedUnitPrice).toFixed(2));
  const deliveryFee = 0.0; // Free on-account delivery
  const totalAmount = subtotal + deliveryFee;

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(5000, newQty));
    setQuantity(validQty);
  };

  const handleSubmitPO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poData) return;

    try {
      const newOrder = await createOrder({
        accountId: user?.accountId || 'acc-001',
        accountName: user?.accountName || 'Apex Healthcare Group',
        siteId: user?.siteId || 'site-101',
        siteCode: user?.siteCode || 'APX-MID-101',
        siteName: user?.siteName || 'Apex Midtown Central Pharmacy',
        userId: user?.id || 'usr_site_101',
        userName: user?.name || 'Marcus Vance',
        userEmail: user?.email || 'marcus.vance@apexhealth.org',
        poReference,
        status: 'PENDING_APPROVAL',
        paymentStatus: 'UNPAID',
        requiresApproval: true,
        totalAmount,
        deliveryNotes,
        requestedDeliveryDate: requestedDate,
        recipientContact: {
          name: recipientName,
          phone: recipientPhone,
          email: recipientEmail,
        },
        deliveryAddress: {
          street: '450 Lexington Avenue',
          suite: 'Suite 100',
          city: 'New York',
          state: 'NY',
          postalCode: '10017',
          country: 'United States',
        },
        customizedArtwork: {
          templateId: poData.templateId,
          templateName: poData.templateName,
          previewUrl: poData.thumbnailUrl || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&auto=format&fit=crop&q=80',
          fields: poData.customValues,
          customizedAt: new Date().toISOString(),
        },
        lineItems: [
          {
            id: `item-${Date.now()}`,
            orderId: '',
            productId: poData.productId || 'prod-001',
            productName: `${poData.productName} (Customized Artwork)`,
            sku: 'SGN-YARD-CORO-1824',
            qty: quantity,
            unitPrice: discountedUnitPrice,
            lineTotal: subtotal,
            packSize: `Pack of ${quantity} Units`,
            uom: 'UN',
            templateId: poData.templateId,
            templateName: poData.templateName,
            customizations: poData.customValues,
          },
        ],
        statusHistory: [
          {
            status: 'PENDING_APPROVAL',
            timestamp: new Date().toISOString(),
            actorName: user?.name || 'Marcus Vance',
            actorRole: 'SITE_USER',
            comment: `Purchase Order generated for ${quantity} units and submitted to Head Office for review & payment approval.`,
          },
        ],
      });

      setSubmittedOrder(newOrder);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('TICKETIT_CURRENT_PO_CUSTOMIZATION');
      }
    } catch (err) {
      console.error('Failed to submit PO', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Fallback Banner Notice if loaded directly */}
      {isDemoFallback && (
        <div
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#2563eb" />
            <span>
              <strong>Sample Template Loaded:</strong> You are previewing PO generation with sample corporate assets. You can also customize any template from the catalog.
            </span>
          </div>
          <Link
            href="/shop/templates"
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Browse Catalog →
          </Link>
        </div>
      )}

      {/* If already submitted, show official Confirmation Card */}
      {submittedOrder ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={40} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            STATUS: PENDING HEAD OFFICE APPROVAL
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Purchase Order Successfully Submitted!
          </h2>

          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '600px', lineHeight: 1.5, margin: 0 }}>
            PO Number <strong>{submittedOrder.poReference}</strong> (Order #{submittedOrder.orderNumber}) for <strong>{quantity} Units</strong> (${totalAmount.toFixed(2)}) has been routed to <strong>Head Office Controller (Elena Rostova)</strong> for approval and corporate payment.
          </p>

          {/* Payment Responsibility Notice */}
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '13px',
              fontWeight: 600,
              maxWidth: '540px',
            }}
          >
            💳 <strong>Site User Payment Exemption:</strong> Zero payment is required from your branch. Head Office pays for the purchase order on the corporate statement.
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
            <Link
              href="/shop/orders"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#2B253E',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Track Order Pipeline →
            </Link>

            <Link
              href="/shop/templates"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Create Another PO
            </Link>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmitPO} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link
                href={poData?.templateId ? `/shop/templates/customize/${poData.templateId}` : '/shop/templates'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', textDecoration: 'none', marginBottom: '6px', fontWeight: 600 }}
              >
                <ArrowLeft size={15} />
                Back to Template Customizer
              </Link>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Step 7 & 8: Review & Submit Purchase Order (PO)
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                Verify customized artwork, configure order units with volume discount, and confirm branch shipping destination.
              </p>
            </div>

            {/* Zero Payment Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#047857',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={16} />
              <span>Head Office Payer • Zero Site Payment</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* LEFT: Customized Artwork Preview & Spec Review & Unit Configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Artwork Proof Card */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                  Customized Artwork Proof
                </h3>

                {/* Scaled Mini-Proof */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: poData.aspectRatio ? poData.aspectRatio.replace(':', ' / ') : '4 / 3',
                    backgroundColor: poData.canvasConfig?.backgroundColor || '#0f172a',
                    backgroundImage: poData.canvasConfig?.bgGradient || 'none',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    padding: '16px',
                  }}
                >
                  {poData.layers?.map((l: TemplateLayer) => {
                    const fieldKey = l.fieldKey || l.id;
                    const content =
                      l.isEditableBySiteUser && poData.customValues?.[fieldKey] !== undefined
                        ? poData.customValues[fieldKey]
                        : l.content;

                    return (
                      <div
                        key={l.id}
                        style={{
                          position: 'absolute',
                          left: `${l.x}%`,
                          top: `${l.y}%`,
                          width: `${l.width}%`,
                          height: `${l.height}%`,
                          backgroundColor: l.style.backgroundColor || 'transparent',
                          borderRadius: l.style.borderRadius ? `${l.style.borderRadius}px` : 0,
                          opacity: l.style.opacity ?? 1,
                          display: 'flex',
                          alignItems: l.type === 'text' ? 'flex-start' : 'center',
                          justifyContent: l.type === 'qrcode' ? 'center' : 'flex-start',
                          padding: '2px',
                        }}
                      >
                        {l.type === 'text' && (
                          <div
                            style={{
                              fontSize: `${Math.max((l.style.fontSize || 14) * 0.5, 9)}px`,
                              fontWeight: l.style.fontWeight || 600,
                              color: l.style.color || '#ffffff',
                              lineHeight: 1.2,
                              overflow: 'hidden',
                            }}
                          >
                            {content}
                          </div>
                        )}
                        {l.type === 'logo' && (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image src={content} alt="Logo" fill unoptimized style={{ objectFit: 'contain' }} />
                          </div>
                        )}
                        {l.type === 'qrcode' && (
                          <div style={{ backgroundColor: '#fff', padding: '2px', borderRadius: '3px' }}>
                            <QrCode size={20} color="#000" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Customized Field Summary List */}
                {poData.customValues && Object.keys(poData.customValues).length > 0 && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                      Personalized Fields Applied
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                      {Object.entries(poData.customValues).map(([key, val]) => (
                        <div key={key} style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                          <span style={{ color: '#64748b', fontSize: '10px', display: 'block', textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <strong style={{ color: '#0f172a' }}>{String(val)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Specifications & Interactive Volume Selector */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Specifications & Volume Configuration
                  </h3>
                  {discountPct > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      <Sparkles size={12} />
                      {(discountPct * 100).toFixed(0)}% Tier Discount Active
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Print Dimensions
                    </label>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {poData.dimensions?.width}&quot; × {poData.dimensions?.height}&quot; ({poData.category || 'Collateral'})
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Print Substrate / Stock
                    </label>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>4mm Fluted Weatherproof Coroplast</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Finishing & Mounting
                    </label>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Double-Sided UV + Metal H-Stakes</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Effective Unit Rate
                    </label>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>
                      ${discountedUnitPrice.toFixed(2)} / unit{' '}
                      {discountPct > 0 && (
                        <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>
                          ${unitBasePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE UNIT SELECTOR SECTION */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                        Select Order Units (Quantity)
                      </label>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Choose volume preset or enter custom unit quantity
                      </span>
                    </div>

                    {/* Stepper + Manual Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: quantity <= 1 ? '#f1f5f9' : '#ffffff',
                          color: quantity <= 1 ? '#94a3b8' : '#334155',
                          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                        title="Decrease by 1 unit"
                      >
                        <Minus size={14} />
                      </button>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) handleQuantityChange(val);
                            else if (e.target.value === '') setQuantity(1);
                          }}
                          style={{
                            width: '74px',
                            height: '32px',
                            textAlign: 'center',
                            borderRadius: '8px',
                            border: '1.5px solid #f73582',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: '#0f172a',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                        title="Increase by 1 unit"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Preset Volume Pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {[
                      { qty: 5, label: '5 Units', discount: '10% OFF' },
                      { qty: 10, label: '10 Units', discount: '15% OFF' },
                      { qty: 25, label: '25 Units', discount: '20% OFF' },
                      { qty: 50, label: '50 Units', discount: '25% OFF' },
                      { qty: 100, label: '100 Units', discount: '25% OFF' },
                    ].map((preset) => {
                      const isSelected = quantity === preset.qty;
                      return (
                        <button
                          key={preset.qty}
                          type="button"
                          onClick={() => setQuantity(preset.qty)}
                          style={{
                            padding: '8px 6px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #f73582' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#fff1f7' : '#ffffff',
                            color: isSelected ? '#f73582' : '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 2px 8px rgba(247, 53, 130, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)',
                          }}
                        >
                          <span style={{ fontSize: '12px', fontWeight: 800 }}>{preset.label}</span>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              color: isSelected ? '#db2777' : '#059669',
                              backgroundColor: isSelected ? '#fce7f3' : '#ecfdf5',
                              padding: '1px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            {preset.discount}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Volume Tier Summary / Savings Banner */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                      <DollarSign size={14} color="#f73582" />
                      <span>
                        Selected: <strong style={{ color: '#0f172a' }}>{quantity} Units</strong> @ ${discountedUnitPrice.toFixed(2)} / unit
                      </span>
                    </div>
                    {totalSaved > 0 ? (
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        🎉 Savings: -${totalSaved.toFixed(2)} ({currentTier.label})
                      </span>
                    ) : (
                      <span style={{ color: '#64748b' }}>
                        Order 5+ units to unlock 10% volume discount
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Branch Shipping Details & Pricing Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Shipping Card */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#2B253E" />
                  Branch Delivery Destination
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PO Reference Number</label>
                    <input
                      type="text"
                      value={poReference}
                      onChange={(e) => setPoReference(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Recipient Full Name</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Contact Phone</label>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Requested Delivery Date</label>
                      <input
                        type="date"
                        value={requestedDate}
                        onChange={(e) => setRequestedDate(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Delivery Address</label>
                    <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                      <strong>{user?.siteName || 'Apex Midtown Central Pharmacy'}</strong>
                      <div>450 Lexington Avenue, Suite 100</div>
                      <div>New York, NY 10017 • United States</div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Special Instructions for Driver</label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '12px', marginTop: '4px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown & Submission Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1.5px solid #fbcfe8',
                  padding: '24px',
                  boxShadow: '0 4px 15px rgba(247, 53, 130, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Financial Breakdown
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Unit Base Price</span>
                    <span>${unitBasePrice.toFixed(2)} / unit</span>
                  </div>
                  {discountPct > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                      <span>Volume Tier Discount ({(discountPct * 100).toFixed(0)}%)</span>
                      <span>-${totalSaved.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Effective Unit Price</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>${discountedUnitPrice.toFixed(2)} / unit</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Quantity Requested</span>
                    <span style={{ fontWeight: 800, color: '#f73582' }}>{quantity} Units</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Standard Ground Shipping</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>FREE (Account Rate)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total PO Value</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#2B253E' }}>
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    fontSize: '11px',
                    color: '#9d174d',
                    lineHeight: 1.4,
                  }}
                >
                  🔒 <strong>Approval Workflow:</strong> Clicking submit will generate official PO #{poReference} for <strong>{quantity} Units</strong> and notify <strong>Head Office Controller</strong> for approval and payment.
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#f73582',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(247, 53, 130, 0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isPending ? 'Submitting PO...' : `Submit PO for Head Office Approval ($${totalAmount.toFixed(2)})`}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
