'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileSpreadsheet, Store, Layers, Building2, Shield, Lock } from 'lucide-react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: 'var(--color-secondary)',
        color: '#ffffff',
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem', // space for mobile nav
        marginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container>
        {/* Enterprise Value Props Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-md)' }}>Brand-Approved DAM Assets</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#a6a0b8' }}>100% compliant marketing collateral</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(124, 92, 219, 0.15)',
                color: '#7c5cdb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-md)' }}>Consolidated Multi-Site Billing</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#a6a0b8' }}>Single monthly roll-up invoicing</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(247, 53, 130, 0.15)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lock size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-md)' }}>SOC-2 & Audit Certified</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#a6a0b8' }}>Role-based enterprise security</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                }}
              >
                Y
              </div>
              <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', letterSpacing: '-0.02em' }}>
                Yellow <span style={{ color: '#10b981' }}>Marketing</span>
              </span>
            </div>
            <p style={{ color: '#a6a0b8', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
              Enterprise digital asset management, store collateral fulfillment, and automated multi-entity billing platform.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Portals
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: 'var(--font-size-sm)', color: '#a6a0b8' }}>
              <li>
                <Link href="/portal/site-user" style={{ transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Store size={14} color="#58b97d" />
                  <span>Site Collateral Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/head-office" style={{ transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={14} color="#7c5cdb" />
                  <span>Head Office Invoicing</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/admin" style={{ transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={14} color="#f73582" />
                  <span>Admin DAM HQ</span>
                </Link>
              </li>
              <li>
                <Link href="/login" style={{ transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="#38bdf8" />
                  <span>Role Access & Switcher</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Collateral Categories
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: 'var(--font-size-sm)', color: '#a6a0b8' }}>
              <li><span>POS & Window Signage</span></li>
              <li><span>Direct Mail & EDDMs</span></li>
              <li><span>Digital Screen Packs</span></li>
              <li><span>Event Rollups & Banners</span></li>
              <li><span>Social Media Templates</span></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Compliance & Security
            </div>
            <p style={{ color: '#a6a0b8', fontSize: 'var(--font-size-xs)', marginBottom: '0.8rem', lineHeight: 1.5 }}>
              All collateral assets, PO authorization thresholds, and billing feeds comply with SOC-2 Type II standards.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                color: '#34d399',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={16} />
              <span>SOC-2 & ISO-27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.75rem',
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
            © 2026 Yellow Marketing Delivery LLC. All rights reserved. Enterprise Collateral & Asset Delivery System.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Audit Logs</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
