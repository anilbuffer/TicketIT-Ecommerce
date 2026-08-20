'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, ShieldCheck, Zap, Headphones, Heart } from 'lucide-react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: 'var(--color-secondary)',
        color: '#ffffff',
        paddingTop: '4rem',
        paddingBottom: '5rem', // space for mobile nav
        marginTop: '6rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container>
        {/* Value Props Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            marginBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(247, 53, 130, 0.15)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>100% Buyer Guarantee</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#a6a0b8' }}>Authentic, verified tickets</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(88, 185, 125, 0.15)',
                color: 'var(--color-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Zap size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>Instant Mobile Delivery</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#a6a0b8' }}>Direct to your Apple/Google Wallet</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 123, 131, 0.15)',
                color: 'var(--color-anime-blush)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Headphones size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>24/7 VIP Support</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#a6a0b8' }}>Live concierge whenever you need</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-anime-blush) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Ticket size={20} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', letterSpacing: '-0.02em' }}>
                Ticket<span style={{ color: 'var(--color-primary)' }}>IT</span>
              </span>
            </div>
            <p style={{ color: '#a6a0b8', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
              The modern marketplace for unforgettable live experiences, concerts, sports tournaments, and global festivals.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Categories
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: 'var(--font-size-sm)', color: '#a6a0b8' }}>
              <li><Link href="/#festivals" style={{ transition: 'color 0.2s' }}>Music Festivals</Link></li>
              <li><Link href="/#concerts" style={{ transition: 'color 0.2s' }}>Live Concerts</Link></li>
              <li><Link href="/#tech" style={{ transition: 'color 0.2s' }}>Tech Conferences</Link></li>
              <li><Link href="/#sports" style={{ transition: 'color 0.2s' }}>Sports & Derbies</Link></li>
              <li><Link href="/#theatre" style={{ transition: 'color 0.2s' }}>Broadway & Arts</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Company & Help
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: 'var(--font-size-sm)', color: '#a6a0b8' }}>
              <li><a href="#about" style={{ transition: 'color 0.2s' }}>About TicketIT</a></li>
              <li><a href="#guarantee" style={{ transition: 'color 0.2s' }}>Buyer Guarantee</a></li>
              <li><a href="#support" style={{ transition: 'color 0.2s' }}>Help Center & FAQs</a></li>
              <li><a href="#privacy" style={{ transition: 'color 0.2s' }}>Privacy Policy</a></li>
              <li><a href="#terms" style={{ transition: 'color 0.2s' }}>Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Newsletter
            </div>
            <p style={{ color: '#a6a0b8', fontSize: 'var(--font-size-xs)', marginBottom: '0.8rem' }}>
              Get secret early-bird discounts and lineup announcements.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.9rem',
                  color: '#ffffff',
                  fontSize: 'var(--font-size-xs)',
                  width: '100%',
                }}
              />
              <button
                style={{
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.6rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: 'var(--font-size-xs)',
                  boxShadow: 'var(--shadow-primary)',
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: 'var(--font-size-xs)',
            color: '#8b8599',
          }}
        >
          <div>
            © 2026 TicketIT Inc. All rights reserved. Crafted with precision for live entertainment lovers.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Built with</span>
            <Heart size={14} color="var(--color-primary)" fill="var(--color-primary)" />
            <span>using Next.js & Framer Motion</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
