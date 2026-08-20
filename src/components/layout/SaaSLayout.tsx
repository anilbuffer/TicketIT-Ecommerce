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
  Building2,
  FileSpreadsheet,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { UserRole, ROLE_DETAILS, DEMO_USERS } from '../../types/auth';
import { TicketITLogo } from '../ui/TicketITLogo';

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

  const currentRoleDetails = role ? ROLE_DETAILS[role] : ROLE_DETAILS.admin;

  // Role-specific navigation items
  const adminNav: NavItem[] = [
    { label: 'Platform HQ Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={19} /> },
    { label: 'Product Catalogue & DAM', href: '/admin/catalogue/products', icon: <Package size={19} /> },
    { label: 'Orders & Fulfilment', href: '/admin/orders/all', icon: <ShoppingCart size={19} />, badge: 'Live' },
    { label: 'Customer Accounts & Sites', href: '/admin/customers/accounts', icon: <Store size={19} /> },
    { label: 'Rate Cards & Pricing', href: '/admin/pricing/rate-cards', icon: <Layers size={19} /> },
    { label: 'Monthly Billing Reports', href: '/admin/reports/monthly-billing', icon: <FileText size={19} /> },
    { label: 'Security & Audit Logs', href: '/admin/reports/audit-log', icon: <History size={19} /> },
  ];

  const siteUserNav: NavItem[] = [
    { label: 'Asset Library & DAM', href: '/site-user', icon: <Package size={19} /> },
    { label: 'New Collateral Order', href: '/site-user#order', icon: <ShoppingCart size={19} />, badge: 'Active' },
    { label: 'My Site Orders', href: '/site-user#orders', icon: <ClipboardList size={19} />, badge: '2 Live' },
    { label: 'Delivery & Tracking', href: '/site-user#dispatch', icon: <Truck size={19} /> },
  ];

  const headOfficeNav: NavItem[] = [
    { label: 'HQ Dashboard', href: '/head-office/dashboard', icon: <LayoutDashboard size={19} /> },
    { label: 'Cross-Site Orders', href: '/head-office/orders/all', icon: <ShoppingCart size={19} />, badge: 'Live' },
    { label: 'Monthly Billing', href: '/head-office/billing/monthly', icon: <FileSpreadsheet size={19} />, badge: 'Reports' },
    { label: 'Spend Insights', href: '/head-office/reports/spend-by-site', icon: <TrendingUp size={19} /> },
  ];

  const activeNavList =
    role === 'admin'
      ? adminNav
      : role === 'head_office'
      ? headOfficeNav
      : siteUserNav;


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
          background: '#1e1b38',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
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
              textDecoration: 'none',
            }}
          >
            {isSidebarCollapsed ? (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#f73582',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  boxShadow: '0 4px 10px rgba(247, 53, 130, 0.35)',
                }}
              >
                IT
              </div>
            ) : (
              <TicketITLogo size="sm" showTagline={true} theme="dark" />
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

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '0.75rem 0.6rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {activeNavList.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href) && item.href !== '/site-user' && item.href !== '/head-office');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    gap: '0.75rem',
                    padding: isSidebarCollapsed ? '0.7rem' : '0.65rem 0.85rem',
                    borderRadius: '10px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(247, 53, 130, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(247, 53, 130, 0.4)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.82rem',
                    transition: 'all 0.15s ease',
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isActive ? '#f73582' : '#94a3b8' }}>{item.icon}</span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        background: 'rgba(247, 53, 130, 0.2)',
                        color: '#f73582',
                        fontWeight: 700,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Role switcher inside sidebar if opened */}
        <div style={{ padding: '0 0.75rem 0.5rem 0.75rem' }}>
          {isRoleDropdownOpen && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  padding: '0.2rem 0.5rem 0.4rem 0.5rem',
                  textTransform: 'uppercase',
                }}
              >
                Switch Role Persona
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                  onClick={() => handleSwitchPersona('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: role === 'admin' ? 'rgba(5, 150, 105, 0.2)' : 'transparent',
                    border: role === 'admin' ? '1px solid rgba(5, 150, 105, 0.4)' : 'none',
                    color: role === 'admin' ? '#34d399' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Shield size={16} color="#059669" />
                  <span>Admin (Operations HQ)</span>
                </button>

                <button
                  onClick={() => handleSwitchPersona('head_office')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: role === 'head_office' ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                    border: role === 'head_office' ? '1px solid rgba(37, 99, 235, 0.4)' : 'none',
                    color: role === 'head_office' ? '#93c5fd' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Building2 size={16} color="#2563eb" />
                  <span>Head Office (All Sites)</span>
                </button>

                <button
                  onClick={() => handleSwitchPersona('site_user')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: role === 'site_user' ? 'rgba(247, 53, 130, 0.2)' : 'transparent',
                    border: role === 'site_user' ? '1px solid rgba(247, 53, 130, 0.4)' : 'none',
                    color: role === 'site_user' ? '#f472b6' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Store size={16} color="#f73582" />
                  <span>Site User (Branch Orders)</span>
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
              <span>SOC 2 Type II Certified</span>
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
                    {user?.organization || 'TicketIT Platform'}
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
              <span style={{ color: '#64748b', fontWeight: 600 }}>TicketIT</span>
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
              <span>Asset Delivery Active</span>
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
                <RefreshCw size={14} color="#f73582" />
                <span>Switch Role</span>
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
                      width: '240px',
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
                      Instant Role Persona Switch
                    </div>

                    <button
                      onClick={() => handleSwitchPersona('admin')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        background: role === 'admin' ? '#ecfdf5' : 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Shield size={16} color="#059669" />
                      <span>Admin (Operations HQ)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchPersona('head_office')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        background: role === 'head_office' ? '#eff6ff' : 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Building2 size={16} color="#2563eb" />
                      <span>Head Office (All Sites)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchPersona('site_user')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        background: role === 'site_user' ? '#fdf2f8' : 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Store size={16} color="#f73582" />
                      <span>Site User (Branch Orders)</span>
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
