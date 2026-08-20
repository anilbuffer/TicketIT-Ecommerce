// src/app/admin/catalogue/categories/page.tsx
'use client';

import React, { useState } from 'react';
import { Layers, Plus, Search, Tag, CheckCircle } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductCategories } from '@/lib/hooks/useProducts';
import { createProductCategory } from '@/lib/services/products.service';

export default function CategoriesPage() {
  const { categories, isLoading, refetch } = useProductCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    setIsSubmitting(true);
    try {
      await createProductCategory({ name, code, description });
      setName('');
      setCode('');
      setDescription('');
      setIsAdding(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Catalogue Categories"
        subtitle="Organize collateral types, packaging groups, and visibility classifications"
        actionButton={
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
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
            }}
          >
            <Plus size={16} />
            <span>{isAdding ? 'Cancel' : 'New Category'}</span>
          </button>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Add Category Form Card */}
        {isAdding && (
          <form
            onSubmit={handleCreate}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(247, 53, 130, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>Add New Product Category</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Infusion Supplies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Category Code (Prefix) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INF"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Category scope and application..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: '#F73582', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700 }}
              >
                {isSubmitting ? 'Saving...' : 'Create Category'}
              </button>
            </div>
          </form>
        )}

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(43, 37, 62, 0.05)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#FFF0F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Layers size={16} color="#F73582" />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>{cat.name}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: '#475569',
                    }}
                  >
                    {cat.code}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '10px', lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '12px',
                  fontSize: '0.78rem',
                }}
              >
                <span style={{ color: '#94A3B8' }}>Catalogue Items:</span>
                <span style={{ fontWeight: 800, color: '#F73582' }}>{cat.itemCount} SKUs</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
