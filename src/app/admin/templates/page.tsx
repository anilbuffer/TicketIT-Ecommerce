// src/app/admin/templates/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutTemplate,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useTemplates, useTemplateMutations } from '@/lib/hooks/useTemplates';
import type { PrintTemplate } from '@/lib/services/types';

const CATEGORIES = ['All', 'Signs', 'Banners', 'Business Cards', 'Flyers', 'Catalogue', 'Template Design', 'Posters', 'Brochures'];

export default function AdminTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<PrintTemplate['status'] | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<PrintTemplate | null>(null);

  const { data: templates, isLoading, refetch } = useTemplates({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    status: selectedStatus === 'ALL' ? undefined : selectedStatus,
    search: searchQuery || undefined,
  });

  const { duplicateTemplate, deleteTemplate, publishTemplate, unpublishTemplate } = useTemplateMutations();

  const handleDuplicate = async (id: string, name: string) => {
    await duplicateTemplate(id, `${name} (Clone)`);
    refetch();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the template "${name}"?`)) {
      await deleteTemplate(id);
      refetch();
    }
  };

  const handleTogglePublish = async (template: PrintTemplate) => {
    if (template.status === 'PUBLISHED') {
      await unpublishTemplate(template.id);
    } else {
      await publishTemplate(template.id);
    }
    refetch();
  };

  return (
    <>
      {/* 1. Header Banner */}
      <AdminHeader
        title="Master Design Template Library"
        subtitle="Build reusable print templates, configure typography & layouts, and define exact editable vs locked fields for Site Users."
        actionButton={
          <Link
            href="/admin/templates/builder"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#F73582',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
            }}
          >
            <Plus size={16} />
            Create Master Template
          </Link>
        }
      />

      {/* Main Content Area */}
      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 2. Filter & Search Controls */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search templates by title, category, or product..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
              <Filter size={14} />
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published Only</option>
                <option value="DRAFT">Drafts</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingTop: '2px' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isSelected ? '#0f172a' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#475569',
                  boxShadow: isSelected ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{ height: '320px', borderRadius: '16px', backgroundColor: '#f1f5f9', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '460px',
            margin: '24px auto',
          }}
        >
          <LayoutTemplate size={36} color="#F73582" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>No Templates Found</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', marginBottom: '20px' }}>
            No design templates match your filter criteria. Try resetting filters or create a new template.
          </p>
          <Link
            href="/admin/templates/builder"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#F73582',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
            }}
          >
            <Plus size={16} />
            Create First Template
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {templates.map((tpl) => {
            const editableCount = tpl.layers.filter((l) => l.isEditableBySiteUser).length;
            const lockedCount = tpl.layers.length - editableCount;

            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
                    padding: '16px',
                  }}
                >
                  {/* Scaled Mini-Proof */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '4px',
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
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {l.type === 'text' && <span style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{l.content}</span>}
                        {l.type === 'qrcode' && <span style={{ backgroundColor: '#fff', color: '#000', padding: '2px', fontSize: '7px', fontWeight: 800 }}>QR</span>}
                      </div>
                    ))}
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: tpl.status === 'PUBLISHED' ? '#059669' : '#d97706',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {tpl.status}
                  </div>

                  {/* Category Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                    }}
                  >
                    {tpl.category}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{tpl.name}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                      Target Product: <strong>{tpl.productName}</strong>
                    </p>
                  </div>

                  {/* Rules Summary Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700 }}>
                      <Unlock size={13} />
                      <span>{editableCount} Editable Fields</span>
                    </div>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e11d48', fontWeight: 600 }}>
                      <Lock size={13} />
                      <span>{lockedCount} Locked Elements</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '12px',
                      marginTop: 'auto',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Link
                        href={`/admin/templates/${tpl.id}/edit`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#F73582',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(247, 53, 130, 0.25)',
                        }}
                      >
                        <Edit3 size={13} />
                        Studio Editor
                      </Link>

                      <button
                        onClick={() => handleDuplicate(tpl.id, tpl.name)}
                        title="Duplicate Template"
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(tpl.id, tpl.name)}
                        title="Delete Template"
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleTogglePublish(tpl)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        backgroundColor: tpl.status === 'PUBLISHED' ? '#fef3c7' : '#ecfdf5',
                        color: tpl.status === 'PUBLISHED' ? '#92400e' : '#047857',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {tpl.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </main>
    </>
  );
}
