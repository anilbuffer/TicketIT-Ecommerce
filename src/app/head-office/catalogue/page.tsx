// src/app/head-office/catalogue/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  Building2,
  Lock,
  Eye,
  ShieldCheck,
  Tag,
  DollarSign,
  Layers,
  LayoutTemplate,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTemplates } from '@/lib/hooks/useTemplates';
import { useProducts } from '@/lib/hooks/useProducts';
import type { PrintTemplate } from '@/lib/services/types';

export default function HeadOfficeCataloguePage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'products' | 'templates'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<PrintTemplate | null>(null);

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    search: searchQuery || undefined,
  });

  const { data: templatesData, isLoading: isTemplatesLoading } = useTemplates({
    status: 'PUBLISHED',
    search: searchQuery || undefined,
  });

  const products = productsData?.items || [];
  const templates = templatesData || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(43, 37, 62, 0.08)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#2563eb',
            }}
          >
            <Building2 size={14} />
            <span>{user?.organization || 'Apex Healthcare Group'} • Head Office Governance</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>
            Corporate Approved Print Catalogue & Templates
          </h1>

          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            Read-only master view of approved marketing collateral, materials, rate cards, and design templates available to branch sites.
          </p>
        </div>

        {/* Read-Only Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#475569',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <Lock size={15} color="#64748b" />
          <span>Read-Only Oversight Access</span>
        </div>
      </div>

      {/* 2. Tab Switcher & Search */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSelectedTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: selectedTab === 'products' ? '#2563eb' : '#f1f5f9',
              color: selectedTab === 'products' ? '#ffffff' : '#475569',
              boxShadow: selectedTab === 'products' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
            }}
          >
            <Package size={16} />
            Print Products ({products.length})
          </button>

          <button
            onClick={() => setSelectedTab('templates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: selectedTab === 'templates' ? '#2563eb' : '#f1f5f9',
              color: selectedTab === 'templates' ? '#ffffff' : '#475569',
              boxShadow: selectedTab === 'templates' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
            }}
          >
            <LayoutTemplate size={16} />
            Master Templates ({templates.length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '280px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search items by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '38px',
              paddingRight: '14px',
              paddingTop: '9px',
              paddingBottom: '9px',
              borderRadius: '10px',
              border: '1.5px solid #e2e8f0',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 3. Content Display */}
      {selectedTab === 'products' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map((prod) => (
            <div
              key={prod.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f1f5f9' }}>
                <Image src={prod.thumbnailUrl} alt={prod.name} fill unoptimized style={{ objectFit: 'cover' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {prod.categoryName || 'Print Collateral'}
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SKU: {prod.sku}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{prod.name}</h3>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, margin: 0 }}>{prod.description}</p>

                <div
                  style={{
                    marginTop: 'auto',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Base Rate</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>${prod.basePrice.toFixed(2)}</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>
                    {prod.templatesCount || 3} Templates Linked
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  backgroundColor: tpl.canvasConfig.backgroundColor,
                  backgroundImage: tpl.canvasConfig.bgGradient || 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
                  {tpl.layers.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        position: 'absolute',
                        left: `${l.x}%`,
                        top: `${l.y}%`,
                        width: `${l.width}%`,
                        height: `${l.height}%`,
                        color: l.style.color || '#ffffff',
                        fontSize: `${Math.max((l.style.fontSize || 14) * 0.4, 8)}px`,
                        fontWeight: l.style.fontWeight || 600,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {l.type === 'text' && <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{l.content}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                  ✓ Approved Brand Master ({tpl.category})
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{tpl.name}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Product: {tpl.productName}</p>

                <div
                  style={{
                    marginTop: 'auto',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: '#64748b',
                  }}
                >
                  <span>
                    Dimensions: <strong>{tpl.dimensions.width}&quot; × {tpl.dimensions.height}&quot;</strong>
                  </span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>
                    {tpl.layers.filter((l) => l.isEditableBySiteUser).length} Editable Fields
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
