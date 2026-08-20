export type UserRole = 'site_user' | 'head_office' | 'admin';

export type Permission =
  | 'browse_dam'
  | 'order_collateral'
  | 'view_site_orders'
  | 'view_all_sites'
  | 'view_consolidated_billing'
  | 'export_billing_reports'
  | 'manage_catalogue'
  | 'manage_sites'
  | 'view_audit_trail';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  organization: string;
  siteCode?: string;
  siteName?: string;
  department: string;
  poPrefix?: string;
  monthlyBudgetCap?: number;
  permissions: Permission[];
}

export interface DemoUserCredential {
  email: string;
  role: UserRole;
  roleTitle: string;
  roleSubtitle: string;
  defaultPassword: string;
  user: User;
}

export const ROLE_DETAILS: Record<
  UserRole,
  {
    title: string;
    subtitle: string;
    description: string;
    defaultRedirect: string;
    themeColor: string;
    badgeText: string;
  }
> = {
  site_user: {
    title: 'Customer / Site User',
    subtitle: 'Store & Branch Portal',
    description: 'Browse approved marketing assets, place collateral orders with PO capture, and track branch delivery.',
    defaultRedirect: '/portal/site-user',
    themeColor: '#58b97d',
    badgeText: 'Role 01 • Site User',
  },
  head_office: {
    title: 'Customer Head Office',
    subtitle: 'Consolidated Billing Hub',
    description: 'Multi-site visibility, branch spend analytics, monthly consolidated billing statements & CSV exports.',
    defaultRedirect: '/portal/head-office',
    themeColor: '#7c5cdb',
    badgeText: 'Role 02 • Head Office',
  },
  admin: {
    title: 'Portal Administrator',
    subtitle: 'Platform HQ & DAM Control',
    description: 'Central DAM library maintenance, customer site registry, catalogue approvals, and enterprise audit trail.',
    defaultRedirect: '/portal/admin',
    themeColor: '#f73582',
    badgeText: 'Role 03 • Super Admin',
  },
};

export const DEMO_USERS: Record<UserRole, DemoUserCredential> = {
  site_user: {
    email: 'marcus.vance@apexretail.com',
    role: 'site_user',
    roleTitle: 'Customer / Site User',
    roleSubtitle: 'Store Branch #104',
    defaultPassword: 'password123',
    user: {
      id: 'usr_site_104',
      name: 'Marcus Vance',
      email: 'marcus.vance@apexretail.com',
      role: 'site_user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Store General Manager',
      organization: 'Apex Retail Group',
      siteCode: 'APEX-NYC-104',
      siteName: 'Downtown Flagship #104 (5th Ave, NY)',
      department: 'Retail Operations & Visual Merchandising',
      poPrefix: 'PO-APX104',
      monthlyBudgetCap: 8500,
      permissions: ['browse_dam', 'order_collateral', 'view_site_orders'],
    },
  },
  head_office: {
    email: 'elena.rostova@apexgroup.hq',
    role: 'head_office',
    roleTitle: 'Customer Head Office',
    roleSubtitle: 'Apex Corporate HQ',
    defaultPassword: 'password123',
    user: {
      id: 'usr_ho_001',
      name: 'Elena Rostova',
      email: 'elena.rostova@apexgroup.hq',
      role: 'head_office',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      title: 'VP of Marketing & Finance',
      organization: 'Apex Retail Group HQ',
      siteCode: 'APEX-HQ-GLOBAL',
      siteName: 'Apex Corporate HQ (All 34 Retail Sites)',
      department: 'Marketing Procurement & Financial Control',
      poPrefix: 'PO-HQ-CORP',
      permissions: [
        'browse_dam',
        'order_collateral',
        'view_site_orders',
        'view_all_sites',
        'view_consolidated_billing',
        'export_billing_reports',
      ],
    },
  },
  admin: {
    email: 'david.sterling@yellowdelivery.io',
    role: 'admin',
    roleTitle: 'Portal Administrator',
    roleSubtitle: 'Central Delivery HQ',
    defaultPassword: 'password123',
    user: {
      id: 'usr_admin_999',
      name: 'David Sterling',
      email: 'david.sterling@yellowdelivery.io',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Chief Portal & DAM Architect',
      organization: 'Yellow Marketing Delivery Platform',
      siteCode: 'SYS-GLOBAL-ADMIN',
      siteName: 'Platform Central Administration',
      department: 'System Architecture & DAM Governance',
      permissions: [
        'browse_dam',
        'order_collateral',
        'view_site_orders',
        'view_all_sites',
        'view_consolidated_billing',
        'export_billing_reports',
        'manage_catalogue',
        'manage_sites',
        'view_audit_trail',
      ],
    },
  },
};
