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

  const { createProduct, updateProduct, deleteProduct, bulkCreateProducts } = useProductMutations();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleBulkImport = async () => {
    if (!csvText.trim()) {
      setBulkError('Please provide CSV data to import.');
      return;
    }

    setIsImporting(true);
    setBulkError(null);

    try {
      const lines = csvText.trim().split('\n');
      const itemsToImport: Omit<Product, 'id'>[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || (i === 0 && line.toLowerCase().includes('sku'))) continue; // skip header
        const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim());

        if (parts.length < 5) continue;
        const [sku, name, categoryName, basePriceStr, moqStr, packSize, uom] = parts;

        itemsToImport.push({
          sku: sku || `SKU-${Date.now()}-${i}`,
          name: name || 'Imported Asset',
          description: `Bulk imported marketing collateral asset specification.`,
          thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
          categoryId: 'cat-pos',
          categoryName: categoryName || 'Point of Sale',
          packSize: packSize || 'Pack of 10',
          uom: uom || 'PK',
          basePrice: parseFloat(basePriceStr) || 99.0,
          moq: parseInt(moqStr) || 1,
          orderMultiple: 1,
          status: 'ACTIVE',
          stockRemaining: 150,
          lowStockThreshold: 20,
        });
      }

      if (itemsToImport.length === 0) {
        setBulkError('No valid product rows found in CSV data.');
        setIsImporting(false);
        return;
      }

      await bulkCreateProducts(itemsToImport);
      setBulkSuccess(`Successfully imported ${itemsToImport.length} products into catalogue.`);
      setCsvText('');
      refetch();
      setTimeout(() => {
        setIsBulkModalOpen(false);
        setBulkSuccess(null);
      }, 2000);
    } catch (err: any) {
      setBulkError(err.message || 'Failed to import CSV');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Product Catalogue & DAM"
        subtitle="Manage collateral products, packaging specifications, MOQ rules, and pricing"
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setCsvText(
                  `SKU,Name,Category,BasePrice,MOQ,PackSize,UOM\n` +
                  `POS-BANNER-SUMMER,Summer Campaign Tension Banner,Point of Sale,165.00,1,Single Unit,EA\n` +
                  `PKG-TOTE-INSULATED-20L,Validated Insulated Cold Tote 20L,Specialized Packaging,320.00,2,Pack of 5,PK\n` +
                  `APR-SCRUBS-NAVY-M,Premium Antimicrobial Scrubs Navy (M),Apparel,75.00,5,Pack of 2,PK`
                );
                setIsBulkModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(43, 37, 62, 0.15)',
                color: '#2B253E',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>Bulk CSV Import</span>
            </button>

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
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
              }}
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
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

      {/* Bulk CSV Import Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                margin: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                Bulk CSV Catalogue Import
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
                Paste or upload comma-separated values to batch-create marketing collateral products.
              </p>

              {bulkSuccess && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
                  ✓ {bulkSuccess}
                </div>
              )}

              {bulkError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
                  ⚠️ {bulkError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  CSV Payload (Header: SKU, Name, Category, BasePrice, MOQ, PackSize, UOM)
                </label>
                <textarea
                  rows={7}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="SKU,Name,Category,BasePrice,MOQ,PackSize,UOM..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  disabled={isImporting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isImporting ? 'Ingesting...' : 'Import Products'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
