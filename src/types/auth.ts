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
    title: 'Super Admin',
    subtitle: 'Platform HQ',
    description: 'Central platform administration, carrying the full operational workload to see and action every order in full detail and update statuses.',
    defaultRedirect: '/admin/dashboard',
    themeColor: '#059669',
    buttonColor: '#059669',
    buttonText: 'Enter Super Admin Portal',
    badgeText: 'Super Admin • Platform HQ',
  },
  site_user: {
    title: 'Pharmacy',
    subtitle: 'Dispensing Hub',
    description: 'Dispensing management with a read-only status view strictly limited to their own branch orders and purchase order submission.',
    defaultRedirect: '/portal/site-user',
    themeColor: '#2563eb',
    buttonColor: '#3b82f6',
    buttonText: 'Enter Pharmacy Portal',
    badgeText: 'Pharmacy • Dispensing Hub',
  },
  head_office: {
    title: 'Driver',
    subtitle: 'Courier Portal',
    description: 'Inheriting a read-only status view across all 34 sites, dispatch logs, and consolidated monthly billing reports.',
    defaultRedirect: '/portal/head-office',
    themeColor: '#f59e0b',
    buttonColor: '#f59e0b',
    buttonText: 'Enter Driver Portal',
    badgeText: 'Driver • Courier Portal',
  },
};

export const DEMO_USERS: Record<UserRole, DemoUserCredential> = {
  admin: {
    email: 'sarah.jenkins@rahhawan.com',
    role: 'admin',
    roleTitle: 'Super Admin',
    roleSubtitle: 'Platform HQ',
    defaultPassword: 'password123',
    user: {
      id: 'usr_admin_999',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@rahhawan.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      title: 'Chief Operations & Platform Officer',
      organization: 'Rahhawan Platform HQ',
      siteCode: 'RAHHAWAN-HQ-GLOBAL',
      siteName: 'Platform Central Operations (HQ)',
      department: 'Central Fulfillment & Operations HQ',
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
  site_user: {
    email: 'dr.chen@northgate-infusion.com',
    role: 'site_user',
    roleTitle: 'Pharmacy',
    roleSubtitle: 'Dispensing Hub',
    defaultPassword: 'password123',
    user: {
      id: 'usr_site_104',
      name: 'Dr. Chen, PharmD',
      email: 'dr.chen@northgate-infusion.com',
      role: 'site_user',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      title: 'Head Pharmacist & Dispensing Lead',
      organization: 'Northgate Infusion Center #104',
      siteCode: 'PHARM-NYC-104',
      siteName: 'Northgate Infusion Suite #104',
      department: 'Pharmacy Dispensing & Local Orders',
      poPrefix: 'RX-APX104',
      monthlyBudgetCap: 15000,
      permissions: ['browse_dam', 'order_collateral', 'view_site_orders'],
    },
  },
  head_office: {
    email: 'marcus.vance@rahhawan.com',
    role: 'head_office',
    roleTitle: 'Driver',
    roleSubtitle: 'Courier Portal',
    defaultPassword: 'password123',
    user: {
      id: 'usr_driver_001',
      name: 'Marcus Vance',
      email: 'marcus.vance@rahhawan.com',
      role: 'head_office',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Regional Fleet Dispatch & Multi-Site Logistics Lead',
      organization: 'Rahhawan Courier Fleet',
      siteCode: 'FLEET-DISPATCH-EAST',
      siteName: 'Courier Fleet Hub (Regional East)',
      department: 'Multi-Site Oversight & Consolidated Billing',
      poPrefix: 'PO-FLEET-EXP',
      permissions: [
        'browse_dam',
        'view_site_orders',
        'view_all_sites',
        'view_consolidated_billing',
        'export_billing_reports',
      ],
    },
  },
};

