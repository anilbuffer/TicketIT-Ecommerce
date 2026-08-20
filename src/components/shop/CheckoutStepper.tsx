// src/components/shop/CheckoutStepper.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Check, Building2, Truck, ClipboardCheck } from 'lucide-react';

export function CheckoutStepper() {
  const pathname = usePathname();

  const steps = [
    {
      id: 'details',
      label: 'Site & PO Reference',
      sublabel: 'Account details',
      href: '/shop/checkout/details',
      icon: Building2,
      number: 1,
    },
    {
      id: 'delivery',
      label: 'Delivery & Addresses',
      sublabel: 'Bill-to & Ship-to',
      href: '/shop/checkout/delivery',
      icon: Truck,
      number: 2,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      sublabel: 'On-account checkout',
      href: '/shop/checkout/review',
      icon: ClipboardCheck,
      number: 3,
    },
  ];

  const getCurrentStepIndex = () => {
    if (pathname.includes('/checkout/details')) return 0;
    if (pathname.includes('/checkout/delivery')) return 1;
    if (pathname.includes('/checkout/review')) return 2;
    return 0;
  };

  const currentIdx = getCurrentStepIndex();

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm mb-6">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-[#F73582] transition-all duration-300 ease-out"
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-[#F73582] border-[#F73582] text-white shadow-md ring-4 ring-pink-100'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
              </div>

              <div className="mt-2 text-center">
                <span
                  className={`text-xs block font-bold transition-colors ${
                    isCurrent
                      ? 'text-[#F73582]'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  {step.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
