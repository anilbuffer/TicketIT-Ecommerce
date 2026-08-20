// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, EffectiveProduct, Address } from '@/lib/services/types';

export interface CartItem {
  id: string; // productId
  product: EffectiveProduct | Product;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CheckoutState {
  poReference: string;
  campaignCode?: string;
  projectCode?: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  deliveryInstructions: string;
  useSavedAddress: boolean;
  customShipToAddress?: Address;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  totalCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addItem: (product: EffectiveProduct | Product, qty: number, effectivePrice?: number) => { success: boolean; error?: string };
  updateItemQty: (productId: string, qty: number) => { success: boolean; error?: string };
  removeItem: (productId: string) => void;
  clearCart: () => void;
  validateQty: (product: Product | EffectiveProduct, qty: number) => string | null;
  checkoutState: CheckoutState;
  setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  updateCheckoutState: (partial: Partial<CheckoutState>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function validateProductQty(product: Product | EffectiveProduct, qty: number): string | null {
  if (product.status && product.status !== 'ACTIVE') {
    return `Product is ${product.status.toLowerCase()} and cannot be ordered.`;
  }
  const moq = product.moq || 1;
  const multiple = product.orderMultiple || 1;

  if (qty < moq) {
    return `Minimum order quantity (MOQ) is ${moq} ${product.uom || 'units'}.`;
  }

  if (multiple > 1) {
    const diff = qty - moq;
    if (diff % multiple !== 0) {
      return `Quantity must be in multiples of ${multiple} (e.g. ${moq}, ${moq + multiple}, ${moq + multiple * 2}).`;
    }
  }

  return null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    poReference: '',
    deliveryContactName: '',
    deliveryContactPhone: '',
    deliveryInstructions: '',
    useSavedAddress: true,
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  const addItem = (product: EffectiveProduct | Product, qty: number, customPrice?: number) => {
    const validation = validateProductQty(product, qty);
    if (validation) {
      return { success: false, error: validation };
    }

    const effectivePrice = customPrice !== undefined 
      ? customPrice 
      : ('effectivePrice' in product && typeof product.effectivePrice === 'number' ? product.effectivePrice : product.basePrice);

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === product.id);
      if (existingIdx > -1) {
        const existing = prev[existingIdx];
        const newQty = existing.qty + qty;
        const lineTotal = Number((newQty * effectivePrice).toFixed(2));
        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          qty: newQty,
          unitPrice: effectivePrice,
          lineTotal,
        };
        return updated;
      } else {
        const lineTotal = Number((qty * effectivePrice).toFixed(2));
        return [
          ...prev,
          {
            id: product.id,
            product,
            qty,
            unitPrice: effectivePrice,
            lineTotal,
          },
        ];
      }
    });

    return { success: true };
  };

  const updateItemQty = (productId: string, qty: number) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return { success: false, error: 'Item not found in cart' };

    if (qty <= 0) {
      removeItem(productId);
      return { success: true };
    }

    const validation = validateProductQty(item.product, qty);
    if (validation) {
      return { success: false, error: validation };
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === productId) {
          const lineTotal = Number((qty * i.unitPrice).toFixed(2));
          return { ...i, qty, lineTotal };
        }
        return i;
      })
    );

    return { success: true };
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateCheckoutState = (partial: Partial<CheckoutState>) => {
    setCheckoutState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addItem,
        updateItemQty,
        removeItem,
        clearCart,
        validateQty: validateProductQty,
        checkoutState,
        setCheckoutState,
        updateCheckoutState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
