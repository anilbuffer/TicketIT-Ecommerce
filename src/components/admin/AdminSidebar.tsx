// src/components/admin/AdminSidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  LayoutDashboard,
  Package,
  Layers,
  Building2,
  Percent,
  ShoppingCart,
  Kanban,
  FileSpreadsheet,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Database,
  UserCheck,
  LayoutTemplate,
  Palette,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { UserRole } from '@/types/auth';

interface SubNavItem {
  title: string;
  href: string;
  icon?: LucideIcon | React.ComponentType<any>;
  badge?: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon | React.ComponentType<any>;
  badge?: string;
  children?: SubNavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}: {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, switchUserRole } = useAuth();
  const sidebar = useSidebar();

  // Determine if collapsed (prop overrides context if explicitly passed)
  const isMini = propIsCollapsed !== undefined ? propIsCollapsed : sidebar.isMiniSidebar;
  const handleToggleCollapse = propOnToggleCollapse || sidebar.toggleMiniSidebar;

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          title: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'CATALOGUE & TEMPLATES',
      items: [
        {
          title: 'Design Templates',
          href: '/admin/templates',
          icon: LayoutTemplate,
          badge: 'Master',
        },
        {
          title: 'Template Builder',
          href: '/admin/templates/builder',
          icon: Palette,
        },
        {
          title: 'Print Products',
          href: '/admin/catalogue/products',
          icon: Package,
        },
        {
          title: 'Categories',
          href: '/admin/catalogue/categories',
          icon: Layers,
        },
        {
          title: 'Warehouse Inventory',
          href: '/admin/inventory',
          icon: Database,
        },
      ],
    },
    {
      title: 'CUSTOMERS & SITES',
      items: [
        {
          title: 'Accounts',
          href: '/admin/customers/accounts',
          icon: Building2,
        },
      ],
    },
    {
      title: 'PRICING & CONTRACTS',
      items: [
        {
          title: 'Rate Cards',
          href: '/admin/pricing/rate-cards',
          icon: Percent,
        },
      ],
    },
    {
      title: 'ORDERS & LOGISTICS',
      items: [
        {
          title: 'All Orders',
          href: '/admin/orders/all',
          icon: ShoppingCart,
          badge: 'Live',
        },
        {
          title: 'Approvals Queue',
          href: '/admin/approvals',
          icon: UserCheck,
          badge: 'New',
        },
        {
          title: 'Fulfilment Queue',
          href: '/admin/orders/fulfilment',
          icon: Kanban,
        },
      ],
    },
    {
      title: 'REPORTING & COMPLIANCE',
      items: [
        {
          title: 'Monthly Billing',
          href: '/admin/reports/monthly-billing',
          icon: FileSpreadsheet,
        },
        {
          title: 'Audit Trail',
          href: '/admin/reports/audit-log',
          icon: History,
        },
      ],
    },
    {
      title: 'SYSTEM SETTINGS',
      items: [
        {
          title: 'Settings',
          href: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ];

  const handleRoleSwitch = (newRole: UserRole) => {
    switchUserRole(newRole);
    sidebar.closeMobileDrawer();
    if (newRole === 'site_user') {
      router.push('/shop/catalogue');
    } else if (newRole === 'head_office') {
      router.push('/head-office');
    } else {
      router.push('/admin/dashboard');
    }
  };

  // Common navigation content inside sidebar
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
            padding: isCollapsed ? '18px 12px' : '18px 20px',
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
            href="/admin/dashboard"
            onClick={() => sidebar.closeMobileDrawer()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'inherit',
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F73582 0%, #FF7B83 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(247, 53, 130, 0.4)',
                flexShrink: 0,
                transition: 'transform 0.2s ease',
              }}
            >
              <Sparkles size={19} color="#FFFFFF" />
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>TicketIT</span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      backgroundColor: '#F73582',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Admin
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                  Enterprise Platform HQ
                </div>
              </motion.div>
            )}
          </Link>

          {/* Drawer Close Button (Mobile) OR Mini-Sidebar Toggle Button (Desktop) */}
          {isDrawer ? (
            <button
              type="button"
              onClick={sidebar.closeMobileDrawer}
              aria-label="Close Sidebar Drawer"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                transition: 'background-color 0.15s ease',
              }}
            >
              <X size={18} />
            </button>
          ) : (
            !isCollapsed && (
              <button
                type="button"
                onClick={handleToggleCollapse}
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
                  transition: 'all 0.15s ease',
                }}
              >
                <PanelLeftClose size={15} />
              </button>
            )
          )}
        </div>

        {/* Navigation Links (Scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: isCollapsed ? '16px 8px' : '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: isCollapsed ? '14px' : '18px',
          }}
        >
          {sections.map((section, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              {!isCollapsed && (
                <div
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: '#94A3B8',
                    letterSpacing: '0.08em',
                    padding: '0 10px 6px 10px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {section.title}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {section.items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isChildActive = hasChildren
                    ? item.children!.some(
                        (child) => pathname === child.href || pathname.startsWith(child.href + '/')
                      )
                    : false;
                  const isDirectActive = item.href
                    ? pathname === item.href ||
                      pathname.startsWith(item.href + '/') ||
                      (item.href === '/admin/customers/accounts' && pathname.startsWith('/admin/customers')) ||
                      (item.href === '/admin/settings' &&
                        (pathname.startsWith('/admin/settings') || pathname.startsWith('/admin/integrations')))
                    : false;
                  const isItemActive = isDirectActive || isChildActive;
                  const isExpanded = openMenus[item.title] ?? isChildActive;
                  const IconComponent = item.icon;

                  const toggleMenu = (title: string) => {
                    setOpenMenus((prev) => ({
                      ...prev,
                      [title]: !(prev[title] ?? isChildActive),
                    }));
                  };

                  if (hasChildren && !isCollapsed) {
                    return (
                      <div key={item.title} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {/* Parent Menu Header */}
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.title)}
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '9px 12px',
                            width: '100%',
                            borderRadius: '10px',
                            color: isItemActive ? '#FFFFFF' : '#CBD5E1',
                            backgroundColor: isItemActive ? 'rgba(247, 53, 130, 0.15)' : 'transparent',
                            border: isItemActive
                              ? '1px solid rgba(247, 53, 130, 0.35)'
                              : '1px solid transparent',
                            fontSize: '0.86rem',
                            fontWeight: isItemActive ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 150ms ease',
                          }}
                        >
                          <IconComponent
                            size={18}
                            color={isItemActive ? '#F73582' : '#94A3B8'}
                            style={{ flexShrink: 0 }}
                          />
                          <span
                            style={{
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.title}
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <ChevronRight size={15} color={isItemActive ? '#F73582' : '#94A3B8'} />
                          </motion.div>
                        </button>

                        {/* Nested Sub-menu */}
                        {isExpanded && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              paddingLeft: '14px',
                              marginLeft: '18px',
                              borderLeft: '2px solid rgba(247, 53, 130, 0.25)',
                              marginTop: '2px',
                              marginBottom: '4px',
                            }}
                          >
                            {item.children!.map((child) => {
                              const isChildItemActive =
                                pathname === child.href || pathname.startsWith(child.href + '/');
                              const ChildIcon = child.icon;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => sidebar.closeMobileDrawer()}
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '7px 10px',
                                    borderRadius: '8px',
                                    color: isChildItemActive ? '#FFFFFF' : '#CBD5E1',
                                    backgroundColor: isChildItemActive
                                      ? 'rgba(247, 53, 130, 0.22)'
                                      : 'transparent',
                                    textDecoration: 'none',
                                    fontSize: '0.8rem',
                                    fontWeight: isChildItemActive ? 700 : 500,
                                    transition: 'all 150ms ease',
                                    border: isChildItemActive
                                      ? '1px solid rgba(247, 53, 130, 0.4)'
                                      : '1px solid transparent',
                                  }}
                                >
                                  {ChildIcon && (
                                    <ChildIcon
                                      size={15}
                                      color={isChildItemActive ? '#F73582' : '#94A3B8'}
                                      style={{ flexShrink: 0 }}
                                    />
                                  )}
                                  <span
                                    style={{
                                      flex: 1,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {child.title}
                                  </span>
                                  {child.badge && (
                                    <span
                                      style={{
                                        fontSize: '0.62rem',
                                        padding: '1px 5px',
                                        borderRadius: '9999px',
                                        backgroundColor: '#58B97D',
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                      }}
                                    >
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const targetHref = item.href || (item.children && item.children[0]?.href) || '#';

                  return (
                    <div
                      key={item.title}
                      style={{ position: 'relative' }}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Link
                        href={targetHref}
                        onClick={() => sidebar.closeMobileDrawer()}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: isCollapsed ? '10px 0' : '9px 12px',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                          borderRadius: '10px',
                          color: isItemActive ? '#FFFFFF' : '#CBD5E1',
                          backgroundColor: isItemActive ? 'rgba(247, 53, 130, 0.16)' : 'transparent',
                          textDecoration: 'none',
                          fontSize: '0.86rem',
                          fontWeight: isItemActive ? 700 : 500,
                          transition: 'all 150ms ease',
                          border: isItemActive
                            ? '1px solid rgba(247, 53, 130, 0.35)'
                            : '1px solid transparent',
                        }}
                      >
                        <IconComponent
                          size={18}
                          color={isItemActive ? '#F73582' : '#94A3B8'}
                          style={{ flexShrink: 0 }}
                        />

                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.title}
                          </motion.span>
                        )}

                        {!isCollapsed && item.badge && (
                          <span
                            style={{
                              fontSize: '0.62rem',
                              padding: '2px 6px',
                              borderRadius: '9999px',
                              backgroundColor: '#58B97D',
                              color: '#FFFFFF',
                              fontWeight: 700,
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {/* Mini-Sidebar Floating Tooltip on Hover */}
                      {isCollapsed && hoveredItem === item.title && (
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
                          <span>{item.title}</span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '0.6rem',
                                padding: '1px 5px',
                                borderRadius: '9999px',
                                backgroundColor: '#58B97D',
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
            </div>
          ))}
        </div>

        {/* Footer: Quick Role Switch & Environment Status */}
        <div
          style={{
            padding: isCollapsed ? '12px 8px' : '14px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          {isCollapsed ? (
            /* Mini Collapse Expand Trigger & Compact Status */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleToggleCollapse}
                title="Expand Sidebar"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <PanelLeftOpen size={16} />
              </button>

              <div
                title="Active Mock Service Layer"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#58B97D',
                  boxShadow: '0 0 8px #58B97D',
                }}
              />
            </div>
          ) : (
            /* Full Expanded Role Switcher & DB Badge */
            <>
              <div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    color: '#94A3B8',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Role Persona Switch</span>
                  <UserCheck size={13} color="#F73582" />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '3px',
                    borderRadius: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('admin')}
                    style={{
                      padding: '5px 2px',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: role === 'admin' ? 700 : 500,
                      backgroundColor: role === 'admin' ? '#059669' : 'transparent',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      transition: 'all 120ms ease',
                    }}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('head_office')}
                    style={{
                      padding: '5px 2px',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: role === 'head_office' ? 700 : 500,
                      backgroundColor: role === 'head_office' ? '#2563eb' : 'transparent',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      transition: 'all 120ms ease',
                    }}
                  >
                    Head Off.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('site_user')}
                    style={{
                      padding: '5px 2px',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: role === 'site_user' ? 700 : 500,
                      backgroundColor: role === 'site_user' ? '#f73582' : 'transparent',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      transition: 'all 120ms ease',
                    }}
                  >
                    Site User
                  </button>
                </div>
              </div>

              {/* Data source badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#94A3B8',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={13} color="#58B97D" />
                  <span>Mock Service Layer</span>
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    backgroundColor: 'rgba(88, 185, 125, 0.15)',
                    color: '#58B97D',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  ACTIVE
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP & TABLET SIDEBAR (VISIBLE ON SCREEN >= 768px) */}
      <aside
        className="admin-desktop-sidebar"
        style={{
          width: isMini ? '76px' : '272px',
          backgroundColor: '#2B253E',
          color: '#FFFFFF',
          minHeight: '100vh',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'width 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 40,
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. MOBILE SLIDE-OVER DRAWER (ACCESSIBLE ON SCREENS < 768px) */}
      <AnimatePresence>
        {sidebar.isMobileOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1200,
              display: 'flex',
            }}
          >
            {/* Frosted Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={sidebar.closeMobileDrawer}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.68)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'relative',
                width: '85vw',
                maxWidth: '310px',
                height: '100%',
                backgroundColor: '#2B253E',
                color: '#FFFFFF',
                boxShadow: '10px 0 40px rgba(0, 0, 0, 0.4)',
                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
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

      <style jsx global>{`
        @media (max-width: 767px) {
          .admin-desktop-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
