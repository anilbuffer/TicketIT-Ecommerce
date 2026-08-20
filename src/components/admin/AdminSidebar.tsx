// src/components/admin/AdminSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LucideIcon,
  LayoutDashboard,
  Package,
  Layers,
  Building2,
  MapPin,
  Users,
  Percent,
  ShoppingCart,
  Kanban,
  FileSpreadsheet,
  History,
  Settings,
  Shield,
  CheckSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  UserCheck,
  LayoutTemplate,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
  isCollapsed = false,
  onToggleCollapse,
}: {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchUserRole } = useAuth();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

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
    if (newRole === 'site_user') {
      router.push('/shop/catalogue');
    } else if (newRole === 'head_office') {
      router.push('/head-office');
    } else {
      router.push('/admin');
    }
  };

  return (
    <aside
      style={{
        width: isCollapsed ? '78px' : '272px',
        backgroundColor: '#2B253E',
        color: '#FFFFFF',
        minHeight: '100vh',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '20px 14px' : '20px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Link
          href="/admin/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F73582 0%, #FF7B83 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(247, 53, 130, 0.4)',
              flexShrink: 0,
            }}
          >
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          {!isCollapsed && (
            <div>
              <div
                style={{
                  fontSize: '1.15rem',
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
                    fontSize: '0.65rem',
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
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
                Enterprise Platform HQ
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '16px 8px' : '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {sections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                  padding: '0 10px 6px 10px',
                  textTransform: 'uppercase',
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
                    (item.href === '/admin/settings' && (pathname.startsWith('/admin/settings') || pathname.startsWith('/admin/integrations')))
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
                          fontSize: '0.88rem',
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
                                  fontSize: '0.82rem',
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
                  <Link
                    key={item.title}
                    href={targetHref}
                    title={isCollapsed ? item.title : undefined}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '10px 0' : '9px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: '10px',
                      color: isItemActive ? '#FFFFFF' : '#CBD5E1',
                      backgroundColor: isItemActive ? 'rgba(247, 53, 130, 0.15)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
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
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        style={{
                          fontSize: '0.65rem',
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
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Role Switcher & Environment Bar */}
      <div
        style={{
          padding: isCollapsed ? '12px 8px' : '14px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {!isCollapsed && (
          <div>
            <div
              style={{
                fontSize: '0.68rem',
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
              <span>Quick Role Switch</span>
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
                  fontSize: '0.7rem',
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
                  fontSize: '0.7rem',
                  fontWeight: role === 'head_office' ? 700 : 500,
                  backgroundColor: role === 'head_office' ? '#2563eb' : 'transparent',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  transition: 'all 120ms ease',
                }}
              >
                Head Office
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('site_user')}
                style={{
                  padding: '5px 2px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
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
        )}

        {/* Data source badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            fontSize: '0.72rem',
            color: '#94A3B8',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} color="#58B97D" />
            {!isCollapsed && <span>Mock Service Layer</span>}
          </div>
          {!isCollapsed && (
            <span
              style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(88, 185, 125, 0.15)',
                color: '#58B97D',
                padding: '1px 5px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              ACTIVE
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
