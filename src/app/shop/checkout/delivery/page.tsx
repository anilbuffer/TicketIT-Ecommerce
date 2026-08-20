// src/app/shop/checkout/delivery/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getSiteAddresses, getAccountOrderRules } from '@/lib/services/accounts.service';
import type { Address, AccountOrderRules } from '@/lib/services/types';
import {
  Truck,
  Building2,
  MapPin,
  User,
  FileEdit,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function CheckoutDeliveryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkoutState, updateCheckoutState } = useCart();

  const [siteData, setSiteData] = useState<{
    siteId: string;
    siteName: string;
    siteCode: string;
    billToAddress: Address;
    shipToAddress: Address;
  } | null>(null);

  const [accountRules, setAccountRules] = useState<AccountOrderRules | null>(null);
  const [useSavedAddress, setUseSavedAddress] = useState<boolean>(checkoutState.useSavedAddress ?? true);
  
  // Custom delivery address form state
  const [customStreet, setCustomStreet] = useState(checkoutState.customShipToAddress?.street || '');
  const [customSuite, setCustomSuite] = useState(checkoutState.customShipToAddress?.suite || '');
  const [customCity, setCustomCity] = useState(checkoutState.customShipToAddress?.city || '');
  const [customState, setCustomState] = useState(checkoutState.customShipToAddress?.state || '');
  const [customPostal, setCustomPostal] = useState(checkoutState.customShipToAddress?.postalCode || '');
  
  // Contacts & Instructions
  const [contactName, setContactName] = useState(checkoutState.deliveryContactName || user?.name || '');
  const [contactPhone, setContactPhone] = useState(checkoutState.deliveryContactPhone || '+1 (212) 555-0190');
  const [instructions, setInstructions] = useState(checkoutState.deliveryInstructions || 'Urgent delivery to loading bay A before 2 PM. Call dispensary receiving on arrival.');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const siteId = user?.siteId || 'site-101';
  const accountId = user?.accountId || 'acc-001';

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [addresses, rules] = await Promise.all([
          getSiteAddresses(siteId),
          getAccountOrderRules(accountId),
        ]);
        setSiteData(addresses);
        setAccountRules(rules);
      } catch (err) {
        console.error('Failed to load delivery info', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [siteId, accountId]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName.trim()) {
      setErrorMsg('Please enter a delivery contact name.');
      return;
    }

    if (!useSavedAddress) {
      if (!customStreet.trim() || !customCity.trim() || !customState.trim() || !customPostal.trim()) {
        setErrorMsg('Please complete all required fields for the custom shipping address.');
        return;
      }
    }

    setErrorMsg(null);

    const customAddress: Address | undefined = !useSavedAddress
      ? {
          street: customStreet.trim(),
          suite: customSuite.trim() || undefined,
          city: customCity.trim(),
          state: customState.trim(),
          postalCode: customPostal.trim(),
          country: 'USA',
        }
      : undefined;

    updateCheckoutState({
      useSavedAddress,
      customShipToAddress: customAddress,
      deliveryContactName: contactName.trim(),
      deliveryContactPhone: contactPhone.trim(),
      deliveryInstructions: instructions.trim(),
    });

    router.push('/shop/checkout/review');
  };

  const defaultBillTo = siteData?.billToAddress || {
    street: '550 Lexington Avenue',
    suite: '14th Floor (Corporate Accounts)',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'USA',
  };

  const defaultShipTo = siteData?.shipToAddress || {
    street: '550 Lexington Avenue',
    suite: 'Ground Floor Dispensary Receiving',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'USA',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        gap: '24px',
        alignItems: 'start',
      }}
    >
      {/* Main Form (Left) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f73582', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Step 2 of 3
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px 0' }}>
            Delivery & Address Configuration
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Specify separate billing and physical delivery addresses, site contact, and freight instructions.
          </p>
        </div>

        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Separate Bill-To & Ship-To Displays */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Bill-To Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#2B253E" />
                  <span>Bill-To Address (Head Office)</span>
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', backgroundColor: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>
                  Fixed
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>
                  {user?.accountName || 'Apex Healthcare Group'}
                </p>
                <p style={{ margin: 0 }}>{defaultBillTo.street} {defaultBillTo.suite ? `, ${defaultBillTo.suite}` : ''}</p>
                <p style={{ margin: 0 }}>{defaultBillTo.city}, {defaultBillTo.state} {defaultBillTo.postalCode}</p>
                <p style={{ margin: 0, color: '#94a3b8' }}>{defaultBillTo.country}</p>
              </div>

              <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', paddingTop: '4px' }}>
                Invoiced directly on monthly consolidated ledger
              </span>
            </div>

            {/* Ship-To Selection Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                border: '1.5px solid #fbcfe8',
                backgroundColor: '#fdf2f8',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #fbcfe8',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} color="#f73582" />
                  <span>Ship-To Destination</span>
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#f73582', backgroundColor: '#ffffff', padding: '1px 6px', borderRadius: '4px', border: '1px solid #fbcfe8' }}>
                  Site Receiving
                </span>
              </div>

              {/* Toggle Saved vs Custom */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="addressChoice"
                    checked={useSavedAddress}
                    onChange={() => setUseSavedAddress(true)}
                    style={{ marginTop: '2px', accentColor: '#f73582' }}
                  />
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>Default Site Receiving Dock:</strong>
                    <p style={{ margin: '2px 0 0 0' }}>{defaultShipTo.street}, {defaultShipTo.suite}</p>
                    <p style={{ margin: 0 }}>{defaultShipTo.city}, {defaultShipTo.state} {defaultShipTo.postalCode}</p>
                  </div>
                </label>

                {accountRules?.allowCustomDeliveryAddress && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingTop: '6px', borderTop: '1px solid #fbcfe8' }}>
                    <input
                      type="radio"
                      name="addressChoice"
                      checked={!useSavedAddress}
                      onChange={() => setUseSavedAddress(false)}
                      style={{ accentColor: '#f73582' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                      Enter alternate one-off delivery address
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Alternate Custom Address Form */}
          {!useSavedAddress && (
            <div
              style={{
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <MapPin size={14} color="#f73582" />
                <span>Alternate Delivery Location</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Street Address *</label>
                  <input
                    type="text"
                    required
                    value={customStreet}
                    onChange={(e) => setCustomStreet(e.target.value)}
                    placeholder="e.g. 780 Third Avenue"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Suite / Dock</label>
                  <input
                    type="text"
                    value={customSuite}
                    onChange={(e) => setCustomSuite(e.target.value)}
                    placeholder="e.g. Bay #4"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>City *</label>
                  <input
                    type="text"
                    required
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="New York"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>State *</label>
                  <input
                    type="text"
                    required
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="NY"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={customPostal}
                    onChange={(e) => setCustomPostal(e.target.value)}
                    placeholder="10017"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Delivery Contact Details */}
          <div
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <User size={14} color="#f73582" />
              <span>Receiving Contact Person</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Contact Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Marcus Vance"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Contact Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (212) 555-0190"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileEdit size={15} color="#f73582" />
              <span>Special Delivery & Dispatch Instructions</span>
            </label>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Provide instructions for logistics couriers (e.g. security gate code, loading bay receiving hours, cold storage handover).
            </p>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Loading dock open 8am - 4pm. Ring buzzer B for dispensary access."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={15} color="#dc2626" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <Link
              href="/shop/checkout/details"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} /> Back to Details
            </Link>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#f73582',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Continue to Final Review</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* Side Summary (Right) */}
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
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0, paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          Delivery Routing Summary
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Assigned Carrier:</span>
            <strong style={{ color: '#0f172a' }}>
              {accountRules?.defaultCarrier || 'Rahhawan Direct Logistics Fleet'}
            </strong>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block' }}>PO Reference:</span>
            <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
              {checkoutState.poReference || 'Pending Entry'}
            </strong>
          </div>

          <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', display: 'block' }}>Estimated Fulfilment:</span>
            <strong style={{ color: '#059669' }}>Same-Day / Next-Day Dispatch</strong>
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            lineHeight: 1.4,
          }}
        >
          <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>Physical packing slip and barcode manifest will be attached to cartons.</span>
        </div>
      </div>
    </div>
  );
}
