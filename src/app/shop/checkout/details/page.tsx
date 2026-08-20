// src/app/shop/checkout/details/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getAccountOrderRules } from '@/lib/services/accounts.service';
import type { AccountOrderRules } from '@/lib/services/types';
import {
  Building2,
  UserCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkoutState, updateCheckoutState, subtotal, totalCount } = useCart();

  const [accountRules, setAccountRules] = useState<AccountOrderRules | null>(null);
  const [poReference, setPoReference] = useState<string>(checkoutState.poReference || '');
  const [poError, setPoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const accountId = user?.accountId || 'acc-001';

  useEffect(() => {
    async function loadRules() {
      setIsLoading(true);
      try {
        const rules = await getAccountOrderRules(accountId);
        setAccountRules(rules);

        // Pre-fill PO reference if not yet set
        if (!checkoutState.poReference) {
          const defaultPo = `${user?.poPrefix || rules.poPrefix || 'PO-APX'}-${Math.floor(1000 + Math.random() * 9000)}`;
          setPoReference(defaultPo);
          updateCheckoutState({ poReference: defaultPo });
        }
      } catch (err) {
        console.error('Failed to load account order rules', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRules();
  }, [accountId]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const isMandatory = accountRules?.requirePoNumber ?? true;
    if (isMandatory && (!poReference || poReference.trim() === '')) {
      setPoError('Purchase Order (PO) Reference is mandatory for your customer account.');
      return;
    }

    setPoError(null);
    updateCheckoutState({ poReference: poReference.trim() });
    router.push('/shop/checkout/delivery');
  };

  const isMandatoryPo = accountRules?.requirePoNumber ?? true;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Details Form (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-[#F73582] uppercase tracking-wider">Step 1 of 3</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Customer & Site Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your account affiliation and site ordering credentials are pre-populated automatically.
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* Pre-populated Account & User Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Building2 size={16} className="text-[#F73582]" />
                <span>Customer Account Association</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Lock size={11} /> Verified Account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Customer Account Name:</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {user?.accountName || 'Apex Healthcare Group'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">ID: {user?.accountId || 'acc-001'}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Ordering Branch / Site:</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {user?.siteName || 'Apex Midtown Central Pharmacy'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Site Code: {user?.siteCode || 'APX-MID-101'}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Ordering Contact Persona:</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {user?.name || 'Marcus Vance'}
                </span>
                <span className="text-[11px] text-slate-500">{user?.email || 'marcus.vance@apexhealth.org'}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Monthly Spending Cap / Status:</span>
                <span className="font-bold text-emerald-700 block mt-0.5">
                  ${user?.monthlyBudgetCap?.toLocaleString() || '25,000'} Monthly Cap (Active)
                </span>
                <span className="text-[11px] text-slate-500">Billed to Head Office</span>
              </div>
            </div>
          </div>

          {/* PO Reference Field (Rule-Driven) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="poReference" className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1">
                <FileText size={15} className="text-[#F73582]" />
                <span>Purchase Order (PO) / Internal Reference</span>
                {isMandatoryPo ? (
                  <span className="text-red-500 font-bold">*</span>
                ) : (
                  <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                )}
              </label>

              {isMandatoryPo ? (
                <span className="text-[11px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  Required by Account Policy
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400">
                  Optional
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your site's PO, authorization code, or internal job reference for this marketing collateral batch. This reference will appear on your monthly consolidated billing statement.
            </p>

            <div className="relative">
              <input
                id="poReference"
                type="text"
                value={poReference}
                onChange={(e) => {
                  setPoReference(e.target.value);
                  if (poError) setPoError(null);
                }}
                placeholder="e.g. PO-APX-MID-9402"
                className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  poError
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-300 focus:border-[#F73582] focus:ring-2 focus:ring-pink-100'
                }`}
              />
            </div>

            {poError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={15} className="shrink-0 text-red-500" />
                <span>{poError}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/shop/cart"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft size={14} /> Back to Cart
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F73582] hover:bg-[#de206d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Continue to Delivery Details</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* Side Summary (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
          Order Quick Snapshot
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Total Items:</span>
            <span className="font-bold text-slate-900">{totalCount} items</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Order Total:</span>
            <span className="text-base font-extrabold text-[#F73582]">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Method:</span>
            <span className="font-semibold text-emerald-700">On-Account Billing</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 space-y-1.5 leading-relaxed">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Info size={14} className="text-[#F73582]" />
            <span>Account B2B Policy</span>
          </div>
          <p>
            Orders are authorized under your group contract. Your Head Office finance controller will review the consolidated report at month end.
          </p>
        </div>
      </div>
    </div>
  );
}
