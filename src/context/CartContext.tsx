'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartSummary } from '../types/cart';
import { EventItem, TicketTier } from '../types/event';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (event: EventItem, ticketTier: TicketTier, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  summary: CartSummary;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SERVICE_FEE_RATE = 0.08; // 8%
const TAX_RATE = 0.05; // 5%

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ticketit_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ticketit_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (event: EventItem, ticketTier: TicketTier, quantity = 1) => {
    const cartItemId = `${event.id}_${ticketTier.id}`;
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          eventId: event.id,
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.displayDate,
          venue: `${event.location.venue}, ${event.location.city}`,
          ticketTier,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setDiscountAmount(0);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TICKETIT20') {
      setAppliedPromo('TICKETIT20');
      return { success: true, message: '20% discount applied!' };
    } else if (cleanCode === 'EARLYBIRD') {
      setAppliedPromo('EARLYBIRD');
      return { success: true, message: '$15 off applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try "TICKETIT20"' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.ticketTier.price * item.quantity,
    0
  );
  const totalTickets = cart.reduce((acc, item) => acc + item.quantity, 0);

  let discount = 0;
  if (appliedPromo === 'TICKETIT20') {
    discount = subtotal * 0.20;
  } else if (appliedPromo === 'EARLYBIRD') {
    discount = Math.min(subtotal, 15);
  }

  const serviceFee = subtotal > 0 ? Number((subtotal * SERVICE_FEE_RATE).toFixed(2)) : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount > 0 ? Number((taxableAmount * TAX_RATE).toFixed(2)) : 0;
  const total = Number(Math.max(0, subtotal - discount + serviceFee + tax).toFixed(2));

  const summary: CartSummary = {
    subtotal,
    serviceFee,
    tax,
    discount,
    total,
    totalTickets,
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        summary,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
