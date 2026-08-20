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
  | 'view_audit_trail'
  | 'update_order_status';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  organization: string;
  accountId?: string;
  accountName?: string;
  siteId?: string;
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
    buttonColor: string;
    buttonText: string;
  }
> = {
  admin: {
    title: 'Admin',
    subtitle: 'Full Operations HQ',
    description: 'Central platform administration, carrying the full operational workload to see and action every order in full detail and update statuses.',
    defaultRedirect: '/admin',
    themeColor: '#059669',
    buttonColor: '#059669',
    buttonText: 'Enter Admin Portal',
    badgeText: 'Admin • Operations HQ',
  },
  head_office: {
    title: 'Head Office',
    subtitle: 'Consolidated Billing',
    description: 'Inheriting a read-only status view across all sites, feeding the monthly consolidated billing report and transaction-level spreadsheet backing.',
    defaultRedirect: '/head-office',
    themeColor: '#2563eb',
    buttonColor: '#2563eb',
    buttonText: 'Enter Head Office Portal',
    badgeText: 'Head Office • All Sites',
  },
  site_user: {
    title: 'Site User',
    subtitle: 'Branch Asset Orders',
    description: 'Self-service marketing asset library and checkout with a read-only status view strictly limited to their own branch orders.',
    defaultRedirect: '/shop/catalogue',
    themeColor: '#f73582',
    buttonColor: '#f73582',
    buttonText: 'Enter Shop / Ordering Hub',
    badgeText: 'Site User • Branch Ordering',
  },
};

export const DEMO_USERS: Record<UserRole, DemoUserCredential> = {
  admin: {
    email: 'sarah.jenkins@ticketit.com',
    role: 'admin',
    roleTitle: 'Admin',
    roleSubtitle: 'Full Operations HQ',
    defaultPassword: 'password123',
    user: {
      id: 'usr_admin_999',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@ticketit.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      title: 'Head of Brand Operations & Fulfilment',
      organization: 'TicketIT Platform HQ',
      siteCode: 'TICKETIT-HQ-GLOBAL',
      siteName: 'TicketIT Central Operations (HQ)',
      department: 'Central Fulfillment & DAM Operations',
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
        'update_order_status',
      ],
    },
  },
  head_office: {
    email: 'elena.rostova@retailgroup.hq',
    role: 'head_office',
    roleTitle: 'Head Office',
    roleSubtitle: 'Consolidated Billing',
    defaultPassword: 'password123',
    user: {
      id: 'usr_headoffice_001',
      name: 'Elena Rostova',
      email: 'elena.rostova@retailgroup.hq',
      role: 'head_office',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Group Brand Director & Multi-Site Financial Controller',
      organization: 'Apex Healthcare Group',
      accountId: 'acc-001',
      accountName: 'Apex Healthcare Group',
      siteCode: 'APEX-HQ-GLOBAL',
      siteName: 'Apex Corporate Head Office (4 Sites)',
      department: 'Multi-Site Marketing Oversight & Billing Consolidation',
      poPrefix: 'PO-APEX-HQ',
      permissions: [
        'browse_dam',
        'view_site_orders',
        'view_all_sites',
        'view_consolidated_billing',
        'export_billing_reports',
      ],
    },
  },
  site_user: {
    email: 'marcus.vance@apexhealth.org',
    role: 'site_user',
    roleTitle: 'Site User',
    roleSubtitle: 'Branch Asset Orders',
    defaultPassword: 'password123',
    user: {
      id: 'usr_site_101',
      name: 'Marcus Vance',
      email: 'marcus.vance@apexhealth.org',
      role: 'site_user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Pharmacy Operations Lead & Visual Merchandising',
      organization: 'Apex Healthcare Group',
      accountId: 'acc-001',
      accountName: 'Apex Healthcare Group',
      siteId: 'site-101',
      siteCode: 'APX-MID-101',
      siteName: 'Apex Midtown Central Pharmacy',
      department: 'Dispensary Operations & Marketing Collateral',
      poPrefix: 'PO-APX-MID',
      monthlyBudgetCap: 8500,
      permissions: ['browse_dam', 'order_collateral', 'view_site_orders'],
    },
  },
};
