// src/lib/hooks/useAccounts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAccounts,
  getAccountById,
  createAccount as createAccountService,
  getSites,
  getSiteById,
  createSite as createSiteService,
  getUsers,
  createUser as createUserService,
} from '@/lib/services/accounts.service';
import type { Account, Site, PortalUser, PaginatedResult } from '@/lib/services/types';

export function useAccounts(params?: Parameters<typeof getAccounts>[0]) {
  const [data, setData] = useState<PaginatedResult<Account> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAccounts(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { data, isLoading, error, refetch: fetchAccounts };
}

export function useSites(params?: Parameters<typeof getSites>[0]) {
  const [data, setData] = useState<PaginatedResult<Site> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSites(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return { data, isLoading, error, refetch: fetchSites };
}

export function useUsers(params?: Parameters<typeof getUsers>[0]) {
  const [data, setData] = useState<PaginatedResult<PortalUser> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUsers(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, isLoading, error, refetch: fetchUsers };
}

export function useAccountMutations() {
  const [isPending, setIsPending] = useState(false);

  const createAccount = async (input: Parameters<typeof createAccountService>[0]) => {
    setIsPending(true);
    try {
      return await createAccountService(input);
    } finally {
      setIsPending(false);
    }
  };

  const createSite = async (input: Parameters<typeof createSiteService>[0]) => {
    setIsPending(true);
    try {
      return await createSiteService(input);
    } finally {
      setIsPending(false);
    }
  };

  const createUser = async (input: Parameters<typeof createUserService>[0]) => {
    setIsPending(true);
    try {
      return await createUserService(input);
    } finally {
      setIsPending(false);
    }
  };

  return { createAccount, createSite, createUser, isPending };
}
