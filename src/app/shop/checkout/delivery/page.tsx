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
  Phone,
  User,
  FileEdit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Plus,
  AlertCircle,
} from 'lucide-react';

export default function CheckoutDeliveryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkoutState, updateCheckoutState, subtotal, totalCount } = useCart();

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Form (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-[#F73582] uppercase tracking-wider">Step 2 of 3</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Delivery & Address Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify separate billing and physical delivery addresses, site contact, and freight instructions.
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* 1. SEPARATE BILL-TO & SHIP-TO DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bill-To Card (Read-Only / Head Office Account) */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#2B253E]" />
                  <span>Bill-To Address (Head Office)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-200 px-1.5 py-0.5 rounded">
                  Fixed
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed">
                <p className="font-bold text-slate-900">{user?.accountName || 'Apex Healthcare Group'}</p>
                <p>{defaultBillTo.street} {defaultBillTo.suite ? `, ${defaultBillTo.suite}` : ''}</p>
                <p>{defaultBillTo.city}, {defaultBillTo.state} {defaultBillTo.postalCode}</p>
                <p className="text-slate-400">{defaultBillTo.country}</p>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1 italic">
                Invoiced directly on monthly consolidated ledger
              </span>
            </div>

            {/* Ship-To Selection Card */}
            <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/30 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-pink-200/60">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck size={14} className="text-[#F73582]" />
                  <span>Ship-To Delivery Destination</span>
                </span>
                <span className="text-[10px] font-semibold text-pink-700 bg-pink-100 px-1.5 py-0.5 rounded">
                  Site Receiving
                </span>
              </div>

              {/* Toggle: Saved vs Custom (if permitted) */}
              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="addressChoice"
                    checked={useSavedAddress}
                    onChange={() => setUseSavedAddress(true)}
                    className="mt-0.5 text-[#F73582] focus:ring-[#F73582]"
                  />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block">Default Site Receiving Dock:</span>
                    <p className="text-slate-600 mt-0.5">{defaultShipTo.street}, {defaultShipTo.suite}</p>
                    <p className="text-slate-600">{defaultShipTo.city}, {defaultShipTo.state} {defaultShipTo.postalCode}</p>
                  </div>
                </label>

                {accountRules?.allowCustomDeliveryAddress && (
                  <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-pink-200/40">
                    <input
                      type="radio"
                      name="addressChoice"
                      checked={!useSavedAddress}
                      onChange={() => setUseSavedAddress(false)}
                      className="text-[#F73582] focus:ring-[#F73582]"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Enter alternate one-off delivery address
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Alternate Custom Address Form (Expandable) */}
          {!useSavedAddress && (
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-[#F73582]" />
                <span>Alternate Delivery Location</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={customStreet}
                    onChange={(e) => setCustomStreet(e.target.value)}
                    placeholder="e.g. 780 Third Avenue"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Suite / Floor / Dock</label>
                  <input
                    type="text"
                    value={customSuite}
                    onChange={(e) => setCustomSuite(e.target.value)}
                    placeholder="e.g. Bay #4"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="New York"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">State / Region *</label>
                  <input
                    type="text"
                    required
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="NY"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={customPostal}
                    onChange={(e) => setCustomPostal(e.target.value)}
                    placeholder="10017"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. DELIVERY CONTACT DETAILS */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} className="text-[#F73582]" />
              <span>Receiving Contact Person</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (212) 555-0190"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582] bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. DELIVERY INSTRUCTIONS & DOCK NOTES */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileEdit size={15} className="text-[#F73582]" />
              <span>Special Delivery & Dispatch Instructions</span>
            </label>
            <p className="text-xs text-slate-500">
              Provide instructions for logistics couriers (e.g. security gate code, loading bay receiving hours, cold storage handover).
            </p>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Loading dock open 8am - 4pm. Ring buzzer B for dispensary access."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F73582] focus:ring-2 focus:ring-pink-100 text-xs sm:text-sm font-medium"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/shop/checkout/details"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft size={14} /> Back to Details
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Continue to Final Review</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* Side Summary (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
          Delivery Routing Summary
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Assigned Carrier:</span>
            <span className="font-bold text-slate-800">
              {accountRules?.defaultCarrier || 'Rahhawan Direct Logistics Fleet'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">PO Reference:</span>
            <span className="font-bold text-slate-900 font-mono">
              {checkoutState.poReference || 'Pending Entry'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-medium block">Estimated Fulfilment:</span>
            <span className="font-bold text-emerald-700">Same-Day / Next-Day Dispatch</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs flex items-start gap-2">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>Physical packing slip and barcode manifest will be attached to cartons.</span>
        </div>
      </div>
    </div>
  );
}
