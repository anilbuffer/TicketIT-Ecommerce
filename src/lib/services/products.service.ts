// src/lib/services/products.service.ts
import { getDataSource } from '@/lib/data-source';
import type { Product, ProductCategory, PaginatedResult } from './types';

export async function getProducts(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: Product['status'];
  search?: string;
}): Promise<PaginatedResult<Product>> {
  const ds = getDataSource();
  return ds.products.list(params);
}

export async function getProductById(id: string): Promise<Product | null> {
  const ds = getDataSource();
  return ds.products.getById(id);
}

export async function createProduct(input: Omit<Product, 'id'>): Promise<Product> {
  const ds = getDataSource();
  const created = await ds.products.create(input);

  // Log audit trail
  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'PRODUCT_CREATED',
      entityType: 'PRODUCT',
      entityId: created.id,
      entityName: created.name,
      details: { sku: created.sku, basePrice: created.basePrice, categoryId: created.categoryId },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return created;
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product> {
  const ds = getDataSource();
  const updated = await ds.products.update(id, input);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'PRODUCT_UPDATED',
      entityType: 'PRODUCT',
      entityId: id,
      entityName: updated.name,
      details: { changes: Object.keys(input) },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }

  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const ds = getDataSource();
  await ds.products.remove(id);

  try {
    await ds.audit.log({
      actorId: 'usr_admin_999',
      actorName: 'Dr. Sarah Sterling',
      actorEmail: 'admin@rahhawan.io',
      actorRole: 'ADMIN',
      action: 'PRODUCT_DELETED',
      entityType: 'PRODUCT',
      entityId: id,
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const ds = getDataSource();
  return ds.products.listCategories();
}

export async function createProductCategory(input: Omit<ProductCategory, 'id' | 'itemCount'>): Promise<ProductCategory> {
  const ds = getDataSource();
  return ds.products.createCategory(input);
}
