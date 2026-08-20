'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Tag, ShieldCheck, ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    summary,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput);
    setPromoMessage({
      text: result.message,
      isError: !result.success,
    });
    if (result.success) {
      setPromoInput('');
    }
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag size={20} color="var(--color-primary)" />
          <span>Your Ticket Basket ({summary.totalTickets})</span>
        </div>
      }
      footer={
        cart.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--color-green-light)',
                    border: '1px solid rgba(88, 185, 125, 0.3)',
                    padding: '0.5rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-green)', fontWeight: 700 }}>
                    <Check size={14} />
                    <span>Promo Applied: {appliedPromo}</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flex: 1,
                      background: 'rgba(231, 234, 239, 0.6)',
                      border: '1px solid rgba(43, 37, 62, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.4rem 0.75rem',
                    }}
                  >
                    <Tag size={14} color="var(--color-text-muted)" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. TICKETIT20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: 'var(--font-size-xs)',
                        width: '100%',
                        color: 'var(--color-text-main)',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    style={{
                      background: 'var(--color-secondary)',
                      color: '#ffffff',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 700,
                      padding: '0.4rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoMessage && (
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    marginTop: '0.3rem',
                    color: promoMessage.isError ? 'var(--color-primary)' : 'var(--color-green)',
                  }}
                >
                  {promoMessage.text}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: 'var(--font-size-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-sub)' }}>
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-green)', fontWeight: 700 }}>
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-sub)' }}>
                <span>Service & Processing Fee (8%)</span>
                <span>${summary.serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-sub)' }}>
                <span>Estimated Tax (5%)</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid rgba(43, 37, 62, 0.1)',
                  fontWeight: 800,
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-secondary)',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xl)' }}>
                  ${summary.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link href="/checkout" onClick={closeCart}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={18} />}
                id="drawer-checkout-btn"
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        ) : null
      }
    >
      {cart.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem 1rem',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <h4 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-secondary)' }}>
            Your basket is empty
          </h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', maxWidth: '260px' }}>
            Explore our curated selection of concerts, festivals, and games to grab your tickets.
          </p>
          <Button variant="secondary" size="md" onClick={closeCart}>
            Explore Events
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(43, 37, 62, 0.1)',
                  padding: '0.85rem',
                  display: 'flex',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Event Thumb */}
                <div
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.eventImage}
                    alt={item.eventTitle}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 700,
                          color: 'var(--color-secondary)',
                          lineHeight: 1.3,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.eventTitle}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove ticket"
                        style={{
                          color: 'var(--color-text-muted)',
                          padding: '0.2rem',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: '2px' }}>
                      {item.ticketTier.name} • ${item.ticketTier.price} each
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {item.eventDate}
                    </div>
                  </div>

                  {/* Quantity Counter & Total */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          background: 'rgba(43, 37, 62, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-secondary)',
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          background: 'rgba(43, 37, 62, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-secondary)',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)' }}>
                      ${(item.ticketTier.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(88, 185, 125, 0.1)',
              border: '1px solid rgba(88, 185, 125, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 0.8rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-green)',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={16} />
            <span>Tickets are reserved in your basket for 15 minutes</span>
          </div>
        </div>
      )}
    </Drawer>
  );
};
