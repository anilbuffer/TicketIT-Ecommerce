// src/components/admin/TemplateBuilderStudio.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Check,
  Eye,
  Layers,
  Type,
  Image as ImageIcon,
  QrCode,
  Square,
  Lock,
  Unlock,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Trash2,
  Upload,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Info,
  Maximize2,
  FileCheck,
  Settings2,
} from 'lucide-react';
import type {
  PrintTemplate,
  TemplateLayer,
  TemplateLayerType,
  TemplateFieldKey,
  TemplateTheme,
} from '@/lib/services/types';
import { useTemplateMutations } from '@/lib/hooks/useTemplates';

const FIELD_KEY_OPTIONS: { key: TemplateFieldKey; label: string; defaultPlaceholder: string }[] = [
  { key: 'businessName', label: 'Business / Branch Name', defaultPlaceholder: 'Apex Midtown Central Health' },
  { key: 'contactName', label: 'Contact Person Name', defaultPlaceholder: 'Dr. Marcus Vance, PharmD' },
  { key: 'phone', label: 'Phone Number', defaultPlaceholder: '+1 (212) 555-0199' },
  { key: 'email', label: 'Official Email', defaultPlaceholder: 'contact@apexhealth.org' },
  { key: 'website', label: 'Website URL (QR Enabled)', defaultPlaceholder: 'https://apexhealth.org' },
  { key: 'address', label: 'Physical Address & Hours', defaultPlaceholder: '450 Lexington Ave, Suite 100 • Mon-Sat 8AM-8PM' },
  { key: 'logo', label: 'Brand Logo Upload', defaultPlaceholder: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80' },
  { key: 'tagline', label: 'Tagline / Subhead', defaultPlaceholder: 'Excellence in Community Patient Care' },
  { key: 'promoOffer', label: 'Special Promotional Offer', defaultPlaceholder: 'Free Blood Pressure & Glucose Checks This Saturday' },
];

const PRESET_PRODUCTS = [
  { id: 'prod-001', name: 'Corrugated Yard & Lawn Signs (18" x 24")', category: 'Signs', width: 24, height: 18, unit: 'in' as const, ratio: '4:3', orient: 'landscape' as const },
  { id: 'prod-002', name: 'Retractable Pull-Up Banner Stand (33" x 80")', category: 'Banners', width: 33, height: 80, unit: 'in' as const, ratio: '1:2', orient: 'portrait' as const },
  { id: 'prod-007', name: 'High-Definition Promotional Poster (24" x 36")', category: 'Posters', width: 24, height: 36, unit: 'in' as const, ratio: '2:3', orient: 'portrait' as const },
  { id: 'prod-008', name: 'Executive Soft-Touch Business Cards (Pack of 500)', category: 'Business Cards', width: 3.5, height: 2.0, unit: 'in' as const, ratio: '16:9', orient: 'landscape' as const },
  { id: 'prod-009', name: 'Gloss Tri-Fold Patient Care Brochure & Flyer', category: 'Flyers', width: 11, height: 8.5, unit: 'in' as const, ratio: '16:9', orient: 'landscape' as const },
];

interface TemplateBuilderStudioProps {
  initialTemplate?: PrintTemplate;
  isNew?: boolean;
}

export function TemplateBuilderStudio({ initialTemplate, isNew = false }: TemplateBuilderStudioProps) {
  const router = useRouter();
  const { createTemplate, updateTemplate, isPending } = useTemplateMutations();

  const [template, setTemplate] = useState<PrintTemplate>(
    initialTemplate || {
      id: `tpl-${Date.now()}`,
      productId: PRESET_PRODUCTS[0].id,
      productName: PRESET_PRODUCTS[0].name,
      category: PRESET_PRODUCTS[0].category,
      name: 'New Custom Master Template',
      description: 'Master template configured with locked brand guidelines and customizable location fields.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&auto=format&fit=crop&q=80',
      orientation: 'landscape',
      aspectRatio: '4:3',
      dimensions: { width: 24, height: 18, unit: 'in' },
      bleedMargin: 0.125,
      safeMargin: 0.25,
      status: 'DRAFT',
      theme: 'healthcare',
      canvasConfig: {
        backgroundColor: '#0f172a',
        bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0284c7 100%)',
      },
      layers: [
        {
          id: 'layer-title-1',
          type: 'text',
          name: 'Main Business Title',
          isEditableBySiteUser: true,
          fieldKey: 'businessName',
          label: 'Business / Branch Name',
          x: 8,
          y: 18,
          width: 80,
          height: 18,
          content: 'Apex Midtown Health & Wellness',
          style: {
            fontSize: 24,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'left',
          },
          zIndex: 2,
          isRequired: true,
        },
        {
          id: 'layer-tagline-1',
          type: 'text',
          name: 'Subhead Tagline',
          isEditableBySiteUser: true,
          fieldKey: 'tagline',
          label: 'Promotional Tagline',
          x: 8,
          y: 38,
          width: 75,
          height: 12,
          content: 'Walk-Ins Welcome • Full Prescription Services',
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: '#38bdf8',
          },
          zIndex: 2,
        },
        {
          id: 'layer-footer-ribbon',
          type: 'shape',
          name: 'Brand Security Base (Locked)',
          isEditableBySiteUser: false,
          label: 'Brand Footer Ribbon',
          x: 0,
          y: 75,
          width: 100,
          height: 25,
          content: '',
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
          },
          zIndex: 1,
        },
        {
          id: 'layer-phone-1',
          type: 'text',
          name: 'Direct Phone',
          isEditableBySiteUser: true,
          fieldKey: 'phone',
          label: 'Phone Contact',
          x: 8,
          y: 82,
          width: 45,
          height: 10,
          content: '📞 +1 (212) 555-0199',
          style: {
            fontSize: 14,
            fontWeight: 700,
            color: '#ffffff',
          },
          zIndex: 3,
        },
        {
          id: 'layer-qr-1',
          type: 'qrcode',
          name: 'Website QR Code',
          isEditableBySiteUser: true,
          fieldKey: 'website',
          label: 'Website QR Code',
          x: 78,
          y: 77,
          width: 14,
          height: 20,
          content: 'https://apexhealth.org',
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: 3,
          },
          zIndex: 3,
        },
      ],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(template.layers[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showBleedGuides, setShowBleedGuides] = useState<boolean>(true);
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'layers' | 'add' | 'canvas' | 'rules'>('layers');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const selectedLayer = template.layers.find((l) => l.id === selectedLayerId) || null;

  // Layer manipulation helpers
  const handleUpdateLayer = (id: string, updates: Partial<TemplateLayer>) => {
    setTemplate((prev) => ({
      ...prev,
      layers: prev.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  };

  const handleUpdateLayerStyle = (id: string, styleUpdates: Partial<TemplateLayer['style']>) => {
    setTemplate((prev) => ({
      ...prev,
      layers: prev.layers.map((l) =>
        l.id === id ? { ...l, style: { ...l.style, ...styleUpdates } } : l
      ),
    }));
  };

  const handleAddLayer = (type: TemplateLayerType) => {
    const newId = `layer-${Date.now()}`;
    let newLayer: TemplateLayer = {
      id: newId,
      type,
      name: `${type.toUpperCase()} Element`,
      isEditableBySiteUser: type === 'text' || type === 'logo' || type === 'qrcode',
      fieldKey: type === 'text' ? 'tagline' : type === 'logo' ? 'logo' : type === 'qrcode' ? 'website' : undefined,
      label: `New ${type.toUpperCase()}`,
      x: 20,
      y: 25,
      width: type === 'qrcode' ? 16 : type === 'logo' ? 20 : 60,
      height: type === 'qrcode' ? 20 : type === 'logo' ? 20 : 12,
      content:
        type === 'text'
          ? 'Enter your custom text here'
          : type === 'logo'
          ? 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80'
          : type === 'qrcode'
          ? 'https://apexhealth.org'
          : '',
      style: {
        fontSize: 16,
        fontWeight: 600,
        color: '#ffffff',
        backgroundColor: type === 'shape' ? '#0284c7' : type === 'qrcode' ? '#ffffff' : undefined,
        borderRadius: type === 'shape' || type === 'qrcode' ? 8 : 0,
      },
      zIndex: template.layers.length + 1,
    };

    setTemplate((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
    setSelectedLayerId(newId);
  };

  const handleDeleteLayer = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      layers: prev.layers.filter((l) => l.id !== id),
    }));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleDuplicateLayer = (id: string) => {
    const orig = template.layers.find((l) => l.id === id);
    if (!orig) return;
    const newId = `layer-${Date.now()}`;
    const clone: TemplateLayer = {
      ...JSON.parse(JSON.stringify(orig)),
      id: newId,
      name: `${orig.name} (Copy)`,
      x: Math.min(orig.x + 4, 80),
      y: Math.min(orig.y + 4, 80),
    };
    setTemplate((prev) => ({
      ...prev,
      layers: [...prev.layers, clone],
    }));
    setSelectedLayerId(newId);
  };

  const handleSave = async (publish: boolean = false) => {
    const status = publish ? 'PUBLISHED' : template.status;
    const payload = {
      ...template,
      status,
      updatedAt: new Date().toISOString(),
    };

    if (isNew) {
      const created = await createTemplate(payload);
      setSaveSuccess(`Template "${created.name}" created successfully!`);
      setTimeout(() => {
        router.push('/admin/templates');
      }, 1200);
    } else {
      await updateTemplate(template.id, payload);
      setSaveSuccess(`Template "${template.name}" updated successfully!`);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleProductChange = (prodId: string) => {
    const found = PRESET_PRODUCTS.find((p) => p.id === prodId);
    if (found) {
      setTemplate((prev) => ({
        ...prev,
        productId: found.id,
        productName: found.name,
        category: found.category,
        dimensions: { width: found.width, height: found.height, unit: found.unit },
        orientation: found.orient,
        aspectRatio: found.ratio,
      }));
    }
  };

  const editableLayersCount = template.layers.filter((l) => l.isEditableBySiteUser).length;
  const lockedLayersCount = template.layers.length - editableLayersCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', backgroundColor: '#0f172a', color: '#ffffff' }}>
      {/* 1. Studio Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          gap: '16px',
          flexWrap: 'wrap',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/admin/templates"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: template.status === 'PUBLISHED' ? '#059669' : '#d97706',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                {template.status}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 6px' }}>
              Product: <strong>{template.productName}</strong> ({template.dimensions.width}&quot; × {template.dimensions.height}&quot; {template.dimensions.unit})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saveSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <Check size={14} />
              {saveSuccess}
            </div>
          )}

          <button
            onClick={() => setIsPreviewModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Eye size={15} />
            Proof Preview
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#334155',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Save size={15} />
            Save Draft
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Sparkles size={15} />
            Publish Template
          </button>
        </div>
      </div>

      {/* 2. Main Studio Workspace (3-Column Layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 340px', flex: 1, overflow: 'hidden' }}>
        {/* LEFT COLUMN: Tool Palette & Layer Stack */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRight: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
            <button
              onClick={() => setActiveTab('layers')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '12px',
                fontWeight: 700,
                color: activeTab === 'layers' ? '#38bdf8' : '#94a3b8',
                backgroundColor: activeTab === 'layers' ? '#0f172a' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'layers' ? '2px solid #38bdf8' : 'none',
                cursor: 'pointer',
              }}
            >
              Layers ({template.layers.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '12px',
                fontWeight: 700,
                color: activeTab === 'add' ? '#38bdf8' : '#94a3b8',
                backgroundColor: activeTab === 'add' ? '#0f172a' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'add' ? '2px solid #38bdf8' : 'none',
                cursor: 'pointer',
              }}
            >
              + Add Element
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '12px',
                fontWeight: 700,
                color: activeTab === 'canvas' ? '#38bdf8' : '#94a3b8',
                backgroundColor: activeTab === 'canvas' ? '#0f172a' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'canvas' ? '2px solid #38bdf8' : 'none',
                cursor: 'pointer',
              }}
            >
              Setup
            </button>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {activeTab === 'layers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Visual Layer Stack
                  </span>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>
                    {editableLayersCount} Editable • {lockedLayersCount} Locked
                  </span>
                </div>

                {template.layers.map((layer, idx) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? '#0284c7' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        {layer.type === 'text' && <Type size={15} color={isSelected ? '#ffffff' : '#38bdf8'} />}
                        {layer.type === 'logo' && <ImageIcon size={15} color={isSelected ? '#ffffff' : '#f472b6'} />}
                        {layer.type === 'qrcode' && <QrCode size={15} color={isSelected ? '#ffffff' : '#34d399'} />}
                        {layer.type === 'shape' && <Square size={15} color={isSelected ? '#ffffff' : '#fbbf24'} />}

                        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {layer.name}
                          </div>
                          <div style={{ fontSize: '10px', color: isSelected ? '#e0f2fe' : '#94a3b8' }}>
                            {layer.isEditableBySiteUser ? (
                              <span style={{ color: isSelected ? '#bae6fd' : '#4ade80', fontWeight: 600 }}>
                                🔓 Editable ({layer.fieldKey || 'Custom'})
                              </span>
                            ) : (
                              <span style={{ color: isSelected ? '#fecdd3' : '#f87171', fontWeight: 600 }}>
                                🔒 Locked by Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateLayer(layer.id);
                          }}
                          title="Duplicate Layer"
                          style={{ background: 'none', border: 'none', color: isSelected ? '#ffffff' : '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLayer(layer.id);
                          }}
                          title="Delete Layer"
                          style={{ background: 'none', border: 'none', color: isSelected ? '#ffffff' : '#f87171', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'add' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Insert New Component
                </span>

                <button
                  onClick={() => handleAddLayer('text')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Type size={18} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Add Text Block</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Headline, body, or contact field</div>
                  </div>
                </button>

                <button
                  onClick={() => handleAddLayer('logo')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(244, 114, 182, 0.1)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <ImageIcon size={18} color="#f472b6" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Logo / Image Placeholder</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Allow branch logo upload</div>
                  </div>
                </button>

                <button
                  onClick={() => handleAddLayer('qrcode')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <QrCode size={18} color="#34d399" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Dynamic QR Code</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Scannable link for websites</div>
                  </div>
                </button>

                <button
                  onClick={() => handleAddLayer('shape')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Square size={18} color="#fbbf24" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Brand Shape / Frame</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Background card or accent bar</div>
                  </div>
                </button>
              </div>
            )}

            {activeTab === 'canvas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Product & Dimensions Setup
                </span>

                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Target Print Product
                  </label>
                  <select
                    value={template.productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: '1px solid #334155',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  >
                    {PRESET_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Design Theme
                  </label>
                  <select
                    value={template.theme}
                    onChange={(e) => setTemplate({ ...template, theme: e.target.value as TemplateTheme })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: '1px solid #334155',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  >
                    <option value="healthcare">Healthcare & Clinical</option>
                    <option value="corporate">Corporate & Enterprise</option>
                    <option value="modern">Modern Vibrant</option>
                    <option value="promotional">Retail & Promotional</option>
                    <option value="minimalist">Minimalist Luxury</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Canvas Background Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={template.canvasConfig.backgroundColor}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          canvasConfig: { ...template.canvasConfig, backgroundColor: e.target.value },
                        })
                      }
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={template.canvasConfig.backgroundColor}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          canvasConfig: { ...template.canvasConfig, backgroundColor: e.target.value },
                        })
                      }
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #334155',
                        fontSize: '12px',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Interactive WYSIWYG Print Canvas */}
        <div
          style={{
            backgroundColor: '#090d16',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'auto',
            padding: '40px',
          }}
        >
          {/* Canvas Controls Floating Bar */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 50))}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              <ZoomIn size={16} />
            </button>
            <div style={{ width: '1px', height: '14px', backgroundColor: '#475569' }} />
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showBleedGuides}
                onChange={(e) => setShowBleedGuides(e.target.checked)}
              />
              <span style={{ color: '#f87171' }}>Bleed Guide</span>
            </label>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showSafeGuides}
                onChange={(e) => setShowSafeGuides(e.target.checked)}
              />
              <span style={{ color: '#4ade80' }}>Safe Area</span>
            </label>
          </div>

          {/* Actual Scaled Print Canvas */}
          <div
            style={{
              position: 'relative',
              width: template.orientation === 'portrait' ? '420px' : '580px',
              aspectRatio: template.aspectRatio.replace(':', ' / '),
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease',
              borderRadius: '6px',
              backgroundColor: template.canvasConfig.backgroundColor,
              backgroundImage: template.canvasConfig.bgGradient || 'none',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Bleed Margin Overlay */}
            {showBleedGuides && (
              <div
                style={{
                  position: 'absolute',
                  inset: '4px',
                  border: '1.5px dashed rgba(248, 113, 113, 0.6)',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '4px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#f87171',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                  }}
                >
                  BLEED (0.125&quot;)
                </span>
              </div>
            )}

            {/* Safe Margin Overlay */}
            {showSafeGuides && (
              <div
                style={{
                  position: 'absolute',
                  inset: '16px',
                  border: '1.5px dashed rgba(74, 222, 128, 0.6)',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '4px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#4ade80',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                  }}
                >
                  SAFE AREA
                </span>
              </div>
            )}

            {/* Rendered Layers */}
            {template.layers.map((layer) => {
              const isSelected = selectedLayerId === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLayerId(layer.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    width: `${layer.width}%`,
                    height: `${layer.height}%`,
                    zIndex: layer.zIndex || 1,
                    cursor: 'pointer',
                    outline: isSelected
                      ? '2px solid #38bdf8'
                      : layer.isEditableBySiteUser
                      ? '1px dashed rgba(74, 222, 128, 0.4)'
                      : 'none',
                    boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                    backgroundColor: layer.style.backgroundColor || 'transparent',
                    borderColor: layer.style.borderColor || 'transparent',
                    borderWidth: layer.style.borderWidth ? `${layer.style.borderWidth}px` : 0,
                    borderRadius: layer.style.borderRadius ? `${layer.style.borderRadius}px` : 0,
                    opacity: layer.style.opacity ?? 1,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: layer.type === 'text' ? 'flex-start' : 'center',
                    justifyContent: layer.type === 'qrcode' ? 'center' : 'flex-start',
                    padding: layer.style.padding ? `${layer.style.padding}px` : '4px',
                    userSelect: 'none',
                  }}
                >
                  {/* Lock / Editable Tag on Selected Layer */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-18px',
                        left: '0',
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: layer.isEditableBySiteUser ? '#059669' : '#e11d48',
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {layer.isEditableBySiteUser ? <Unlock size={10} /> : <Lock size={10} />}
                      {layer.isEditableBySiteUser ? `EDITABLE: ${layer.fieldKey}` : 'LOCKED BY ADMIN'}
                    </div>
                  )}

                  {layer.type === 'text' && (
                    <div
                      style={{
                        fontSize: `${layer.style.fontSize || 14}px`,
                        fontWeight: layer.style.fontWeight || 600,
                        color: layer.style.color || '#ffffff',
                        textAlign: layer.style.textAlign || 'left',
                        letterSpacing: layer.style.letterSpacing ? `${layer.style.letterSpacing}px` : 'normal',
                        lineHeight: layer.style.lineHeight || 1.3,
                        textTransform: layer.style.textTransform || 'none',
                        width: '100%',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {layer.content}
                    </div>
                  )}

                  {layer.type === 'logo' && (
                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'inherit' }}>
                      <Image
                        src={layer.content || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80'}
                        alt="Logo Layer"
                        fill
                        unoptimized
                        style={{ objectFit: 'contain', borderRadius: 'inherit' }}
                      />
                    </div>
                  )}

                  {layer.type === 'qrcode' && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                        borderRadius: 'inherit',
                        padding: '4px',
                      }}
                    >
                      <QrCode size={36} color="#0f172a" />
                      <span style={{ fontSize: '7px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        SCAN ME
                      </span>
                    </div>
                  )}

                  {layer.type === 'badge' && (
                    <div
                      style={{
                        fontSize: `${layer.style.fontSize || 11}px`,
                        fontWeight: layer.style.fontWeight || 800,
                        color: layer.style.color || '#ffffff',
                        letterSpacing: layer.style.letterSpacing || 1,
                        textTransform: layer.style.textTransform || 'uppercase',
                      }}
                    >
                      {layer.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Layer Rules & Styling Inspector */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderLeft: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '16px',
            gap: '16px',
          }}
        >
          {selectedLayer ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Layer Properties
                </span>
                <input
                  type="text"
                  value={selectedLayer.name}
                  onChange={(e) => handleUpdateLayer(selectedLayer.id, { name: e.target.value })}
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: '1px solid #334155',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* ─── ADMIN RULES CONFIGURATOR ─── */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: selectedLayer.isEditableBySiteUser
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                  border: selectedLayer.isEditableBySiteUser
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {selectedLayer.isEditableBySiteUser ? (
                      <Unlock size={16} color="#34d399" />
                    ) : (
                      <Lock size={16} color="#f87171" />
                    )}
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
                      Site User Permission Rule
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedLayer.isEditableBySiteUser}
                    onChange={(e) =>
                      handleUpdateLayer(selectedLayer.id, { isEditableBySiteUser: e.target.checked })
                    }
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  {selectedLayer.isEditableBySiteUser
                    ? 'Site Users CAN customize this content during the ordering flow. The design layout remains locked.'
                    : 'LOCKED BY ADMIN: Site Users CANNOT modify this text, position, typography, or styling.'}
                </p>

                {selectedLayer.isEditableBySiteUser && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                      Map to Permitted Field Key
                    </label>
                    <select
                      value={selectedLayer.fieldKey || ''}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { fieldKey: e.target.value as TemplateFieldKey })
                      }
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #334155',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {FIELD_KEY_OPTIONS.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label} ({opt.key})
                        </option>
                      ))}
                    </select>

                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                      Form Input Label
                    </label>
                    <input
                      type="text"
                      value={selectedLayer.label}
                      onChange={(e) => handleUpdateLayer(selectedLayer.id, { label: e.target.value })}
                      placeholder="e.g. Branch Phone Number"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #334155',
                        fontSize: '12px',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Layer Content Edit */}
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Default Template Content
                </label>
                {selectedLayer.type === 'text' ? (
                  <textarea
                    value={selectedLayer.content}
                    onChange={(e) => handleUpdateLayer(selectedLayer.id, { content: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: '1px solid #334155',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={selectedLayer.content}
                    onChange={(e) => handleUpdateLayer(selectedLayer.id, { content: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: '1px solid #334155',
                      fontSize: '12px',
                    }}
                  />
                )}
              </div>

              {/* Typography & Color Styling */}
              {selectedLayer.type === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Typography & Color
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: '#94a3b8' }}>Font Size (px)</label>
                      <input
                        type="number"
                        value={selectedLayer.style.fontSize || 14}
                        onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { fontSize: Number(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: '1px solid #334155',
                          fontSize: '12px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#94a3b8' }}>Font Weight</label>
                      <select
                        value={selectedLayer.style.fontWeight || 600}
                        onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { fontWeight: Number(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: '1px solid #334155',
                          fontSize: '12px',
                        }}
                      >
                        <option value={400}>Regular (400)</option>
                        <option value={600}>Semi-Bold (600)</option>
                        <option value={700}>Bold (700)</option>
                        <option value={800}>Extra Bold (800)</option>
                        <option value={900}>Black (900)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Text Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={selectedLayer.style.color || '#ffffff'}
                        onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { color: e.target.value })}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={selectedLayer.style.color || '#ffffff'}
                        onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { color: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: '1px solid #334155',
                          fontSize: '12px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Geometry Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Position & Size (%)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>X Position (%)</label>
                    <input
                      type="number"
                      value={selectedLayer.x}
                      onChange={(e) => handleUpdateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', backgroundColor: '#0f172a', color: '#ffffff', border: '1px solid #334155', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Y Position (%)</label>
                    <input
                      type="number"
                      value={selectedLayer.y}
                      onChange={(e) => handleUpdateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', backgroundColor: '#0f172a', color: '#ffffff', border: '1px solid #334155', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Width (%)</label>
                    <input
                      type="number"
                      value={selectedLayer.width}
                      onChange={(e) => handleUpdateLayer(selectedLayer.id, { width: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', backgroundColor: '#0f172a', color: '#ffffff', border: '1px solid #334155', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Height (%)</label>
                    <input
                      type="number"
                      value={selectedLayer.height}
                      onChange={(e) => handleUpdateLayer(selectedLayer.id, { height: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', backgroundColor: '#0f172a', color: '#ffffff', border: '1px solid #334155', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 0' }}>
              <Sliders size={28} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p style={{ fontSize: '13px', margin: 0 }}>Select a layer on the canvas or from the layer stack to edit its properties & rules.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Live Proof Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '20px',
                border: '1px solid #334155',
                padding: '24px',
                maxWidth: '750px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Print Proof Verification</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    {template.name} • {template.dimensions.width}&quot; × {template.dimensions.height}&quot; {template.category}
                  </p>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Close
                </button>
              </div>

              {/* Scaled Preview */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: template.aspectRatio.replace(':', ' / '),
                  backgroundColor: template.canvasConfig.backgroundColor,
                  backgroundImage: template.canvasConfig.bgGradient || 'none',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                }}
              >
                {template.layers.map((layer) => (
                  <div
                    key={layer.id}
                    style={{
                      position: 'absolute',
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: `${layer.width}%`,
                      height: `${layer.height}%`,
                      zIndex: layer.zIndex || 1,
                      backgroundColor: layer.style.backgroundColor || 'transparent',
                      borderRadius: layer.style.borderRadius ? `${layer.style.borderRadius}px` : 0,
                      opacity: layer.style.opacity ?? 1,
                      display: 'flex',
                      alignItems: layer.type === 'text' ? 'flex-start' : 'center',
                      justifyContent: layer.type === 'qrcode' ? 'center' : 'flex-start',
                      padding: layer.style.padding ? `${layer.style.padding}px` : '4px',
                    }}
                  >
                    {layer.type === 'text' && (
                      <div
                        style={{
                          fontSize: `${layer.style.fontSize || 14}px`,
                          fontWeight: layer.style.fontWeight || 600,
                          color: layer.style.color || '#ffffff',
                          textAlign: layer.style.textAlign || 'left',
                          lineHeight: layer.style.lineHeight || 1.3,
                          width: '100%',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {layer.content}
                      </div>
                    )}
                    {layer.type === 'logo' && (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image src={layer.content} alt="Logo" fill unoptimized style={{ objectFit: 'contain' }} />
                      </div>
                    )}
                    {layer.type === 'qrcode' && (
                      <div style={{ backgroundColor: '#ffffff', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <QrCode size={30} color="#0f172a" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8' }}>
                <span>✅ Bleed 0.125&quot; and trim margins are pre-aligned for commercial direct UV press.</span>
                <button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    handleSave(true);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Approve & Publish Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
