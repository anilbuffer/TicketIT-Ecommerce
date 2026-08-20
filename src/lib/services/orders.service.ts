// src/lib/services/orders.service.ts
import { getDataSource } from '@/lib/data-source';
import type { Order, OrderStatus, PaginatedResult } from './types';

export async function getOrders(params?: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | 'ALL';
  siteId?: string;
  accountId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedResult<Order>> {
  const ds = getDataSource();
  return ds.orders.list(params);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const ds = getDataSource();
  return ds.orders.getById(id);
}

export async function createOrder(
  input: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'itemCount'>
): Promise<Order> {
  const ds = getDataSource();
  const created = await ds.orders.create(input);

  try {
    await ds.audit.log({
      actorId: input.userId || 'usr_site_user',
      actorName: input.userName || 'Site User',
      actorEmail: input.userEmail || 'user@rahhawan.io',
      actorRole: 'SITE_USER',
      action: 'ORDER_CREATED',
      entityType: 'ORDER',
      entityId: created.id,
      entityName: created.orderNumber,
      details: {
        itemCount: created.itemCount,
        totalAmount: created.totalAmount,
        poReference: created.poReference,
        siteCode: created.siteCode,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return created;
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  metadata?: { carrier?: string; trackingNumber?: string; deliveryNotes?: string }
): Promise<Order> {
  const ds = getDataSource();
  const current = await ds.orders.getById(id);
  const updated = await ds.orders.updateStatus(id, newStatus, metadata);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: `ORDER_STATUS_${newStatus}`,
      entityType: 'ORDER',
      entityId: updated.id,
      entityName: updated.orderNumber,
      details: {
        previousStatus: current?.status,
        newStatus,
        carrier: metadata?.carrier,
        trackingNumber: metadata?.trackingNumber,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function updateOrderDetails(
  id: string,
  details: Partial<Omit<Order, 'id' | 'orderNumber' | 'lineItems'>>
): Promise<Order> {
  const ds = getDataSource();
  return ds.orders.updateDetails(id, details);
}

export async function getFulfilmentQueue(): Promise<{
  received: Order[];
  processing: Order[];
  dispatched: Order[];
  delivered: Order[];
}> {
  const ds = getDataSource();
  const all = await ds.orders.list({ pageSize: 100 });
  return {
    received: all.items.filter((o) => o.status === 'RECEIVED'),
    processing: all.items.filter((o) => o.status === 'PROCESSING'),
    dispatched: all.items.filter((o) => o.status === 'DISPATCHED'),
    delivered: all.items.filter((o) => o.status === 'DELIVERED'),
  };
}
