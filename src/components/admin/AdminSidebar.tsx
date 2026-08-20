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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon | React.ComponentType<any>;
  badge?: string;
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
      title: 'CATALOGUE & DAM',
      items: [
        {
          title: 'Products',
          href: '/admin/catalogue/products',
          icon: Package,
        },
        {
          title: 'Categories',
          href: '/admin/catalogue/categories',
          icon: Layers,
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
        {
          title: 'Site Branches',
          href: '/admin/customers/sites',
          icon: MapPin,
        },
        {
          title: 'User Management',
          href: '/admin/customers/users',
          icon: Users,
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
          title: 'General Config',
          href: '/admin/settings/general',
          icon: Settings,
        },
        {
          title: 'Roles & RBAC',
          href: '/admin/settings/roles-permissions',
          icon: Shield,
        },
        {
          title: 'PO Validation Rules',
          href: '/admin/settings/required-fields',
          icon: CheckSquare,
        },
      ],
    },
  ];

  const handleRoleSwitch = (newRole: UserRole) => {
    switchUserRole(newRole);
    if (newRole === 'site_user') {
      router.push('/portal/site-user');
    } else if (newRole === 'head_office') {
      router.push('/portal/head-office');
    } else {
      router.push('/admin/dashboard');
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
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.title : undefined}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '10px 0' : '9px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: '10px',
                      color: isActive ? '#FFFFFF' : '#CBD5E1',
                      backgroundColor: isActive ? 'rgba(247, 53, 130, 0.15)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 150ms ease',
                      border: isActive ? '1px solid rgba(247, 53, 130, 0.35)' : '1px solid transparent',
                    }}
                  >
                    <IconComponent
                      size={18}
                      color={isActive ? '#F73582' : '#94A3B8'}
                      style={{ flexShrink: 0 }}
                    />
                    {!isCollapsed && (
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                onClick={() => handleRoleSwitch('site_user')}
                style={{
                  padding: '5px 2px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: role === 'site_user' ? 700 : 500,
                  backgroundColor: role === 'site_user' ? '#2563eb' : 'transparent',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  transition: 'all 120ms ease',
                }}
              >
                Pharmacy
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('head_office')}
                style={{
                  padding: '5px 2px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: role === 'head_office' ? 700 : 500,
                  backgroundColor: role === 'head_office' ? '#f59e0b' : 'transparent',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  transition: 'all 120ms ease',
                }}
              >
                Driver
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
