// src/app/admin/catalogue/products/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Edit3,
  Trash2,
  CheckCircle,
  Tag,
  Layers,
  DollarSign,
  ShieldCheck,
  Building2,
  Clock,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { ProductEditModal } from '@/components/admin/ProductEditModal';
import { useProduct, useProductCategories, useProductMutations } from '@/lib/hooks/useProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string) || '';

  const { product, isLoading, refetch } = useProduct(productId);
  const { categories } = useProductCategories();
  const { updateProduct, deleteProduct } = useProductMutations();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = async (data: any) => {
    await updateProduct(productId, data);
    refetch();
  };

  const handleDelete = async () => {
    if (product && window.confirm(`Delete product ${product.name}?`)) {
      await deleteProduct(productId);
      router.push('/admin/catalogue/products');
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Product Details" />
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          Loading product specifications from service layer...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AdminHeader title="Product Not Found" />
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          <Package size={40} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#2B253E' }}>Product was not found</div>
          <Link
            href="/admin/catalogue/products"
            style={{ display: 'inline-block', marginTop: '12px', color: '#F73582', fontWeight: 700 }}
          >
            ← Back to Catalogue
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title={product.name}
        subtitle={`SKU: ${product.sku} • Category: ${product.categoryName || 'General'}`}
        actionButton={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/admin/catalogue/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#F73582',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <Edit3 size={15} />
              <span>Edit Attributes</span>
            </button>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
          {/* Left: Product Image & Status Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Current Status</div>
              <StatusPill status={product.status} size="lg" />
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Base Master Unit Price</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F73582', marginTop: '2px' }}>
                ${product.basePrice.toFixed(2)}
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, marginLeft: '6px' }}>
                  / {product.uom}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginTop: 'auto',
              }}
            >
              <Trash2 size={15} />
              <span>Archive Product</span>
            </button>
          </div>

          {/* Right: Technical Attributes & Pricing Info */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B253E', margin: 0 }}>
                Specification & Packaging Attributes
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, marginTop: '4px', lineHeight: 1.5 }}>
                {product.description}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  SKU Identifier
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', fontFamily: 'monospace', marginTop: '4px' }}>
                  {product.sku}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Packaging & Pack Size
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', marginTop: '4px' }}>
                  {product.packSize}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Minimum Order Quantity (MOQ)
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', marginTop: '4px' }}>
                  {product.moq} {product.uom}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Order Increment Multiple
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2B253E', marginTop: '4px' }}>
                  Every {product.orderMultiple} unit(s)
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#FFF0F6', borderRadius: '12px', border: '1px solid rgba(247, 53, 130, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#B01654', marginBottom: '4px' }}>
                Rate Card Overrides & Customer Pricing
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>
                This product is included in active multi-tenant rate cards. When ordered by Apex Healthcare Group, discount pricing of $120.00 is applied automatically.
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProductEditModal
        product={product}
        categories={categories}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
