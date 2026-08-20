// src/lib/data-source/production/db-products.adapter.ts
import prisma from '@/lib/db/prisma';
import type { Product, ProductCategory, PaginatedResult } from '@/lib/services/types';

export async function list(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: Product['status'];
  search?: string;
}): Promise<PaginatedResult<Product>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (params?.categoryId && params.categoryId !== 'All') where.categoryId = params.categoryId;
  if (params?.status) where.status = params.status;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { sku: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map((i: any) => ({ ...i, basePrice: Number(i.basePrice) })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function getById(id: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { sku: id }] },
  });
  if (!product) return null;
  return { ...product, basePrice: Number(product.basePrice) };
}

export async function create(input: Omit<Product, 'id'>): Promise<Product> {
  const product = await prisma.product.create({
    data: {
      ...input,
      basePrice: input.basePrice,
    },
  });
  return { ...product, basePrice: Number(product.basePrice) };
}

export async function update(id: string, input: Partial<Product>): Promise<Product> {
  const product = await prisma.product.update({
    where: { id },
    data: input,
  });
  return { ...product, basePrice: Number(product.basePrice) };
}

export async function remove(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

export async function listCategories(): Promise<ProductCategory[]> {
  return [];
}

export async function createCategory(input: Omit<ProductCategory, 'id' | 'itemCount'>): Promise<ProductCategory> {
  return { ...input, id: input.code.toLowerCase(), itemCount: 0 };
}

export async function listVisibleForAccount(
  accountId?: string,
  params?: any
) {
  const result = await list(params);
  return {
    ...result,
    items: result.items.map((p) => ({
      ...p,
      effectivePrice: p.basePrice,
      discountPct: 0,
      isCustomPriced: false,
    })),
  };
}

export async function getByIdWithPricing(id: string, accountId?: string) {
  const p = await getById(id);
  if (!p) return null;
  return {
    ...p,
    effectivePrice: p.basePrice,
    discountPct: 0,
    isCustomPriced: false,
  };
}

