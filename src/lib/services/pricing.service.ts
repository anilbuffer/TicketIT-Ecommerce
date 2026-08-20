// src/lib/services/pricing.service.ts
import { getDataSource } from '@/lib/data-source';
import type { RateCard, PaginatedResult } from './types';

export async function getRateCards(params?: {
  accountId?: string;
  search?: string;
  status?: RateCard['status'];
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<RateCard>> {
  const ds = getDataSource();
  return ds.pricing.list(params);
}

export async function getRateCardById(id: string): Promise<RateCard | null> {
  const ds = getDataSource();
  return ds.pricing.getById(id);
}

export async function getRateCardByAccountId(accountId: string): Promise<RateCard | null> {
  const ds = getDataSource();
  return ds.pricing.getByAccountId(accountId);
}

export async function createRateCard(input: Omit<RateCard, 'id' | 'itemCount'>): Promise<RateCard> {
  const ds = getDataSource();
  const created = await ds.pricing.create(input);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'RATE_CARD_CREATED',
      entityType: 'RATE_CARD',
      entityId: created.id,
      entityName: created.name,
      details: { accountId: created.accountId, defaultDiscountPct: created.defaultDiscountPct },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return created;
}

export async function updateRateCard(id: string, input: Partial<RateCard>): Promise<RateCard> {
  const ds = getDataSource();
  const updated = await ds.pricing.update(id, input);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'RATE_CARD_UPDATED',
      entityType: 'RATE_CARD',
      entityId: id,
      entityName: updated.name,
      details: { defaultDiscountPct: updated.defaultDiscountPct },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function calculateItemPrice(
  productId: string,
  basePrice: number,
  accountId?: string
): Promise<{ effectivePrice: number; discountPct: number; rateCardName?: string }> {
  const ds = getDataSource();
  return ds.pricing.calculateItemPrice(productId, basePrice, accountId);
}
