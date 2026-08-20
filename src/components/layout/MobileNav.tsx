'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Calendar, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { summary, toggleCart } = useCart();

  const items = [
    { label: 'Explore', href: '/', icon: Compass },
    { label: 'Trending', href: '/#trending', icon: Sparkles },
    { label: 'Calendar', href: '/#calendar', icon: Calendar },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 890,
        height: 'var(--mobile-nav-height)',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(43, 37, 62, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
        boxShadow: '0 -4px 20px rgba(43, 37, 62, 0.08)',
      }}
      className="mobile-nav-bar"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-sub)',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.4rem 0.8rem',
            }}
          >
            <Icon size={20} color={isActive ? 'var(--color-primary)' : 'var(--color-text-sub)'} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Mobile Cart Trigger */}
      <button
        onClick={toggleCart}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
          color: summary.totalTickets > 0 ? 'var(--color-primary)' : 'var(--color-text-sub)',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.4rem 0.8rem',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {summary.totalTickets > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -8,
                background: 'var(--color-primary)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {summary.totalTickets}
            </span>
          )}
        </div>
        <span>Tickets</span>
      </button>

      <style jsx>{`
        @media (min-width: 769px) {
          .mobile-nav-bar {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
