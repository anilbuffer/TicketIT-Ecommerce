'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Ticket, ShoppingBag, Sparkles, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { summary, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore Events', href: '/' },
    { label: 'Festivals', href: '/#festivals' },
    { label: 'Concerts', href: '/#concerts' },
    { label: 'Tech Summits', href: '/#tech' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        height: 'var(--navbar-height)',
        background: isScrolled ? 'rgba(231, 234, 239, 0.88)' : 'rgba(231, 234, 239, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled
          ? '1px solid rgba(43, 37, 62, 0.12)'
          : '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: isScrolled ? '0 4px 20px rgba(43, 37, 62, 0.06)' : 'none',
        transition: 'all var(--transition-normal)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-anime-blush) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-primary)',
              color: '#ffffff',
            }}
          >
            <Ticket size={22} />
          </motion.div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-secondary)',
                  letterSpacing: '-0.03em',
                }}
              >
                Ticket
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.03em',
                }}
              >
                IT
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                display: 'block',
                marginTop: '-3px',
              }}
            >
              Live Experiences
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav-links"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                  position: 'relative',
                  padding: '0.35rem 0',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '2px',
                      background: 'var(--color-primary)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Promo Tag */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--color-green-light)',
              color: 'var(--color-green)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              border: '1px solid rgba(88, 185, 125, 0.25)',
            }}
            className="promo-chip"
          >
            <Sparkles size={14} />
            <span>Code: TICKETIT20 (-20%)</span>
          </div>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCart}
            aria-label="View Cart"
            id="cart-trigger-btn"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: summary.totalTickets > 0 ? 'var(--color-secondary)' : 'var(--color-surface-glass)',
              color: summary.totalTickets > 0 ? '#ffffff' : 'var(--color-secondary)',
              border: '1px solid rgba(43, 37, 62, 0.15)',
              boxShadow: summary.totalTickets > 0 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <ShoppingBag size={18} />
            <span style={{ display: 'none' }} className="cart-btn-label">
              Tickets
            </span>
            {summary.totalTickets > 0 && (
              <span
                style={{
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 2px 8px rgba(247, 53, 130, 0.4)',
                }}
              >
                {summary.totalTickets}
              </span>
            )}
          </motion.button>

          {/* Sell / Host Button */}
          <Link href="/#events" style={{ display: 'none' }} className="host-event-btn">
            <Button variant="primary" size="sm">
              Explore Tickets
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .cart-btn-label {
            display: inline !important;
          }
        }
        @media (min-width: 1024px) {
          .promo-chip {
            display: flex !important;
          }
          .host-event-btn {
            display: inline-block !important;
          }
        }
      `}</style>
    </header>
  );
};
