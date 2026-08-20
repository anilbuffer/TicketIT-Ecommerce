'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  ShoppingBag,
  Sparkles,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Building2,
  Store,
  Shield,
  KeyRound,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DETAILS } from '../../types/auth';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { summary, toggleCart } = useCart();
  const { user, role, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Explore Events', href: '/' },
    { label: 'Site Ordering', href: '/portal/site-user' },
    { label: 'Head Office Billing', href: '/portal/head-office' },
    { label: 'Admin DAM', href: '/portal/admin' },
  ];

  const currentRoleMeta = role ? ROLE_DETAILS[role] : null;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        height: 'var(--navbar-height)',
        background: isScrolled ? 'rgba(231, 234, 239, 0.92)' : 'rgba(231, 234, 239, 0.78)',
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.25rem',
            }}
          >
            Y
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
                Yellow
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'var(--font-size-xl)',
                  color: '#10b981',
                  letterSpacing: '-0.03em',
                }}
              >
                Delivery
              </span>
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                display: 'block',
                marginTop: '-3px',
              }}
            >
              Marketing DAM & Ecommerce
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem',
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
                  fontWeight: 700,
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
                      height: '2.5px',
                      borderRadius: '2px',
                      background: 'var(--color-primary)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
              padding: '0.55rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              background: summary.totalTickets > 0 ? 'var(--color-secondary)' : 'var(--color-surface-glass)',
              color: summary.totalTickets > 0 ? '#ffffff' : 'var(--color-secondary)',
              border: '1px solid rgba(43, 37, 62, 0.15)',
              boxShadow: summary.totalTickets > 0 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <ShoppingBag size={17} />
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
                  minWidth: '19px',
                  height: '19px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {summary.totalTickets}
              </span>
            )}
          </motion.button>

          {/* User Auth Profile Menu */}
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.75rem 0.4rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#ffffff',
                  border: '1.5px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                }}
              >
                {/* User Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: currentRoleMeta?.themeColor || 'var(--color-secondary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                >
                  {user.name.charAt(0)}
                </div>

                {/* Role Pill */}
                <div style={{ textAlign: 'left', display: 'none' }} className="user-profile-label">
                  <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.1 }}>
                    {user.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: currentRoleMeta?.themeColor, fontWeight: 700 }}>
                    {currentRoleMeta?.title.split(' / ')[0]}
                  </div>
                </div>

                <ChevronDown size={14} color="var(--color-text-muted)" />
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '280px',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '0 16px 36px rgba(43, 37, 62, 0.18)',
                      border: '1px solid var(--color-border)',
                      padding: '1rem',
                      zIndex: 1000,
                    }}
                  >
                    {/* User Card Header */}
                    <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {user.email}
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          marginTop: '0.4rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: `${currentRoleMeta?.themeColor}15`,
                          color: currentRoleMeta?.themeColor,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                        }}
                      >
                        {currentRoleMeta?.badgeText}
                      </div>
                    </div>

                    {/* Direct Portal Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      <Link
                        href="/portal/site-user"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 700,
                          color: 'var(--color-secondary)',
                          background: role === 'site_user' ? 'rgba(88, 185, 125, 0.12)' : 'transparent',
                        }}
                      >
                        <Store size={15} color="#58b97d" />
                        <span>Site User Ordering Hub</span>
                      </Link>

                      <Link
                        href="/portal/head-office"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 700,
                          color: 'var(--color-secondary)',
                          background: role === 'head_office' ? 'rgba(124, 92, 219, 0.12)' : 'transparent',
                        }}
                      >
                        <Building2 size={15} color="#7c5cdb" />
                        <span>Head Office Billing Portal</span>
                      </Link>

                      <Link
                        href="/portal/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 700,
                          color: 'var(--color-secondary)',
                          background: role === 'admin' ? 'rgba(247, 53, 130, 0.12)' : 'transparent',
                        }}
                      >
                        <Shield size={15} color="#f73582" />
                        <span>Portal Admin DAM & Audit</span>
                      </Link>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                      <Link
                        href="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <KeyRound size={12} />
                        <span>Switch Portal</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                          router.push('/login');
                        }}
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--color-primary)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer',
                        }}
                      >
                        <LogOut size={12} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" leftIcon={<KeyRound size={14} />}>
                Portal Login
              </Button>
            </Link>
          )}
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
          .user-profile-label {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
