// src/lib/hooks/useProducts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProducts,
  getProductById,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  getProductCategories,
} from '@/lib/services/products.service';
import type { Product, ProductCategory, PaginatedResult } from '@/lib/services/types';

export function useProducts(params?: Parameters<typeof getProducts>[0]) {
  const [data, setData] = useState<PaginatedResult<Product> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProducts(params);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProductById(id);
      setProduct(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getProductCategories();
      setCategories(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, refetch: fetchCategories };
}

export function useProductMutations() {
  const [isPending, setIsPending] = useState(false);

  const createProduct = async (input: Omit<Product, 'id'>) => {
    setIsPending(true);
    try {
      return await createProductService(input);
    } finally {
      setIsPending(false);
    }
  };

  const updateProduct = async (id: string, input: Partial<Product>) => {
    setIsPending(true);
    try {
      return await updateProductService(id, input);
    } finally {
      setIsPending(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsPending(true);
    try {
      return await deleteProductService(id);
    } finally {
      setIsPending(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    isPending,
  };
}
