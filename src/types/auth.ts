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
  admin: {
    title: 'Super Admin',
    subtitle: 'Platform HQ',
    description: 'Central platform administration, inventory catalog control, hub management, and HIPAA compliance audit logs.',
    defaultRedirect: '/portal/admin',
    themeColor: '#ef4444',
    badgeText: 'Super Admin • Platform HQ',
  },
  site_user: {
    title: 'Pharmacy',
    subtitle: 'Dispensing Hub',
    description: 'Dispensing management, inventory ordering, medication PO verification, and real-time courier request tracking.',
    defaultRedirect: '/portal/site-user',
    themeColor: '#f59e0b',
    badgeText: 'Pharmacy • Dispensing Hub',
  },
  head_office: {
    title: 'Driver',
    subtitle: 'Courier Portal',
    description: 'Active courier delivery routes, digital proof of delivery, dispatch logs, and consolidated transport billing.',
    defaultRedirect: '/portal/head-office',
    themeColor: '#10b981',
    badgeText: 'Driver • Courier Portal',
  },
};

export const DEMO_USERS: Record<UserRole, DemoUserCredential> = {
  admin: {
    email: 'admin@rahhawan.io',
    role: 'admin',
    roleTitle: 'Super Admin',
    roleSubtitle: 'Platform HQ',
    defaultPassword: 'password123',
    user: {
      id: 'usr_admin_999',
      name: 'Dr. Sarah Sterling',
      email: 'admin@rahhawan.io',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Chief Operations & Platform Officer',
      organization: 'Rahhawan Platform HQ',
      siteCode: 'RAHHAWAN-HQ-GLOBAL',
      siteName: 'Platform Central Operations (HQ)',
      department: 'System Architecture & HIPAA Compliance',
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
  site_user: {
    email: 'pharmacy@rahhawan.io',
    role: 'site_user',
    roleTitle: 'Pharmacy',
    roleSubtitle: 'Dispensing Hub',
    defaultPassword: 'password123',
    user: {
      id: 'usr_site_104',
      name: 'Marcus Vance, PharmD',
      email: 'pharmacy@rahhawan.io',
      role: 'site_user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Head Pharmacist & Dispensing Manager',
      organization: 'Metro Central Pharmacy #104',
      siteCode: 'PHARM-NYC-104',
      siteName: 'Downtown Dispensing Hub #104',
      department: 'Pharmacy Operations & Logistics',
      poPrefix: 'RX-APX104',
      monthlyBudgetCap: 15000,
      permissions: ['browse_dam', 'order_collateral', 'view_site_orders'],
    },
  },
  head_office: {
    email: 'driver@rahhawan.io',
    role: 'head_office',
    roleTitle: 'Driver',
    roleSubtitle: 'Courier Portal',
    defaultPassword: 'password123',
    user: {
      id: 'usr_driver_001',
      name: 'Elena Rostova',
      email: 'driver@rahhawan.io',
      role: 'head_office',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Dispatch & Logistics Driver',
      organization: 'Rahhawan Courier Fleet',
      siteCode: 'FLEET-DISPATCH-EAST',
      siteName: 'Courier Fleet Hub (Regional East)',
      department: 'Cold-Chain Delivery & Fleet Routing',
      poPrefix: 'PO-FLEET-EXP',
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
};
