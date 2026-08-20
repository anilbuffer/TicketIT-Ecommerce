// src/app/admin/inventory/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Download,
  RefreshCw,
  Boxes,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useProducts, useProductMutations } from '@/lib/hooks/useProducts';
import type { Product } from '@/lib/services/types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';

export default function AdminInventoryPage() {
  const { data: productsData, isLoading, refetch } = useProducts({ pageSize: 100 });
  const { updateProductStock, isPending } = useProductMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OUT' | 'IN'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState<number>(50);
  const [feedback, setFeedback] = useState<string | null>(null);

  const products = productsData?.items || [];

  const filteredProducts = products.filter((p) => {
    const stock = p.stockRemaining ?? 50;
    const threshold = p.lowStockThreshold ?? 15;

    let matchesFilter = true;
    if (stockFilter === 'LOW') matchesFilter = stock > 0 && stock <= threshold;
    else if (stockFilter === 'OUT') matchesFilter = stock === 0;
    else if (stockFilter === 'IN') matchesFilter = stock > threshold;

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const totalSKUs = products.length;
  const lowStockCount = products.filter((p) => (p.stockRemaining ?? 50) <= (p.lowStockThreshold ?? 15) && (p.stockRemaining ?? 50) > 0).length;
  const outOfStockCount = products.filter((p) => (p.stockRemaining ?? 50) === 0).length;
  const totalUnitsOnHand = products.reduce((sum, p) => sum + (p.stockRemaining ?? 50), 0);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || restockQty <= 0) return;

    try {
      await updateProductStock(selectedProduct.id, restockQty);
      setFeedback(`Added +${restockQty} units to SKU ${selectedProduct.sku}. New stock: ${(selectedProduct.stockRemaining ?? 50) + restockQty}`);
      setSelectedProduct(null);
      refetch();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'UOM', 'Pack Size', 'Unit Price ($)', 'Stock Remaining', 'Low Stock Threshold', 'Status'];
    const rows = products.map((p) => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.categoryName || 'General',
      p.uom,
      p.packSize,
      p.basePrice.toFixed(2),
      p.stockRemaining ?? 50,
      p.lowStockThreshold ?? 15,
      (p.stockRemaining ?? 50) === 0 ? 'OUT_OF_STOCK' : (p.stockRemaining ?? 50) <= (p.lowStockThreshold ?? 15) ? 'LOW_STOCK' : 'HEALTHY',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `warehouse-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminHeader
        title="Warehouse Inventory & Stock Visibility"
        subtitle="Real-time physical stock levels, low-stock threshold triggers, pick-and-pack warehouse counts"
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={exportInventoryCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(43, 37, 62, 0.15)',
                color: '#2B253E',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Export Stock CSV</span>
            </button>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {feedback && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            ✓ {feedback}
          </div>
        )}

        {/* 1. KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid rgba(43, 37, 62, 0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
              Total SKUs Tracked
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>{totalSKUs}</div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Across POS, Packaging & Apparel</div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid rgba(43, 37, 62, 0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
              Total Units On Hand
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>
              {totalUnitsOnHand.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>Central Fulfillment Hub</div>
          </div>

          <div
            style={{
              backgroundColor: lowStockCount > 0 ? '#FFFBEB' : '#FFFFFF',
              borderRadius: '14px',
              padding: '18px',
              border: `1px solid ${lowStockCount > 0 ? '#FDE68A' : 'rgba(43, 37, 62, 0.08)'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: lowStockCount > 0 ? '#B45309' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
              Low Stock Alerts
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: lowStockCount > 0 ? '#D97706' : '#0F172A' }}>
              {lowStockCount} SKUs
            </div>
            <div style={{ fontSize: '12px', color: lowStockCount > 0 ? '#B45309' : '#64748B', marginTop: '4px' }}>Below safety threshold</div>
          </div>

          <div
            style={{
              backgroundColor: outOfStockCount > 0 ? '#FEF2F2' : '#FFFFFF',
              borderRadius: '14px',
              padding: '18px',
              border: `1px solid ${outOfStockCount > 0 ? '#FECACA' : 'rgba(43, 37, 62, 0.08)'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: outOfStockCount > 0 ? '#991B1B' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
              Depleted Stock
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: outOfStockCount > 0 ? '#DC2626' : '#0F172A' }}>
              {outOfStockCount} SKUs
            </div>
            <div style={{ fontSize: '12px', color: outOfStockCount > 0 ? '#991B1B' : '#64748B', marginTop: '4px' }}>Needs immediate PO replenishment</div>
          </div>
        </div>

        {/* 2. Search & Filter Bar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            backgroundColor: '#FFFFFF',
            padding: '14px 18px',
            borderRadius: '14px',
            border: '1px solid rgba(43, 37, 62, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search SKU, product title, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['ALL', 'LOW', 'OUT', 'IN'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setStockFilter(filterKey)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: stockFilter === filterKey ? '1px solid #059669' : '1px solid #e2e8f0',
                  backgroundColor: stockFilter === filterKey ? '#ECFDF5' : '#FFFFFF',
                  color: stockFilter === filterKey ? '#047857' : '#64748B',
                  cursor: 'pointer',
                }}
              >
                {filterKey === 'ALL' ? 'All Stock' : filterKey === 'LOW' ? '⚠️ Low Stock' : filterKey === 'OUT' ? '⛔ Depleted' : '✓ Healthy'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Products Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(43, 37, 62, 0.08)',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Product & SKU</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Pack / UOM</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Base Price</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Available Stock</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Safety Limit</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Stock Health</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const stock = p.stockRemaining ?? 50;
                  const threshold = p.lowStockThreshold ?? 15;
                  const isLow = stock <= threshold && stock > 0;
                  const isOut = stock === 0;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isOut ? '#FFFBFB' : isLow ? '#FFFFFA' : '#FFFFFF' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundColor: '#E2E8F0',
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={p.thumbnailUrl || FALLBACK_IMAGE}
                              alt={p.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{p.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#475569', fontWeight: 600 }}>
                        {p.categoryName || 'General'}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B' }}>
                        {p.packSize} ({p.uom})
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A' }}>
                        ${p.basePrice.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: 900,
                            color: isOut ? '#DC2626' : isLow ? '#D97706' : '#059669',
                          }}
                        >
                          {stock} units
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B' }}>
                        {threshold} units
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {isOut ? (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#FEF2F2',
                              color: '#991B1B',
                              border: '1px solid #FECACA',
                            }}
                          >
                            ⛔ Out of Stock
                          </span>
                        ) : isLow ? (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#FFFBEB',
                              color: '#B45309',
                              border: '1px solid #FDE68A',
                            }}
                          >
                            ⚠️ Low Stock
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#ECFDF5',
                              color: '#065F46',
                              border: '1px solid #A7F3D0',
                            }}
                          >
                            ✓ Healthy
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setRestockQty(50);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#F1F5F9',
                            color: '#1E293B',
                            border: '1px solid #CBD5E1',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Restock Modal */}
      <AnimatePresence>
        {selectedProduct && (
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
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                margin: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                Warehouse Restock Inbound
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
                Replenishing inventory for <strong>{selectedProduct.name}</strong> ({selectedProduct.sku}).
              </p>

              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  marginBottom: '16px',
                  fontSize: '12px',
                }}
              >
                <div>Current Stock Level: <strong>{selectedProduct.stockRemaining ?? 50} units</strong></div>
                <div>Safety Minimum Threshold: <strong>{selectedProduct.lowStockThreshold ?? 15} units</strong></div>
              </div>

              <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Units to Add (Inbound Shipment)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    {[25, 50, 100, 250].map((quickQty) => (
                      <button
                        key={quickQty}
                        type="button"
                        onClick={() => setRestockQty(quickQty)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: restockQty === quickQty ? '1px solid #059669' : '1px solid #CBD5E1',
                          backgroundColor: restockQty === quickQty ? '#ECFDF5' : '#FFFFFF',
                          color: restockQty === quickQty ? '#047857' : '#475569',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        +{quickQty}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    style={{
                      padding: '8px 14px',
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
                    type="submit"
                    disabled={isPending}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isPending ? 'Updating...' : 'Confirm Inbound Stock'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
