// src/lib/data-source/production/db-orders.adapter.ts
import prisma from '@/lib/db/prisma';
import type { Order, OrderStatus, PaginatedResult } from '@/lib/services/types';

export async function list(params?: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | 'ALL';
  siteId?: string;
  accountId?: string;
  search?: string;
}): Promise<PaginatedResult<Order>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;
  const where: any = {};

  if (params?.status && params.status !== 'ALL') where.status = params.status;
  if (params?.siteId) where.siteId = params.siteId;
  if (params?.accountId) where.accountId = params.accountId;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      include: { lineItems: true, site: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { items: items as any, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function getById(id: string): Promise<Order | null> {
  return prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: { lineItems: true, site: true },
  }) as any;
}

export async function create(
  input: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'itemCount'>
): Promise<Order> {
  const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalAmount = input.lineItems.reduce((sum, i) => sum + i.lineTotal, 0);

  return prisma.order.create({
    data: {
      orderNumber,
      accountId: input.accountId,
      siteId: input.siteId,
      userId: input.userId,
      poReference: input.poReference,
      status: input.status || 'RECEIVED',
      totalAmount,
      lineItems: {
        create: input.lineItems.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          qty: item.qty,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      },
    },
    include: { lineItems: true },
  }) as any;
}

export async function updateStatus(
  id: string,
  newStatus: OrderStatus,
  metadata?: { carrier?: string; trackingNumber?: string; deliveryNotes?: string }
): Promise<Order> {
  return prisma.order.update({
    where: { id },
    data: {
      status: newStatus,
      ...metadata,
    },
    include: { lineItems: true },
  }) as any;
}

export async function updateDetails(
  id: string,
  details: Partial<Omit<Order, 'id' | 'orderNumber' | 'lineItems'>>
): Promise<Order> {
  return prisma.order.update({
    where: { id },
    data: details,
    include: { lineItems: true },
  }) as any;
}

export async function approveOrder(
  id: string,
  approverName: string,
  notes?: string
): Promise<Order> {
  const now = new Date().toISOString();
  return prisma.order.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedBy: approverName,
      approvedAt: now,
      approvalNotes: notes || 'Approved by Head Office Controller',
      updatedAt: now,
    } as any,
    include: { lineItems: true },
  }) as any;
}

export async function requestChanges(
  id: string,
  approverName: string,
  notes: string
): Promise<Order> {
  const now = new Date().toISOString();
  return prisma.order.update({
    where: { id },
    data: {
      status: 'CHANGES_REQUESTED',
      changesRequestedNotes: notes,
      updatedAt: now,
    } as any,
    include: { lineItems: true },
  }) as any;
}

export async function payOrder(
  id: string,
  paymentMethod: Order['paymentMethod'] = 'CORPORATE_INVOICE',
  paymentRef?: string,
  paidBy: string = 'Elena Rostova (Head Office)'
): Promise<Order> {
  const now = new Date().toISOString();
  const ref = paymentRef || `CORP-TXN-${Date.now().toString().slice(-6)}`;
  return prisma.order.update({
    where: { id },
    data: {
      status: 'IN_PRODUCTION',
      paymentStatus: 'PAID',
      paymentMethod,
      paymentReference: ref,
      paidBy,
      paidAt: now,
      updatedAt: now,
    } as any,
    include: { lineItems: true },
  }) as any;
}

export async function rejectOrder(
  id: string,
  approverName: string,
  reason: string
): Promise<Order> {
  const now = new Date().toISOString();
  return prisma.order.update({
    where: { id },
    data: {
      status: 'REJECTED',
      approvedBy: approverName,
      approvedAt: now,
      rejectedReason: reason || 'Budget allocation cap exceeded for this site',
      updatedAt: now,
    } as any,
    include: { lineItems: true },
  }) as any;
}


