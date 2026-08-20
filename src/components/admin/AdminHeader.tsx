// src/components/admin/AdminHeader.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Package,
  ShoppingCart,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminHeader({
  title,
  subtitle,
  actionButton,
}: {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}) {
  const { user, logout, role } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      style={{
        height: '72px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(43, 37, 62, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 2px 8px rgba(43, 37, 62, 0.03)',
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#2B253E',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Optional Action Button */}
        {actionButton}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              position: 'relative',
              transition: 'all 150ms ease',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '7px',
                height: '7px',
                backgroundColor: '#F73582',
                borderRadius: '50%',
                boxShadow: '0 0 4px #F73582',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '300px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(43, 37, 62, 0.15)',
                border: '1px solid #E2E8F0',
                padding: '16px',
                zIndex: 50,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2B253E', marginBottom: '8px' }}>
                Recent Operational Alerts
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px', backgroundColor: '#FFF0F6', borderRadius: '6px', color: '#B01654' }}>
                  <strong>New Collateral Order:</strong> ORD-2026-8819 ($630.00) from Downtown Flagship.
                </div>
                <div style={{ padding: '8px', backgroundColor: '#EAF8EF', borderRadius: '6px', color: '#228B53' }}>
                  <strong>Fulfilment Dispatched:</strong> Carrier assigned & tracking updated.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px 6px 6px',
              borderRadius: '9999px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2B253E',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2B253E' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#F73582', fontWeight: 600 }}>
                Operations HQ Admin
              </div>
            </div>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '210px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(43, 37, 62, 0.15)',
                border: '1px solid #E2E8F0',
                padding: '8px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Signed in as</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2B253E', wordBreak: 'break-all' }}>
                  {user?.email || 'sarah.jenkins@ticketit.com'}
                </div>
              </div>
              <Link
                href="/admin/settings/general"
                style={{
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#475569',
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#EF4444',
                  borderRadius: '6px',
                  fontWeight: 600,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
