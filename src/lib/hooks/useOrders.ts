// src/lib/hooks/useOrders.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getOrders,
  getOrderById,
  createOrder as createOrderService,
  updateOrderStatus as updateOrderStatusService,
  updateOrderDetails as updateOrderDetailsService,
  getFulfilmentQueue,
} from '@/lib/services/orders.service';
import type { Order, OrderStatus, PaginatedResult } from '@/lib/services/types';

export function useOrders(params?: Parameters<typeof getOrders>[0]) {
  const [data, setData] = useState<PaginatedResult<Order> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getOrders(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getOrderById(id);
      setOrder(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrder,
  };
}

export function useFulfilmentQueue() {
  const [queue, setQueue] = useState<{
    received: Order[];
    processing: Order[];
    dispatched: Order[];
    delivered: Order[];
  }>({ received: [], processing: [], dispatched: [], delivered: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFulfilmentQueue();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return { queue, isLoading, refetch: fetchQueue };
}

export function usePendingApprovals(accountId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApprovals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getPendingApprovals } = await import('@/lib/services/orders.service');
      const result = await getPendingApprovals(accountId);
      setOrders(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return { orders, isLoading, error, refetch: fetchApprovals };
}

export function useOrderMutations() {
  const [isPending, setIsPending] = useState(false);

  const createOrder = async (input: Parameters<typeof createOrderService>[0]) => {
    setIsPending(true);
    try {
      return await createOrderService(input);
    } finally {
      setIsPending(false);
    }
  };

  const updateOrderStatus = async (
    id: string,
    newStatus: OrderStatus,
    metadata?: { carrier?: string; trackingNumber?: string; deliveryNotes?: string }
  ) => {
    setIsPending(true);
    try {
      return await updateOrderStatusService(id, newStatus, metadata);
    } finally {
      setIsPending(false);
    }
  };

  const updateOrderDetails = async (
    id: string,
    details: Parameters<typeof updateOrderDetailsService>[1]
  ) => {
    setIsPending(true);
    try {
      return await updateOrderDetailsService(id, details);
    } finally {
      setIsPending(false);
    }
  };

  const approveOrder = async (id: string, approverName: string, notes?: string) => {
    setIsPending(true);
    try {
      const { approveOrder: approveService } = await import('@/lib/services/orders.service');
      return await approveService(id, approverName, notes);
    } finally {
      setIsPending(false);
    }
  };

  const rejectOrder = async (id: string, approverName: string, reason: string) => {
    setIsPending(true);
    try {
      const { rejectOrder: rejectService } = await import('@/lib/services/orders.service');
      return await rejectService(id, approverName, reason);
    } finally {
      setIsPending(false);
    }
  };

  const requestChanges = async (id: string, approverName: string, notes: string) => {
    setIsPending(true);
    try {
      const { requestChanges: requestChangesService } = await import('@/lib/services/orders.service');
      return await requestChangesService(id, approverName, notes);
    } finally {
      setIsPending(false);
    }
  };

  const payOrder = async (
    id: string,
    paymentMethod: Order['paymentMethod'] = 'CORPORATE_INVOICE',
    paymentRef?: string,
    paidBy: string = 'Elena Rostova (Head Office)'
  ) => {
    setIsPending(true);
    try {
      const { payOrder: payOrderService } = await import('@/lib/services/orders.service');
      return await payOrderService(id, paymentMethod, paymentRef, paidBy);
    } finally {
      setIsPending(false);
    }
  };

  return {
    createOrder,
    updateOrderStatus,
    updateOrderDetails,
    approveOrder,
    requestChanges,
    payOrder,
    rejectOrder,
    isPending,
  };
}

