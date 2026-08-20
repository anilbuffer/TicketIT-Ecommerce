// src/app/shop/checkout/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckoutStepper } from '@/components/shop/CheckoutStepper';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If cart is empty and not on confirmation page, redirect to cart
    if (items.length === 0 && !pathname.includes('/order-confirmation')) {
      router.push('/shop/cart');
    }
  }, [items.length, pathname, router]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '64px',
        maxWidth: '1080px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <CheckoutStepper />
      {children}
    </div>
  );
}
