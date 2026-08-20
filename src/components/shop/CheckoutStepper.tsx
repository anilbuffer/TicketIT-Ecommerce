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
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* Progress Line */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '2px',
            backgroundColor: '#e2e8f0',
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: '#f73582',
              width: `${(currentIdx / (steps.length - 1)) * 100}%`,
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  backgroundColor: isCompleted ? '#059669' : isCurrent ? '#f73582' : '#ffffff',
                  color: isCompleted || isCurrent ? '#ffffff' : '#94a3b8',
                  border: isCompleted
                    ? '2px solid #059669'
                    : isCurrent
                    ? '2px solid #f73582'
                    : '2px solid #cbd5e1',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(247, 53, 130, 0.15)' : 'none',
                }}
              >
                {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
              </div>

              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'block',
                    color: isCurrent ? '#f73582' : isCompleted ? '#0f172a' : '#94a3b8',
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    fontWeight: 500,
                  }}
                >
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
