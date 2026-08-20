// src/lib/hooks/usePricing.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getRateCards,
  getRateCardById,
  getRateCardByAccountId,
  createRateCard as createRateCardService,
  updateRateCard as updateRateCardService,
  calculateItemPrice,
} from '@/lib/services/pricing.service';
import type { RateCard, PaginatedResult } from '@/lib/services/types';

export function useRateCards(params?: Parameters<typeof getRateCards>[0]) {
  const [data, setData] = useState<PaginatedResult<RateCard> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRateCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getRateCards(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchRateCards();
  }, [fetchRateCards]);

  return { data, isLoading, error, refetch: fetchRateCards };
}

export function useRateCardMutations() {
  const [isPending, setIsPending] = useState(false);

  const createRateCard = async (input: Parameters<typeof createRateCardService>[0]) => {
    setIsPending(true);
    try {
      return await createRateCardService(input);
    } finally {
      setIsPending(false);
    }
  };

  const updateRateCard = async (id: string, input: Parameters<typeof updateRateCardService>[1]) => {
    setIsPending(true);
    try {
      return await updateRateCardService(id, input);
    } finally {
      setIsPending(false);
    }
  };

  return { createRateCard, updateRateCard, calculateItemPrice, isPending };
}
