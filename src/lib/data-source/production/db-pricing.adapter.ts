// src/lib/data-source/production/db-pricing.adapter.ts
import prisma from '@/lib/db/prisma';
import type { RateCard, RateCardItem, PaginatedResult } from '@/lib/services/types';

export async function list(params?: {
  accountId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<RateCard>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  if (params?.accountId) where.accountId = params.accountId;

  const [items, total] = await Promise.all([
    prisma.rateCard.findMany({ where, skip, take: pageSize, include: { items: true, account: true } }),
    prisma.rateCard.count({ where }),
  ]);

  return { items: items as any, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function getById(id: string): Promise<RateCard | null> {
  return prisma.rateCard.findUnique({ where: { id }, include: { items: true, account: true } }) as any;
}

export async function getByAccountId(accountId: string): Promise<RateCard | null> {
  return prisma.rateCard.findFirst({ where: { accountId }, include: { items: true } }) as any;
}

export async function create(input: Omit<RateCard, 'id' | 'itemCount'>): Promise<RateCard> {
  return prisma.rateCard.create({
    data: {
      accountId: input.accountId,
      name: input.name,
      effectiveFrom: new Date(input.effectiveFrom),
      discountPct: input.defaultDiscountPct,
    },
    include: { items: true },
  }) as any;
}

export async function update(id: string, input: Partial<RateCard>): Promise<RateCard> {
  return prisma.rateCard.update({
    where: { id },
    data: {
      name: input.name,
      discountPct: input.defaultDiscountPct,
    },
    include: { items: true },
  }) as any;
}

export async function calculateItemPrice(
  productId: string,
  basePrice: number,
  accountId?: string
): Promise<{ effectivePrice: number; discountPct: number; rateCardName?: string }> {
  if (!accountId) return { effectivePrice: basePrice, discountPct: 0 };
  return { effectivePrice: basePrice, discountPct: 0 };
}
