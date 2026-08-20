'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Minus, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { EventItem, TicketTier } from '../../types/event';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TicketSelectorProps {
  event: EventItem;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({ event }) => {
  const { addItem } = useCart();
  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.ticketTiers[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const activeTier = event.ticketTiers.find((t) => t.id === selectedTierId) || event.ticketTiers[0];
  const totalPrice = activeTier ? activeTier.price * quantity : 0;

  const handleAddToCart = () => {
    if (!activeTier) return;
    addItem(event, activeTier, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      style={{
        background: 'var(--color-surface-translucent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)' }}>
            Select Your Pass
          </span>
          <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
            Ticket Options
          </h3>
        </div>
        <Badge variant="green" size="sm" icon={<Zap size={12} />}>
          Instant Digital Pass
        </Badge>
      </div>

      {/* Tier Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {event.ticketTiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          return (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedTierId(tier.id)}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${
                  isSelected ? 'var(--color-primary)' : 'rgba(43, 37, 62, 0.1)'
                }`,
                background: isSelected
                  ? 'rgba(247, 53, 130, 0.04)'
                  : 'rgba(255, 255, 255, 0.7)',
                padding: '1.1rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: 'var(--font-size-md)', color: 'var(--color-secondary)' }}>
                      {tier.name}
                    </span>
                    {tier.isPopular && (
                      <Badge variant="primary" size="sm">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', marginBottom: '0.6rem' }}>
                    {tier.description}
                  </p>

                  {/* Perks list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {tier.perks.map((perk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-main)' }}>
                        <Check size={13} color="var(--color-green)" strokeWidth={3} />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-family-display)',
                        fontWeight: 800,
                        fontSize: 'var(--font-size-2xl)',
                        color: 'var(--color-secondary)',
                      }}
                    >
                      ${tier.price}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      each
                    </span>
                  </div>
                  {tier.originalPrice && (
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        textDecoration: 'line-through',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      ${tier.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quantity Selector & Summary */}
      <div
        style={{
          background: 'rgba(231, 234, 239, 0.6)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            QUANTITY
          </div>
          <div style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>
            {quantity} {quantity === 1 ? 'Ticket' : 'Tickets'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              border: '1px solid rgba(43, 37, 62, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)',
              cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
              opacity: quantity <= 1 ? 0.4 : 1,
            }}
            disabled={quantity <= 1}
          >
            <Minus size={15} />
          </button>
          <span style={{ fontWeight: 800, fontSize: 'var(--font-size-md)', minWidth: '20px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="Increase quantity"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              border: '1px solid rgba(43, 37, 62, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)',
              cursor: quantity >= 10 ? 'not-allowed' : 'pointer',
            }}
            disabled={quantity >= 10}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Total & Action Button */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-sub)' }}>
            Estimated Total
          </span>
          <span
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 800,
              color: 'var(--color-secondary)',
            }}
          >
            ${totalPrice}
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          leftIcon={<ShoppingBag size={20} />}
          id="add-to-cart-btn"
        >
          {isAdded ? 'Added to Cart!' : `Add ${quantity} Ticket${quantity > 1 ? 's' : ''} to Cart`}
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
        <ShieldCheck size={14} color="var(--color-green)" />
        <span>Official verified tickets with 100% money-back guarantee</span>
      </div>
    </div>
  );
};
