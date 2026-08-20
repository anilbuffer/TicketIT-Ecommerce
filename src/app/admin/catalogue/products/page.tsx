// src/app/admin/catalogue/products/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  CheckCircle,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { ProductEditModal } from '@/components/admin/ProductEditModal';
import { useProducts, useProductCategories, useProductMutations } from '@/lib/hooks/useProducts';
import type { Product } from '@/lib/services/types';

export default function ProductsCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<Product['status'] | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { categories: categoriesData } = useProductCategories();
  const { data: productsData, isLoading, refetch } = useProducts({
    categoryId: selectedCategory === 'All' ? undefined : selectedCategory,
    status: selectedStatus === 'ALL' ? undefined : selectedStatus,
    search: searchQuery || undefined,
  });

  const { createProduct, updateProduct, deleteProduct } = useProductMutations();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  const handleOpenCreate = () => {
    setModalState({ isOpen: true, product: null });
  };

  const handleOpenEdit = (product: Product) => {
    setModalState({ isOpen: true, product });
  };

  const handleSaveProduct = async (
    data: Omit<Product, 'id'> | Partial<Product>,
    isEditing: boolean
  ) => {
    if (isEditing && modalState.product) {
      await updateProduct(modalState.product.id, data);
    } else {
      await createProduct(data as Omit<Product, 'id'>);
    }
    refetch();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
      refetch();
    }
  };

  return (
    <>
      <AdminHeader
        title="Product Catalogue & DAM"
        subtitle="Manage collateral products, packaging specifications, MOQ rules, and pricing"
        actionButton={
          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#F73582',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
            }}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Filter Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(43, 37, 62, 0.04)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px 12px',
              flex: '1',
              minWidth: '240px',
            }}
          >
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search products by title, SKU, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.85rem',
                width: '100%',
              }}
            />
          </div>

          {/* Category Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '0.82rem',
                backgroundColor: '#FFFFFF',
                color: '#2B253E',
                fontWeight: 600,
              }}
            >
              <option value="All">All Categories ({categoriesData?.length || 5})</option>
              {categoriesData?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.itemCount})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '0.82rem',
                backgroundColor: '#FFFFFF',
                color: '#2B253E',
                fontWeight: 600,
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="UNAVAILABLE">Unavailable Only</option>
              <option value="SUPERSEDED">Superseded Only</option>
            </select>
          </div>
        </div>

        {/* Products Table Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
              Loading products from service layer (simulating latency)...
            </div>
          ) : !productsData?.items.length ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
              <Package size={36} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2B253E' }}>No products found</div>
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or filters.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Item Details</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>SKU</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Pack Size / UOM</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'center' }}>MOQ</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Base Price</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.items.map((prod) => (
                    <tr
                      key={prod.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF8FB')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={prod.thumbnailUrl}
                            alt={prod.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #E2E8F0',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <Link
                              href={`/admin/catalogue/products/${prod.id}`}
                              style={{
                                fontWeight: 700,
                                color: '#2B253E',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span>{prod.name}</span>
                              <ExternalLink size={12} color="#94A3B8" />
                            </Link>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: '#64748B',
                                marginTop: '2px',
                                maxWidth: '320px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {prod.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#475569' }}>
                        {prod.sku}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#2B253E', fontWeight: 600 }}>
                        {prod.categoryName || 'General'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}>
                        {prod.packSize} ({prod.uom})
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#2B253E' }}>
                        {prod.moq}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#F73582' }}>
                        ${prod.basePrice.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusPill status={prod.status} />
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link
                            href={`/admin/catalogue/products/${prod.id}`}
                            title="View Full Details"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#EFF6FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#3B82F6',
                              textDecoration: 'none',
                            }}
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            title="Edit Product"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#475569',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            title="Delete Product"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#FEF2F2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#EF4444',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <ProductEditModal
        product={modalState.product}
        categories={categoriesData || []}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, product: null })}
        onSave={handleSaveProduct}
      />
    </>
  );
}
