// src/lib/auth/rbac.ts
import type { UserRole } from '@/lib/services/types';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'MANAGE_CATALOGUE'
  | 'VIEW_CATALOGUE'
  | 'MANAGE_ACCOUNTS'
  | 'VIEW_ACCOUNTS'
  | 'MANAGE_RATE_CARDS'
  | 'VIEW_RATE_CARDS'
  | 'MANAGE_ALL_ORDERS'
  | 'UPDATE_ORDER_STATUS'
  | 'VIEW_SITE_ORDERS'
  | 'PLACE_ORDER'
  | 'VIEW_CONSOLIDATED_BILLING'
  | 'EXPORT_REPORTS'
  | 'VIEW_AUDIT_TRAIL'
  | 'MANAGE_SETTINGS';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'VIEW_DASHBOARD',
    'MANAGE_CATALOGUE',
    'VIEW_CATALOGUE',
    'MANAGE_ACCOUNTS',
    'VIEW_ACCOUNTS',
    'MANAGE_RATE_CARDS',
    'VIEW_RATE_CARDS',
    'MANAGE_ALL_ORDERS',
    'UPDATE_ORDER_STATUS',
    'VIEW_SITE_ORDERS',
    'PLACE_ORDER',
    'VIEW_CONSOLIDATED_BILLING',
    'EXPORT_REPORTS',
    'VIEW_AUDIT_TRAIL',
    'MANAGE_SETTINGS',
  ],
  HEAD_OFFICE: [
    'VIEW_DASHBOARD',
    'VIEW_CATALOGUE',
    'VIEW_ACCOUNTS',
    'VIEW_RATE_CARDS',
    'VIEW_SITE_ORDERS',
    'VIEW_CONSOLIDATED_BILLING',
    'EXPORT_REPORTS',
  ],
  SITE_USER: [
    'VIEW_CATALOGUE',
    'PLACE_ORDER',
    'VIEW_SITE_ORDERS',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function canManageOrder(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function canViewAllSites(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'HEAD_OFFICE';
}
