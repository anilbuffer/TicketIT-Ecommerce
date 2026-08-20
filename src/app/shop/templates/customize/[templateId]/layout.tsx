'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CartProvider } from '@/context/CartContext';

export default function TemplateCustomizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['site_user', 'admin']}>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthGuard>
  );
}
