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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrderMutations } from '@/lib/hooks/useOrders';
import type { Order, TemplateLayer } from '@/lib/services/types';

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder, isPending } = useOrderMutations();

  const [poData, setPoData] = useState<any>(null);
  const [recipientName, setRecipientName] = useState(user?.name || 'Marcus Vance');
  const [recipientPhone, setRecipientPhone] = useState('+1 (212) 555-0199');
  const [recipientEmail, setRecipientEmail] = useState(user?.email || 'marcus.vance@apexhealth.org');
  const [requestedDate, setRequestedDate] = useState('2026-08-28');
  const [deliveryNotes, setDeliveryNotes] = useState('Deliver to front dispensary desk. Attn: Pharmacy Lead.');
  const [poReference, setPoReference] = useState(`PO-APX-MID-${Math.floor(1000 + Math.random() * 9000)}`);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('TICKETIT_CURRENT_PO_CUSTOMIZATION');
      if (stored) {
        setPoData(JSON.parse(stored));
      }
    }
  }, []);

  if (!poData && !submittedOrder) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', margin: '40px auto', maxWidth: '480px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No Active Customization Found</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', marginBottom: '20px' }}>
          Please select a template and customize your artwork before creating a Purchase Order.
        </p>
        <Link
          href="/shop/templates"
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: '#f73582',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '13px',
          }}
        >
          Go to Template Gallery
        </Link>
      </div>
    );
  }

  // Pricing calculation
  const qty = poData?.selectedQuantity || 10;
  const unitBasePrice = 65.0;
  // Volume discount: 10% for >= 5, 20% for >= 15
  const discountPct = qty >= 15 ? 0.2 : qty >= 5 ? 0.1 : 0;
  const discountedUnitPrice = unitBasePrice * (1 - discountPct);
  const subtotal = Number((qty * discountedUnitPrice).toFixed(2));
  const deliveryFee = 0.0; // Free on-account delivery
  const totalAmount = subtotal + deliveryFee;

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
            qty,
            unitPrice: discountedUnitPrice,
            lineTotal: subtotal,
            packSize: 'Pack of 5',
            uom: 'PK',
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
            comment: 'Purchase Order generated and submitted to Head Office for review & payment approval.',
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
            PO Number <strong>{submittedOrder.poReference}</strong> (Order #{submittedOrder.orderNumber}) has been routed to <strong>Head Office Controller (Elena Rostova)</strong> for approval and corporate payment.
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
                href={`/shop/templates/customize/${poData.templateId}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', textDecoration: 'none', marginBottom: '6px', fontWeight: 600 }}
              >
                <ArrowLeft size={15} />
                Back to Template Customizer
              </Link>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Step 7 & 8: Review & Submit Purchase Order (PO)
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                Verify customized artwork, quantity pricing, and branch shipping destination.
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
            {/* LEFT: Customized Artwork Preview & Spec Review */}
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
                    aspectRatio: poData.aspectRatio.replace(':', ' / '),
                    backgroundColor: poData.canvasConfig.backgroundColor,
                    backgroundImage: poData.canvasConfig.bgGradient || 'none',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    padding: '16px',
                  }}
                >
                  {poData.layers.map((l: TemplateLayer) => {
                    const fieldKey = l.fieldKey || l.id;
                    const content =
                      l.isEditableBySiteUser && poData.customValues[fieldKey] !== undefined
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
              </div>

              {/* Product Specifications */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  Specifications & Volume Configuration
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Print Dimensions
                    </label>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {poData.dimensions.width}&quot; × {poData.dimensions.height}&quot; ({poData.category})
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
                      Order Quantity (Units)
                    </label>
                    <div style={{ fontWeight: 800, color: '#f73582' }}>{qty} Units</div>
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
                      <span>-${(unitBasePrice * discountPct * qty).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Quantity Requested</span>
                    <span>{qty} Units</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Standard Ground Shipping</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>FREE (Account Rate)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total PO Value</span>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#2B253E' }}>
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
                  🔒 <strong>Approval Workflow:</strong> Clicking submit will generate official PO #{poReference} and notify <strong>Head Office Controller</strong> for approval and payment.
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
                  {isPending ? 'Submitting PO...' : 'Submit PO for Head Office Approval'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
