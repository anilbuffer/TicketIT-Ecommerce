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

export async function approveOrder(
  id: string,
  approverName: string,
  notes?: string
): Promise<Order> {
  const ds = getDataSource();
  const updated = await ds.orders.approveOrder(id, approverName, notes);

  try {
    await ds.audit.log({
      actorId: 'usr_headoffice_001',
      actorName: approverName,
      actorEmail: 'approver@ticketit.io',
      actorRole: 'HEAD_OFFICE',
      action: 'ORDER_APPROVED',
      entityType: 'ORDER',
      entityId: updated.id,
      entityName: updated.orderNumber,
      details: {
        totalAmount: updated.totalAmount,
        siteCode: updated.siteCode,
        notes,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function requestChanges(
  id: string,
  approverName: string,
  notes: string
): Promise<Order> {
  const ds = getDataSource();
  const updated = await ds.orders.requestChanges(id, approverName, notes);

  try {
    await ds.audit.log({
      actorId: 'usr_headoffice_001',
      actorName: approverName,
      actorEmail: 'approver@ticketit.io',
      actorRole: 'HEAD_OFFICE',
      action: 'ORDER_CHANGES_REQUESTED',
      entityType: 'ORDER',
      entityId: updated.id,
      entityName: updated.orderNumber,
      details: {
        totalAmount: updated.totalAmount,
        siteCode: updated.siteCode,
        notes,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function payOrder(
  id: string,
  paymentMethod: Order['paymentMethod'] = 'CORPORATE_INVOICE',
  paymentRef?: string,
  paidBy: string = 'Elena Rostova (Head Office)'
): Promise<Order> {
  const ds = getDataSource();
  const updated = await ds.orders.payOrder(id, paymentMethod, paymentRef, paidBy);

  try {
    await ds.audit.log({
      actorId: 'usr_headoffice_001',
      actorName: paidBy,
      actorEmail: 'controller@ticketit.io',
      actorRole: 'HEAD_OFFICE',
      action: 'ORDER_PAID',
      entityType: 'ORDER',
      entityId: updated.id,
      entityName: updated.orderNumber,
      details: {
        totalAmount: updated.totalAmount,
        paymentMethod,
        paymentReference: paymentRef,
        siteCode: updated.siteCode,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function rejectOrder(
  id: string,
  approverName: string,
  reason: string
): Promise<Order> {
  const ds = getDataSource();
  const updated = await ds.orders.rejectOrder(id, approverName, reason);

  try {
    await ds.audit.log({
      actorId: 'usr_headoffice_001',
      actorName: approverName,
      actorEmail: 'approver@ticketit.io',
      actorRole: 'HEAD_OFFICE',
      action: 'ORDER_REJECTED',
      entityType: 'ORDER',
      entityId: updated.id,
      entityName: updated.orderNumber,
      details: {
        totalAmount: updated.totalAmount,
        siteCode: updated.siteCode,
        reason,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function getPendingApprovals(accountId?: string): Promise<Order[]> {
  const ds = getDataSource();
  const res = await ds.orders.list({
    accountId,
    pageSize: 100,
  });
  return res.items.filter(
    (o) => o.status === 'PENDING_APPROVAL' || o.status === 'APPROVED' || o.status === 'CHANGES_REQUESTED'
  );
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

