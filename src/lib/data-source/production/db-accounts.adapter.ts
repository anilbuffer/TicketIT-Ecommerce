// src/lib/data-source/production/db-accounts.adapter.ts
import prisma from '@/lib/db/prisma';
import type { Account, Site, PortalUser, PaginatedResult } from '@/lib/services/types';

export async function listAccounts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Account['status'];
}): Promise<PaginatedResult<Account>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (params?.status) where.status = params.status;
  if (params?.search) where.name = { contains: params.search, mode: 'insensitive' };

  const [items, total] = await Promise.all([
    prisma.account.findMany({ where, skip, take: pageSize }),
    prisma.account.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function getAccountById(id: string): Promise<Account | null> {
  return prisma.account.findUnique({ where: { id } });
}

export async function createAccount(input: Omit<Account, 'id'>): Promise<Account> {
  return prisma.account.create({ data: input });
}

export async function listSites(params?: {
  accountId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<Site>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (params?.accountId) where.accountId = params.accountId;

  const [items, total] = await Promise.all([
    prisma.site.findMany({ where, skip, take: pageSize }),
    prisma.site.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function getSiteById(id: string): Promise<Site | null> {
  return prisma.site.findUnique({ where: { id } });
}

export async function createSite(input: Omit<Site, 'id'>): Promise<Site> {
  return prisma.site.create({ data: input as any });
}

export async function listUsers(params?: {
  role?: PortalUser['role'];
  siteId?: string;
  accountId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<PortalUser>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (params?.role) where.role = params.role;

  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: pageSize }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createUser(input: Omit<PortalUser, 'id' | 'createdAt'>): Promise<PortalUser> {
  return prisma.user.create({ data: input as any });
}

export async function getOrderRules(accountId: string) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  return {
    accountId,
    accountName: account?.name || 'Customer Account',
    requirePoNumber: true,
    poPrefix: 'PO-APX',
    allowCustomDeliveryAddress: true,
    monthlyBudgetCap: 25000,
    requireDeliveryNotes: false,
    defaultCarrier: 'Rahhawan Direct Logistics',
  };
}

export async function getSiteAddresses(siteId: string) {
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) return null;
  return {
    siteId: site.id,
    siteName: site.name,
    siteCode: site.code,
    billToAddress: site.billToAddress as any,
    shipToAddress: site.shipToAddress as any,
  };
}

