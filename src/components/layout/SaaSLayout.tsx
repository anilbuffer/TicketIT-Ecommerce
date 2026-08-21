// src/components/layout/SaaSLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Package,
  Store,
  FileText,
  History,
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
  ClipboardList,
  Building2,
  FileSpreadsheet,
  ShoppingCart,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { UserRole, ROLE_DETAILS } from '../../types/auth';
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

export function SaaSLayout({ children }: SaaSLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, switchRole } = useAuth();

  const [isMiniSidebar, setIsMiniSidebar] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const currentRoleDetails = role ? ROLE_DETAILS[role] : ROLE_DETAILS.admin;

  // Responsive breakpoint tracking
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 768) {
        // Mobile
      } else if (width >= 768 && width < 1024) {
        setIsMiniSidebar(true);
        setIsMobileDrawerOpen(false);
      } else {
        setIsMobileDrawerOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMobileDrawerOpen]);

  // Role-specific navigation items
  const adminNav: NavItem[] = [
    { label: 'Platform HQ Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={19} /> },
    { label: 'Master Templates', href: '/admin/templates', icon: <FileSpreadsheet size={19} />, badge: 'Studio' },
    { label: 'Template Builder', href: '/admin/templates/builder', icon: <Layers size={19} /> },
    { label: 'Product Catalogue & DAM', href: '/admin/catalogue/products', icon: <Package size={19} /> },
    { label: 'Orders & Fulfilment', href: '/admin/orders/all', icon: <ShoppingCart size={19} />, badge: 'Live' },
    { label: 'Customer Accounts & Sites', href: '/admin/customers/accounts', icon: <Store size={19} /> },
    { label: 'Rate Cards & Pricing', href: '/admin/pricing/rate-cards', icon: <Layers size={19} /> },
    { label: 'Monthly Billing Reports', href: '/admin/reports/monthly-billing', icon: <FileText size={19} /> },
    { label: 'Security & Audit Logs', href: '/admin/reports/audit-log', icon: <History size={19} /> },
  ];

  const siteUserNav: NavItem[] = [
    { label: 'Template Gallery', href: '/shop/templates', icon: <FileSpreadsheet size={19} /> },
    { label: 'Print Products Catalogue', href: '/shop/catalogue', icon: <Package size={19} /> },
    { label: 'Purchase Orders & Pipeline', href: '/shop/orders', icon: <ClipboardList size={19} />, badge: 'Live' },
    { label: 'Collateral Cart', href: '/shop/cart', icon: <ShoppingCart size={19} /> },
    { label: 'Order History', href: '/shop/orders/history', icon: <History size={19} /> },
  ];

  const headOfficeNav: NavItem[] = [
    { label: 'HQ Dashboard', href: '/head-office/dashboard', icon: <LayoutDashboard size={19} /> },
    { label: 'PO Approvals & Payments', href: '/head-office/approvals', icon: <CheckCircle2 size={19} />, badge: 'Action', badgeColor: '#059669' },
    { label: 'Read-Only Catalogue', href: '/head-office/catalogue', icon: <Package size={19} /> },
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
    setIsMobileDrawerOpen(false);
    router.push(ROLE_DETAILS[newRole].defaultRedirect);
  };

  const isStudioRoute =
    pathname?.includes('/templates/') &&
    (pathname?.includes('/edit') || pathname?.includes('/builder') || pathname?.includes('/customize'));

  const isMini = isMiniSidebar || isStudioRoute;

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileDrawerOpen((prev) => !prev);
    } else {
      setIsMiniSidebar((prev) => !prev);
    }
  };

  // Reusable Sidebar Content for both Desktop aside and Mobile Drawer
  const renderSidebarContent = (isDrawer = false) => {
    const isCollapsed = !isDrawer && isMini;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            minHeight: '70px',
            flexShrink: 0,
            gap: '8px',
          }}
        >
          <Link
            href="/login"
            onClick={() => isDrawer && setIsMobileDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            {isCollapsed ? (
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
                  fontSize: '1.15rem',
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

          {isDrawer ? (
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-label="Close drawer"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <X size={18} />
            </button>
          ) : (
            !isCollapsed && (
              <button
                type="button"
                onClick={() => setIsMiniSidebar(true)}
                title="Collapse to Mini Sidebar"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <PanelLeftClose size={15} />
              </button>
            )
          )}
        </div>

        {/* Current Active Role Badge */}
        {!isCollapsed && (
          <div
            style={{
              margin: '0.85rem 0.85rem 0.35rem 0.85rem',
              padding: '0.7rem 0.85rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
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
        <nav
          style={{
            flex: 1,
            padding: isCollapsed ? '0.75rem 0.45rem' : '0.75rem 0.6rem',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {activeNavList.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' &&
                  pathname.startsWith(item.href) &&
                  item.href !== '/site-user' &&
                  item.href !== '/head-office');

              return (
                <div
                  key={item.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <Link
                    href={item.href}
                    onClick={() => isDrawer && setIsMobileDrawerOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      gap: '0.75rem',
                      padding: isCollapsed ? '0.75rem 0' : '0.65rem 0.85rem',
                      borderRadius: '10px',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      background: isActive ? 'rgba(247, 53, 130, 0.2)' : 'transparent',
                      border: isActive ? '1px solid rgba(247, 53, 130, 0.4)' : '1px solid transparent',
                      textDecoration: 'none',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.82rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: isActive ? '#f73582' : '#94a3b8', flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          background: item.badgeColor
                            ? `${item.badgeColor}33`
                            : 'rgba(247, 53, 130, 0.2)',
                          color: item.badgeColor || '#f73582',
                          fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Floating Mini Tooltip */}
                  {isCollapsed && hoveredNav === item.label && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginLeft: '12px',
                        backgroundColor: '#1E1B38',
                        color: '#FFFFFF',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        zIndex: 100,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            padding: '1px 5px',
                            borderRadius: '9999px',
                            backgroundColor: item.badgeColor || '#F73582',
                            color: '#FFFFFF',
                            fontWeight: 700,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer: System Status & User Profile */}
        <div
          style={{
            padding: isCollapsed ? '0.75rem 0.4rem' : '0.85rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
            flexShrink: 0,
          }}
        >
          {isCollapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsMiniSidebar(false)}
                title="Expand Sidebar"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
          ) : (
            <>
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

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
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
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* 1. DESKTOP/TABLET SIDEBAR (VISIBLE ON SCREENS >= 768px) */}
        <aside
          className="saas-desktop-sidebar"
          style={{
            width: isMini ? '72px' : '260px',
            background: '#1e1b38',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 240ms cubic-bezier(0.16, 1, 0.3, 1)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 30,
            position: 'sticky',
            top: 0,
            height: '100vh',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          {renderSidebarContent(false)}
        </aside>

        {/* 2. MOBILE SLIDE-OVER DRAWER (VISIBLE ON SCREENS < 768px) */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1200,
                display: 'flex',
              }}
            >
              {/* Frosted Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                style={{
                  position: 'relative',
                  width: '85vw',
                  maxWidth: '300px',
                  height: '100%',
                  backgroundColor: '#1e1b38',
                  color: '#ffffff',
                  boxShadow: '10px 0 35px rgba(0, 0, 0, 0.4)',
                  zIndex: 1201,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {renderSidebarContent(true)}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. MAIN APPLICATION CONTENT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'clip' }}>
          {/* Top SaaS Header Bar */}
          <header
            style={{
              minHeight: '56px',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 1.25rem',
              position: 'sticky',
              top: 0,
              zIndex: 35,
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Breadcrumbs / Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
              <button
                onClick={handleToggleSidebar}
                title={isMobile ? 'Open Menu' : isMini ? 'Expand Sidebar' : 'Collapse to Mini'}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {isMobile ? (
                  <Menu size={18} />
                ) : isMini ? (
                  <PanelLeftOpen size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
              {/* Delivery Network Status Pill (Hidden on very small screens) */}
              <div
                className="saas-header-status-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: '#059669',
                  fontWeight: 700,
                  background: '#ecfdf5',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid #a7f3d0',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                />
                <span>Active</span>
              </div>

              {/* Persona Switcher Quick Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={13} color="#64748b" />
                  <span className="saas-role-btn-text">Role</span>
                  <ChevronDown size={14} color="#94a3b8" />
                </button>

                <AnimatePresence>
                  {isRoleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
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
                <span className="saas-exit-btn-text">Exit</span>
              </button>
            </div>
          </header>

          {/* Main Content Body */}
          <main
            style={{
              flex: 1,
              padding: isStudioRoute ? 0 : '24px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: isStudioRoute ? 'hidden' : 'visible',
              height: isStudioRoute ? 'calc(100vh - 56px)' : 'auto',
            }}
          >
            {children}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .saas-desktop-sidebar {
            display: none !important;
          }
          .saas-header-status-pill {
            display: none !important;
          }
          .saas-role-btn-text,
          .saas-exit-btn-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
