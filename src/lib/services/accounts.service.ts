// src/lib/services/accounts.service.ts
import { getDataSource } from '@/lib/data-source';
import type { Account, Site, PortalUser, PaginatedResult } from './types';

export async function getAccounts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Account['status'];
}): Promise<PaginatedResult<Account>> {
  const ds = getDataSource();
  return ds.accounts.listAccounts(params);
}

export async function getAccountById(id: string): Promise<Account | null> {
  const ds = getDataSource();
  return ds.accounts.getAccountById(id);
}

export async function createAccount(input: Omit<Account, 'id'>): Promise<Account> {
  const ds = getDataSource();
  const created = await ds.accounts.createAccount(input);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'ACCOUNT_CREATED',
      entityType: 'ACCOUNT',
      entityId: created.id,
      entityName: created.name,
      details: { accountCode: created.accountCode },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return created;
}

export async function getSites(params?: {
  accountId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<Site>> {
  const ds = getDataSource();
  return ds.accounts.listSites(params);
}

export async function getSiteById(id: string): Promise<Site | null> {
  const ds = getDataSource();
  return ds.accounts.getSiteById(id);
}

export async function createSite(input: Omit<Site, 'id'>): Promise<Site> {
  const ds = getDataSource();
  const created = await ds.accounts.createSite(input);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'SITE_CREATED',
      entityType: 'SITE',
      entityId: created.id,
      entityName: created.name,
      details: { code: created.code, accountId: created.accountId },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return created;
}

export async function getUsers(params?: {
  role?: PortalUser['role'];
  siteId?: string;
  accountId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<PortalUser>> {
  const ds = getDataSource();
  return ds.accounts.listUsers(params);
}

export async function createUser(input: Omit<PortalUser, 'id' | 'createdAt'>): Promise<PortalUser> {
  const ds = getDataSource();
  const created = await ds.accounts.createUser(input);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: created.id,
      entityName: created.name,
      details: { email: created.email, role: created.role },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return created;
}

export async function getAccountOrderRules(accountId: string) {
  const ds = getDataSource();
  if ('getOrderRules' in ds.accounts) {
    return (ds.accounts as any).getOrderRules(accountId);
  }
  return {
    accountId,
    accountName: 'Customer Account',
    requirePoNumber: false,
    poPrefix: 'PO',
    allowCustomDeliveryAddress: true,
    monthlyBudgetCap: 10000,
    requireDeliveryNotes: false,
    defaultCarrier: 'Standard Delivery',
  };
}

export async function getSiteAddresses(siteId: string) {
  const ds = getDataSource();
  if ('getSiteAddresses' in ds.accounts) {
    return (ds.accounts as any).getSiteAddresses(siteId);
  }
  const site = await ds.accounts.getSiteById(siteId);
  if (!site) return null;
  return {
    siteId: site.id,
    siteName: site.name,
    siteCode: site.code,
    billToAddress: site.billToAddress,
    shipToAddress: site.shipToAddress,
  };
}

