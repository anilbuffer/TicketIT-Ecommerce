// src/app/shop/templates/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  LayoutTemplate,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Palette,
  CheckCircle2,
  Building2,
  Lock,
  Unlock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTemplates } from '@/lib/hooks/useTemplates';
import type { PrintTemplate } from '@/lib/services/types';

const CATEGORIES = ['All', 'Signs', 'Posters', 'Banners', 'Flyers', 'Business Cards'];

export default function ShopTemplateGalleryPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: templates, isLoading } = useTemplates({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    status: 'PUBLISHED',
    search: searchQuery || undefined,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
      {/* 1. Header Hero Banner */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #2B253E 0%, #1e1b38 50%, #16122a 100%)',
          color: '#ffffff',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(43, 37, 62, 0.15)',
          border: '1px solid #332d4a',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#f472b6',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                width: 'fit-content',
              }}
            >
              <Building2 size={14} />
              <span>{user?.siteName || 'Apex Midtown Central Pharmacy'} ({user?.siteCode || 'APX-MID-101'})</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.25, margin: 0 }}>
              Design Template Library — Signs, Posters & Banners
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Choose a pre-approved professional master template. Personalize your branch name, contact details, logo, and QR codes while adhering to strict brand design guidelines.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '6px', fontSize: '12px', color: '#fbcfe8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} color="#34d399" />
                Zero Site User Payment Required
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} color="#34d399" />
                Submitted Direct to Head Office for Approval
              </span>
            </div>
          </div>

          <Link
            href="/shop/catalogue"
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            Browse Products Catalogue →
          </Link>
        </div>

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            backgroundColor: 'rgba(247, 53, 130, 0.2)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 2. Filters & Search */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '440px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search templates by product, occasion, or format..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '38px',
                paddingRight: '14px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                fontSize: '13px',
                backgroundColor: '#f8fafc',
                outline: 'none',
              }}
            />
          </div>

          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing <strong style={{ color: '#0f172a' }}>{templates.length}</strong> published master templates
          </span>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingTop: '2px' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isSelected ? '#f73582' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#475569',
                  boxShadow: isSelected ? '0 2px 8px rgba(247, 53, 130, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Templates Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{ height: '340px', borderRadius: '20px', backgroundColor: '#f1f5f9', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '48px 24px',
            textAlign: 'center',
            maxWidth: '440px',
            margin: '32px auto',
          }}
        >
          <LayoutTemplate size={36} color="#f73582" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>No Templates Found</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
            No published templates match your current filter. Try clearing your search.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {templates.map((tpl, index) => {
            const editableCount = tpl.layers.filter((l) => l.isEditableBySiteUser).length;

            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Visual Preview Header */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    backgroundColor: tpl.canvasConfig.backgroundColor,
                    backgroundImage: tpl.canvasConfig.bgGradient || 'none',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  {/* Scaled Mini Artwork */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    {tpl.layers.map((l) => (
                      <div
                        key={l.id}
                        style={{
                          position: 'absolute',
                          left: `${l.x}%`,
                          top: `${l.y}%`,
                          width: `${l.width}%`,
                          height: `${l.height}%`,
                          backgroundColor: l.style.backgroundColor || 'transparent',
                          color: l.style.color || '#ffffff',
                          fontSize: `${Math.max((l.style.fontSize || 14) * 0.45, 8)}px`,
                          fontWeight: l.style.fontWeight || 600,
                          overflow: 'hidden',
                          lineHeight: 1.2,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {l.type === 'text' && <span style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{l.content}</span>}
                        {l.type === 'qrcode' && <span style={{ backgroundColor: '#fff', color: '#000', padding: '2px', fontSize: '7px', fontWeight: 800 }}>QR</span>}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                    }}
                  >
                    {tpl.category} • {tpl.dimensions.width}&quot; × {tpl.dimensions.height}&quot;
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                      {tpl.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                      Base Product: <strong>{tpl.productName}</strong>
                    </p>
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {tpl.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#059669',
                      backgroundColor: '#ecfdf5',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      width: 'fit-content',
                    }}
                  >
                    <Unlock size={12} />
                    <span>{editableCount} Customizable Fields (Logo, Phone, Text, QR)</span>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/shop/templates/customize/${tpl.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      backgroundColor: '#2B253E',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      marginTop: 'auto',
                      boxShadow: '0 4px 10px rgba(43, 37, 62, 0.2)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Customize This Design</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
