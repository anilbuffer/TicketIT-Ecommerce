'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Truck,
  LayoutDashboard,
  Package,
  Store,
  FileText,
  History,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Layers,
  MapPin,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, ROLE_DETAILS, DEMO_USERS } from '../../types/auth';

// Custom Pill Icon for Pharmacy
function PillIcon({ size = 18, color = '#f59e0b' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block' }}
    >
      <rect
        x="3"
        y="10.5"
        width="18"
        height="9"
        rx="4.5"
        transform="rotate(-45 3 10.5)"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 8.5L15.5 15.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface SaaSLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function SaaSLayout({ children, activeSection, onSectionChange }: SaaSLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, switchRole } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const currentRoleDetails = role ? ROLE_DETAILS[role] : ROLE_DETAILS.admin;

  // Role-specific navigation items
  const adminNav: NavItem[] = [
    { label: 'Platform HQ Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={19} /> },
    { label: 'Product Catalogue & DAM', href: '/admin/catalogue/products', icon: <Package size={19} /> },
    { label: 'Orders & Fulfilment', href: '/admin/orders/all', icon: <Truck size={19} />, badge: 'Live' },
    { label: 'Customer Accounts & Sites', href: '/admin/customers/accounts', icon: <Store size={19} /> },
    { label: 'Rate Cards & Pricing', href: '/admin/pricing/rate-cards', icon: <Layers size={19} /> },
    { label: 'Monthly Billing Reports', href: '/admin/reports/monthly-billing', icon: <FileText size={19} /> },
    { label: 'Security & Audit Logs', href: '/admin/reports/audit-log', icon: <History size={19} /> },
  ];

  const pharmacyNav: NavItem[] = [
    { label: 'Dispensing Dashboard', href: '/portal/site-user', icon: <LayoutDashboard size={19} /> },
    { label: 'Medication & Collateral Order', href: '/portal/site-user#order', icon: <Package size={19} />, badge: 'Active' },
    { label: 'Prescriptions & PO Queue', href: '/portal/site-user#orders', icon: <ClipboardList size={19} />, badge: '4 Pending' },
    { label: 'Courier Dispatch Tracking', href: '/portal/site-user#dispatch', icon: <Truck size={19} /> },
  ];

  const driverNav: NavItem[] = [
    { label: 'Courier Fleet Dashboard', href: '/portal/head-office', icon: <LayoutDashboard size={19} /> },
    { label: 'Active Delivery Manifest', href: '/portal/head-office#deliveries', icon: <MapPin size={19} />, badge: '12 Drops' },
    { label: 'Consolidated Route Billing', href: '/portal/head-office#billing', icon: <FileText size={19} /> },
    { label: 'Vehicle & Cold-Chain Logs', href: '/portal/head-office#fleet', icon: <ShieldCheck size={19} /> },
  ];

  const activeNavList =
    role === 'admin'
      ? adminNav
      : role === 'head_office'
      ? driverNav
      : pharmacyNav;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSwitchPersona = (newRole: UserRole) => {
    switchRole(newRole);
    setIsRoleDropdownOpen(false);
    router.push(ROLE_DETAILS[newRole].defaultRedirect);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* 1. LEFT SIDEBAR (DESKTOP) */}
      <aside
        style={{
          width: isSidebarCollapsed ? '80px' : '260px',
          background: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRight: '1px solid #1e293b',
          zIndex: 30,
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: isSidebarCollapsed ? '1.25rem 0.5rem' : '1.25rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Link
            href="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(5, 150, 105, 0.35)',
                flexShrink: 0,
              }}
            >
              R
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Rahhawan
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                  Logistics & SaaS CMS
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Current Active Role Badge */}
        {!isSidebarCollapsed && (
          <div
            style={{
              margin: '1rem 1rem 0.5rem 1rem',
              padding: '0.75rem 0.85rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: currentRoleDetails.themeColor,
                  boxShadow: `0 0 10px ${currentRoleDetails.themeColor}`,
                }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc' }}>
                  {currentRoleDetails.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {currentRoleDetails.subtitle}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              title="Switch role"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#cbd5e1',
                padding: '4px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={13} />
            </button>
          </div>
        )}

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: isSidebarCollapsed ? '0.5rem 0' : '0.5rem 0.75rem',
              textAlign: isSidebarCollapsed ? 'center' : 'left',
            }}
          >
            {!isSidebarCollapsed ? 'PORTAL NAVIGATION' : '•••'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {activeNavList.map((item, idx) => {
              const isActive = pathname === item.href || (idx === 0 && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (onSectionChange) {
                      const hash = item.href.split('#')[1];
                      if (hash) onSectionChange(hash);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    padding: isSidebarCollapsed ? '0.75rem 0' : '0.65rem 0.85rem',
                    borderRadius: '10px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(5, 150, 105, 0.18)' : 'transparent',
                    border: isActive ? '1px solid rgba(5, 150, 105, 0.35)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isActive ? '#10b981' : '#94a3b8' }}>{item.icon}</span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && item.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#cbd5e1',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Role Switch Section in Sidebar */}
          {!isSidebarCollapsed && (
            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0 0.75rem 0.5rem 0.75rem',
                }}
              >
                SWITCH PORTAL ROLE
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <button
                  onClick={() => handleSwitchPersona('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    border: role === 'admin' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                    color: role === 'admin' ? '#fca5a5' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Shield size={16} color="#ef4444" />
                  <span>Super Admin</span>
                </button>

                <button
                  onClick={() => handleSwitchPersona('site_user')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: role === 'site_user' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    border: role === 'site_user' ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                    color: role === 'site_user' ? '#fcd34d' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <PillIcon size={16} color="#f59e0b" />
                  <span>Pharmacy Hub</span>
                </button>

                <button
                  onClick={() => handleSwitchPersona('head_office')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: role === 'head_office' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    border: role === 'head_office' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                    color: role === 'head_office' ? '#86efac' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Truck size={16} color="#10b981" />
                  <span>Driver Courier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer: System Status & User Profile */}
        <div
          style={{
            padding: isSidebarCollapsed ? '0.75rem 0.5rem' : '0.85rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          {!isSidebarCollapsed && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.7rem',
                color: '#10b981',
                fontWeight: 700,
                marginBottom: '0.75rem',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
              }}
            >
              <ShieldCheck size={14} />
              <span>HIPAA Compliant & Secure</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            }}
          >
            {!isSidebarCollapsed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: currentRoleDetails.themeColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {user?.name || 'Authorized User'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: '#94a3b8',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {user?.organization || 'Rahhawan Logistics'}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentRoleDetails.themeColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                }}
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top SaaS Header Bar */}
        <header
          style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          {/* Left: Breadcrumbs / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title="Toggle Sidebar"
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Rahhawan SaaS</span>
              <ChevronRight size={14} color="#94a3b8" />
              <span
                style={{
                  color: currentRoleDetails.themeColor,
                  fontWeight: 800,
                  background: `${currentRoleDetails.themeColor}15`,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                }}
              >
                {currentRoleDetails.title} Portal
              </span>
            </div>
          </div>

          {/* Right: Quick Search + Persona Switcher + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Live Operational Status Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontWeight: 700,
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
              <span>All Hubs Online</span>
            </div>

            {/* Quick Switch Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} color="#059669" />
                <span>Switch Portal</span>
                <ChevronDown size={14} color="#64748b" />
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: '230px',
                      background: '#ffffff',
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #e2e8f0',
                      padding: '0.5rem',
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#64748b',
                        padding: '0.35rem 0.5rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Fast Demo Persona Switch
                    </div>

                    <button
                      onClick={() => handleSwitchPersona('admin')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        background: role === 'admin' ? '#fee2e2' : 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Shield size={16} color="#ef4444" />
                      <span>Super Admin (HQ)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchPersona('site_user')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        background: role === 'site_user' ? '#fef3c7' : 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <PillIcon size={16} color="#f59e0b" />
                      <span>Pharmacy (Dispensing)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchPersona('head_office')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        background: role === 'head_office' ? '#ecfdf5' : 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Truck size={16} color="#10b981" />
                      <span>Driver (Courier Portal)</span>
                    </button>

                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.4rem 0' }} />

                    <Link
                      href="/login"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.65rem',
                        color: '#64748b',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Open Login Role Selector</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
