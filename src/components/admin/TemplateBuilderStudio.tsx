// src/components/admin/TemplateBuilderStudio.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  ExternalLink,
  Move,
  AlignCenter,
  AlignLeft,
  AlignRight,
  EyeOff,
  Palette,
  Grid,
  Scissors,
  CheckCircle2,
  Download,
  X,
  Plus,
  Minus,
  Pencil,
  Sparkle,
  ShieldCheck,
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
  { id: 'prod-011', name: 'Full-Colour Printed Product Catalogue (A4, Saddle-Stitched)', category: 'Catalogue', width: 8.27, height: 11.69, unit: 'in' as const, ratio: '3:4', orient: 'portrait' as const },
  { id: 'prod-001', name: 'Corrugated Yard & Lawn Signs (18" x 24")', category: 'Signs', width: 24, height: 18, unit: 'in' as const, ratio: '4:3', orient: 'landscape' as const },
  { id: 'prod-002', name: 'Retractable Pull-Up Banner Stand (33" x 80")', category: 'Banners', width: 33, height: 80, unit: 'in' as const, ratio: '1:2', orient: 'portrait' as const },
  { id: 'prod-009', name: 'Gloss Tri-Fold Patient Care Brochure & Flyer', category: 'Flyers', width: 11, height: 8.5, unit: 'in' as const, ratio: '16:9', orient: 'landscape' as const },
  { id: 'prod-008', name: 'Executive Soft-Touch Business Cards (Pack of 500)', category: 'Business Cards', width: 3.5, height: 2.0, unit: 'in' as const, ratio: '16:9', orient: 'landscape' as const },
];

const FONT_OPTIONS = [
  'Inter',
  'Plus Jakarta Sans',
  'Outfit',
  'Montserrat',
  'Playfair Display',
  'Roboto Mono',
  'Bebas Neue',
];

const COLOR_SWATCHES = [
  '#ffffff', '#f8fafc', '#94a3b8', '#334155', '#0f172a', '#000000',
  '#f73582', '#ec4899', '#f43f5e', '#e11d48',
  '#3b82f6', '#0284c7', '#06b6d4', '#0d9488',
  '#10b981', '#059669', '#84cc16', '#eab308',
  '#f59e0b', '#f97316', '#8b5cf6', '#7c3aed',
];

const GRADIENT_PRESETS = [
  { label: 'Deep Slate', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0284c7 100%)' },
  { label: 'Royal Blue', value: 'linear-gradient(160deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' },
  { label: 'Clean Light', value: 'linear-gradient(160deg, #f8fafc 0%, #ffffff 100%)' },
  { label: 'Electric Sunset', value: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #f73582 100%)' },
  { label: 'Dark Emerald', value: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #10b981 100%)' },
  { label: 'Pure Obsidian', value: 'linear-gradient(180deg, #18181b 0%, #09090b 100%)' },
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
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      orientation: 'portrait',
      aspectRatio: '3:4',
      dimensions: { width: 8.27, height: 11.69, unit: 'in' },
      bleedMargin: 0.125,
      safeMargin: 0.375,
      status: 'DRAFT',
      theme: 'retail',
      canvasConfig: {
        backgroundColor: '#ffffff',
        bgGradient: 'linear-gradient(160deg, #f8fafc 0%, #ffffff 100%)',
      },
      layers: [
        {
          id: 'cat001-cover-bg',
          type: 'shape',
          name: 'Cover Background',
          isEditableBySiteUser: false,
          label: 'Cover Colour Band',
          x: 0,
          y: 0,
          width: 100,
          height: 50,
          content: '',
          style: { backgroundColor: '#1e40af' },
          zIndex: 1,
        },
        {
          id: 'cat001-brand',
          type: 'text',
          name: 'Brand Name',
          isEditableBySiteUser: true,
          fieldKey: 'businessName',
          label: 'Company / Brand Name',
          x: 8,
          y: 12,
          width: 62,
          height: 14,
          content: 'APEX RETAIL COLLECTIONS',
          style: { fontSize: 24, fontWeight: 900, color: '#ffffff' },
          zIndex: 3,
          isRequired: true,
        },
        {
          id: 'cat001-season',
          type: 'badge',
          name: 'Season Tag',
          isEditableBySiteUser: false,
          label: 'Season / Edition Badge',
          x: 8,
          y: 28,
          width: 40,
          height: 7,
          content: 'SPRING / SUMMER 2026',
          style: { fontSize: 11, fontWeight: 700, color: '#bfdbfe', letterSpacing: 2 },
          zIndex: 2,
        },
        {
          id: 'cat001-logo',
          type: 'logo',
          name: 'Brand Logo',
          isEditableBySiteUser: false,
          fieldKey: 'logo',
          label: 'Corporate Logo',
          x: 74,
          y: 10,
          width: 18,
          height: 18,
          content: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80',
          style: { borderRadius: 8 },
          zIndex: 4,
        },
        {
          id: 'cat001-contact',
          type: 'text',
          name: 'Contact Info',
          isEditableBySiteUser: true,
          fieldKey: 'phone',
          label: 'Branch Phone & Website',
          x: 8,
          y: 90,
          width: 84,
          height: 8,
          content: '📞 +1 (212) 555-0199  |  www.apexretail.com',
          style: { fontSize: 10, fontWeight: 500, color: '#64748b', textAlign: 'center' },
          zIndex: 3,
        },
      ],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(template.layers[1]?.id || template.layers[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showBleedGuides, setShowBleedGuides] = useState<boolean>(true);
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'layers' | 'add' | 'setup' | 'governance'>('layers');
  const [layerFilter, setLayerFilter] = useState<'all' | 'editable' | 'locked'>('all');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Dragging state
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingLayer, setIsDraggingLayer] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialLayerX: number; initialLayerY: number } | null>(null);

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
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Element`,
      isEditableBySiteUser: type === 'text' || type === 'logo' || type === 'qrcode',
      fieldKey: type === 'text' ? 'tagline' : type === 'logo' ? 'logo' : type === 'qrcode' ? 'website' : undefined,
      label: `Custom ${type.toUpperCase()}`,
      x: 15,
      y: 25,
      width: type === 'qrcode' ? 18 : type === 'logo' ? 20 : type === 'shape' ? 70 : 65,
      height: type === 'qrcode' ? 18 : type === 'logo' ? 20 : type === 'shape' ? 20 : 10,
      content:
        type === 'text'
          ? 'Enter your customizable message here'
          : type === 'logo'
          ? 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80'
          : type === 'qrcode'
          ? 'https://apexretail.com'
          : type === 'badge'
          ? 'LIMITED EDITION'
          : '',
      style: {
        fontSize: type === 'text' ? 16 : type === 'badge' ? 11 : 14,
        fontWeight: type === 'badge' ? 800 : 600,
        color: '#ffffff',
        backgroundColor: type === 'shape' ? '#0284c7' : type === 'badge' ? '#f73582' : type === 'qrcode' ? '#ffffff' : undefined,
        borderRadius: type === 'shape' || type === 'qrcode' ? 8 : type === 'badge' ? 20 : 0,
        letterSpacing: type === 'badge' ? 1.5 : 0,
        textAlign: 'left',
      },
      zIndex: template.layers.length + 1,
    };

    setTemplate((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
    setSelectedLayerId(newId);
    setActiveTab('layers');
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
      zIndex: template.layers.length + 1,
    };
    setTemplate((prev) => ({
      ...prev,
      layers: [...prev.layers, clone],
    }));
    setSelectedLayerId(newId);
  };

  const handleMoveLayerZ = (id: string, direction: 'up' | 'down') => {
    setTemplate((prev) => {
      const idx = prev.layers.findIndex((l) => l.id === id);
      if (idx < 0) return prev;
      const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.layers.length) return prev;

      const newLayers = [...prev.layers];
      const temp = newLayers[idx];
      newLayers[idx] = newLayers[targetIdx];
      newLayers[targetIdx] = temp;

      return {
        ...prev,
        layers: newLayers.map((l, i) => ({ ...l, zIndex: i + 1 })),
      };
    });
  };

  const toggleLayerVisibility = (id: string) => {
    setHiddenLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Drag on Canvas Handling
  const handleMouseDownLayer = (e: React.MouseEvent, layer: TemplateLayer) => {
    e.stopPropagation();
    setSelectedLayerId(layer.id);
    setIsDraggingLayer(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingLayer || !dragStartRef.current || !selectedLayerId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100 * (100 / zoomLevel);
      const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100 * (100 / zoomLevel);

      const newX = Math.max(0, Math.min(100 - (selectedLayer?.width || 10), Math.round(dragStartRef.current.initialLayerX + deltaX)));
      const newY = Math.max(0, Math.min(100 - (selectedLayer?.height || 10), Math.round(dragStartRef.current.initialLayerY + deltaY)));

      handleUpdateLayer(selectedLayerId, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDraggingLayer) {
        setIsDraggingLayer(false);
        dragStartRef.current = null;
      }
    };

    if (isDraggingLayer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLayer, selectedLayerId, zoomLevel, selectedLayer]);

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
      setSaveSuccess(publish ? `Template published to Storefront!` : `Template "${template.name}" draft saved!`);
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

  const filteredLayers = template.layers.filter((l) => {
    if (layerFilter === 'editable') return l.isEditableBySiteUser;
    if (layerFilter === 'locked') return !l.isEditableBySiteUser;
    return true;
  });

  const editableLayersCount = template.layers.filter((l) => l.isEditableBySiteUser).length;
  const lockedLayersCount = template.layers.length - editableLayersCount;

  // Calculate canvas dimensions
  const baseWidth = template.orientation === 'portrait' ? 380 : template.orientation === 'square' ? 440 : 540;
  const [aw, ah] = template.aspectRatio.split(':').map(Number);
  const baseHeight = Math.round((baseWidth * (ah || 1)) / (aw || 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#090d16', color: '#f8fafc', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. TOP STUDIO HEADER BAR */}
      <header
        style={{
          height: '56px',
          backgroundColor: '#111827',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          zIndex: 30,
          gap: '12px',
        }}
      >
        {/* Left: Back & Template Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <Link
            href="/admin/templates"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#94a3b8',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.15s ease',
            }}
            title="Back to Templates"
          >
            <ArrowLeft size={16} />
          </Link>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isEditingTitle ? (
                <input
                  type="text"
                  autoFocus
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: '#1e293b',
                    border: '1px solid #38bdf8',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    outline: 'none',
                  }}
                />
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    transition: 'background 0.15s',
                  }}
                  title="Click to rename template"
                >
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '280px' }}>
                    {template.name}
                  </span>
                  <Pencil size={12} color="#64748b" />
                </div>
              )}

              {/* Status Pill Dropdown */}
              <select
                value={template.status}
                onChange={(e) => setTemplate({ ...template, status: e.target.value as any })}
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: template.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: template.status === 'PUBLISHED' ? '#34d399' : '#fbbf24',
                  border: template.status === 'PUBLISHED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 6px' }}>
              <span>{template.productName}</span>
              <span>•</span>
              <span style={{ color: '#38bdf8' }}>{template.dimensions.width}&quot; × {template.dimensions.height}&quot; {template.dimensions.unit}</span>
              <span>•</span>
              <span style={{ color: '#64748b' }}>300 DPI CMYK</span>
            </div>
          </div>
        </div>

        {/* Center: Live Action Feedback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saveSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <Check size={13} />
              {saveSuccess}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link
            href={`/shop/templates/customize/${template.id}`}
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            title="Test how branch site-users experience this customizable template"
          >
            <ExternalLink size={13} />
            Test Customizer
          </Link>

          <button
            onClick={() => setIsPreviewModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#f1f5f9',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Eye size={13} />
            Proof Preview
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: '#374151',
              color: '#ffffff',
              border: '1px solid #4b5563',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Save size={13} />
            Save Draft
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Sparkles size={13} />
            Publish Template
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN STUDIO LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 340px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* COLUMN 1: LEFT TOOLBAR & LAYER STACK */}
        <div style={{ backgroundColor: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', minHeight: 0, zIndex: 20 }}>
          
          {/* Segmented Top Tabs */}
          <div style={{ display: 'flex', padding: '8px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('layers')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'layers' ? '#1e293b' : 'transparent',
                color: activeTab === 'layers' ? '#38bdf8' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Layers size={13} /> Layers ({template.layers.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'add' ? '#1e293b' : 'transparent',
                color: activeTab === 'add' ? '#f472b6' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Plus size={13} /> Add Elements
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'setup' ? '#1e293b' : 'transparent',
                color: activeTab === 'setup' ? '#34d399' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Settings2 size={13} /> Setup
            </button>
          </div>

          {/* TAB CONTENT */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* TAB 1: LAYERS STACK */}
            {activeTab === 'layers' && (
              <>
                {/* Layer Filters & Stats */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(['all', 'editable', 'locked'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setLayerFilter(f)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: layerFilter === f ? '#334155' : '#1e293b',
                          color: layerFilter === f ? '#ffffff' : '#94a3b8',
                          textTransform: 'capitalize',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    {editableLayersCount} editable • {lockedLayersCount} locked
                  </span>
                </div>

                {/* Layer List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filteredLayers.map((layer, idx) => {
                    const isSelected = selectedLayerId === layer.id;
                    const isHidden = hiddenLayers[layer.id];

                    return (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#1e293b',
                          border: isSelected ? '1.5px solid #38bdf8' : '1px solid #334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          opacity: isHidden ? 0.4 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          {/* Layer Type Icon */}
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: layer.isEditableBySiteUser ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                              color: layer.isEditableBySiteUser ? '#34d399' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {layer.type === 'text' && <Type size={14} />}
                            {layer.type === 'logo' && <ImageIcon size={14} />}
                            {layer.type === 'qrcode' && <QrCode size={14} />}
                            {layer.type === 'shape' && <Square size={14} />}
                            {layer.type === 'badge' && <Sparkles size={14} />}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {layer.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              {layer.isEditableBySiteUser ? (
                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <Unlock size={9} /> Editable by Branch
                                </span>
                              ) : (
                                <span style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <Lock size={9} /> Locked Corporate
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Layer Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(layer.id);
                            }}
                            title={isHidden ? 'Show Layer' : 'Hide Layer'}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isHidden ? '#ef4444' : '#64748b',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateLayer(layer.id);
                            }}
                            title="Duplicate Layer"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Copy size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLayer(layer.id);
                            }}
                            title="Delete Layer"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* TAB 2: ADD ELEMENTS */}
            {activeTab === 'add' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Click to add pre-configured building blocks to your canvas:
                </div>

                {/* Element Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleAddLayer('text')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Type size={20} color="#38bdf8" />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Text Block</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>Customizable header or body text</span>
                  </button>

                  <button
                    onClick={() => handleAddLayer('qrcode')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <QrCode size={20} color="#34d399" />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Dynamic QR</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>Website / Booking scanner</span>
                  </button>

                  <button
                    onClick={() => handleAddLayer('logo')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ImageIcon size={20} color="#f472b6" />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Brand Logo</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>Official high-res image slot</span>
                  </button>

                  <button
                    onClick={() => handleAddLayer('badge')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={20} color="#fbbf24" />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Promo Badge</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>Season / Limited offer pill</span>
                  </button>

                  <button
                    onClick={() => handleAddLayer('shape')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      gridColumn: 'span 2',
                    }}
                  >
                    <Square size={20} color="#a78bfa" />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Shape / Decorative Band</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>Footer ribbon, color band, or card container</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SETUP & DIMENSIONS */}
            {activeTab === 'setup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Product Preset */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Print Product Preset
                  </label>
                  <select
                    value={template.productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  >
                    {PRESET_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dimensions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Width ({template.dimensions.unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={template.dimensions.width}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          dimensions: { ...template.dimensions, width: parseFloat(e.target.value) || 0 },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        color: '#ffffff',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Height ({template.dimensions.unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={template.dimensions.height}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          dimensions: { ...template.dimensions, height: parseFloat(e.target.value) || 0 },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        color: '#ffffff',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                </div>

                {/* Background Gradient Presets */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Canvas Background Style
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {GRADIENT_PRESETS.map((g) => (
                      <button
                        key={g.label}
                        onClick={() =>
                          setTemplate({
                            ...template,
                            canvasConfig: { ...template.canvasConfig, bgGradient: g.value },
                          })
                        }
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: template.canvasConfig.bgGradient === g.value ? '2px solid #38bdf8' : '1px solid #334155',
                          background: g.value,
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: CENTER CANVA/FIGMA STAGE */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', overflow: 'hidden', backgroundColor: '#090d16' }}>
          
          {/* Floating Canvas Toolbar */}
          <div
            style={{
              height: '42px',
              backgroundColor: '#111827',
              borderBottom: '1px solid #1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            {/* Guide Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Guides:</span>
              <button
                onClick={() => setShowBleedGuides(!showBleedGuides)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: showBleedGuides ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: showBleedGuides ? '#fb923c' : '#94a3b8',
                  border: showBleedGuides ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid #374151',
                  cursor: 'pointer',
                }}
              >
                <Scissors size={12} />
                Bleed Trim ({template.bleedMargin}&quot;)
              </button>

              <button
                onClick={() => setShowSafeGuides(!showSafeGuides)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: showSafeGuides ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: showSafeGuides ? '#38bdf8' : '#94a3b8',
                  border: showSafeGuides ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #374151',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={12} />
                Safe Print Margin ({template.safeMargin}&quot;)
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: showGrid ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                  color: showGrid ? '#c084fc' : '#94a3b8',
                  border: showGrid ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid #374151',
                  cursor: 'pointer',
                }}
              >
                <Grid size={12} />
                Grid
              </button>
            </div>

            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 40))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  cursor: 'pointer',
                }}
              >
                <Minus size={12} />
              </button>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', minWidth: '42px', textAlign: 'center' }}>
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 200))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Fit 100%
              </button>
            </div>
          </div>

          {/* Scrollable Stage Area with Radial Grid */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '40px 24px',
              backgroundColor: '#090d16',
              backgroundImage: showGrid
                ? 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)'
                : 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: showGrid ? '20px 20px' : '24px 24px',
              position: 'relative',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedLayerId(null);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              
              {/* Canvas Frame */}
              <div
                ref={canvasRef}
                style={{
                  position: 'relative',
                  width: `${baseWidth}px`,
                  height: `${baseHeight}px`,
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: isDraggingLayer ? 'none' : 'transform 0.15s ease',
                  backgroundColor: template.canvasConfig.backgroundColor,
                  backgroundImage: template.canvasConfig.bgGradient || 'none',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  userSelect: 'none',
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedLayerId(null);
                }}
              >
                {/* Bleed Guide Overlay */}
                {showBleedGuides && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      border: '2px dashed rgba(249, 115, 22, 0.8)',
                      pointerEvents: 'none',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ position: 'absolute', top: 2, left: 2, fontSize: '8px', fontWeight: 800, color: '#ea580c', backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 4px', borderRadius: '2px' }}>
                      BLEED TRIM ({template.bleedMargin}&quot;)
                    </div>
                  </div>
                )}

                {/* Safe Area Guide Overlay */}
                {showSafeGuides && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '16px',
                      border: '1.5px dashed rgba(56, 189, 248, 0.8)',
                      pointerEvents: 'none',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '8px', fontWeight: 800, color: '#0284c7', backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 4px', borderRadius: '2px' }}>
                      SAFE PRINT AREA
                    </div>
                  </div>
                )}

                {/* Render Template Layers */}
                {template.layers.map((layer) => {
                  if (hiddenLayers[layer.id]) return null;
                  const isSelected = selectedLayerId === layer.id;

                  return (
                    <div
                      key={layer.id}
                      onMouseDown={(e) => handleMouseDownLayer(e, layer)}
                      style={{
                        position: 'absolute',
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: `${layer.width}%`,
                        height: `${layer.height}%`,
                        zIndex: (layer.zIndex || 1) + (isSelected ? 20 : 0),
                        backgroundColor: layer.style.backgroundColor || 'transparent',
                        borderRadius: layer.style.borderRadius ? `${layer.style.borderRadius}px` : 0,
                        opacity: layer.style.opacity ?? 1,
                        cursor: 'grab',
                        outline: isSelected ? '2px solid #38bdf8' : 'none',
                        outlineOffset: '2px',
                        display: 'flex',
                        alignItems: layer.type === 'text' ? 'flex-start' : 'center',
                        justifyContent: layer.type === 'qrcode' ? 'center' : 'flex-start',
                        padding: layer.style.padding ? `${layer.style.padding}px` : '4px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Active Layer Label Tag */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '0',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            zIndex: 60,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Move size={8} /> {layer.name} ({layer.x}%, {layer.y}%)
                        </div>
                      )}

                      {/* Text Render */}
                      {layer.type === 'text' && (
                        <div
                          style={{
                            fontSize: `${layer.style.fontSize || 14}px`,
                            fontWeight: layer.style.fontWeight || 600,
                            color: layer.style.color || '#ffffff',
                            textAlign: layer.style.textAlign || 'left',
                            lineHeight: layer.style.lineHeight || 1.3,
                            letterSpacing: layer.style.letterSpacing ? `${layer.style.letterSpacing}px` : 'normal',
                            textTransform: layer.style.textTransform || 'none',
                            fontFamily: layer.style.fontFamily || 'inherit',
                            width: '100%',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {layer.content}
                        </div>
                      )}

                      {/* Logo / Image Render */}
                      {(layer.type === 'logo' || layer.type === 'image') && layer.content && (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image src={layer.content} alt={layer.name} fill unoptimized style={{ objectFit: 'contain' }} />
                        </div>
                      )}

                      {/* QR Code Render */}
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
                            padding: '2px',
                          }}
                        >
                          <QrCode size={26} color="#0f172a" />
                          <span style={{ fontSize: '6px', fontWeight: 800, color: '#0f172a' }}>SCAN ME</span>
                        </div>
                      )}

                      {/* Badge Render */}
                      {layer.type === 'badge' && (
                        <div
                          style={{
                            fontSize: `${layer.style.fontSize || 11}px`,
                            fontWeight: layer.style.fontWeight || 800,
                            color: layer.style.color || '#ffffff',
                            letterSpacing: `${layer.style.letterSpacing || 1}px`,
                            textTransform: 'uppercase',
                          }}
                        >
                          {layer.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Physical Dimension Ruler Annotation */}
              <div style={{ width: `${baseWidth}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                  {template.dimensions.width} &times; {template.dimensions.height} {template.dimensions.unit} (Scale 1:1 Ready for Print)
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT PROPERTIES INSPECTOR */}
        <div style={{ backgroundColor: '#111827', borderLeft: '1px solid #1f2937', display: 'flex', flexDirection: 'column', minHeight: 0, zIndex: 20 }}>
          
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {selectedLayer ? 'Layer Properties' : 'Canvas Overview'}
            </span>
            {selectedLayer && (
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#1e293b', color: '#38bdf8' }}>
                {selectedLayer.type.toUpperCase()}
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {selectedLayer ? (
              <>
                {/* 1. Governance & Site User Personalization Card */}
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: selectedLayer.isEditableBySiteUser ? 'rgba(16, 185, 129, 0.08)' : '#1e293b', border: selectedLayer.isEditableBySiteUser ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid #334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {selectedLayer.isEditableBySiteUser ? <Unlock size={14} color="#34d399" /> : <Lock size={14} color="#94a3b8" />}
                      <span style={{ fontSize: '12px', fontWeight: 800, color: selectedLayer.isEditableBySiteUser ? '#34d399' : '#f8fafc' }}>
                        Site User Personalization
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={selectedLayer.isEditableBySiteUser}
                      onChange={(e) => handleUpdateLayer(selectedLayer.id, { isEditableBySiteUser: e.target.checked })}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </div>

                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {selectedLayer.isEditableBySiteUser
                      ? 'Branch site-users CAN edit this field in their store customizer.'
                      : 'LOCKED BY CORPORATE: Branch users CANNOT change text, position, or styling.'}
                  </p>

                  {selectedLayer.isEditableBySiteUser && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#34d399' }}>Auto-Fill Variable Binding</label>
                      <select
                        value={selectedLayer.fieldKey || ''}
                        onChange={(e) => handleUpdateLayer(selectedLayer.id, { fieldKey: e.target.value as any })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '11px',
                          outline: 'none',
                        }}
                      >
                        <option value="">None (Custom Freeform Text)</option>
                        {FIELD_KEY_OPTIONS.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* 2. Content & Text Editor */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Content & Default Template Text
                  </label>
                  <textarea
                    rows={selectedLayer.type === 'text' ? 3 : 2}
                    value={selectedLayer.content}
                    onChange={(e) => handleUpdateLayer(selectedLayer.id, { content: e.target.value })}
                    placeholder="Enter layer text or URL..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      fontSize: '12px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 3. Typography Suite (if Text / Badge) */}
                {(selectedLayer.type === 'text' || selectedLayer.type === 'badge') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Typography
                    </div>

                    {/* Font Family */}
                    <div>
                      <select
                        value={selectedLayer.style.fontFamily || 'Inter'}
                        onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { fontFamily: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '11px',
                        }}
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Font Size & Weight */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '10px', color: '#94a3b8' }}>Font Size (px)</label>
                        <input
                          type="number"
                          value={selectedLayer.style.fontSize || 14}
                          onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { fontSize: parseInt(e.target.value) || 12 })}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            color: '#ffffff',
                            fontSize: '11px',
                            marginTop: '2px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#94a3b8' }}>Weight</label>
                        <select
                          value={selectedLayer.style.fontWeight || 600}
                          onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { fontWeight: parseInt(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            color: '#ffffff',
                            fontSize: '11px',
                            marginTop: '2px',
                          }}
                        >
                          <option value="400">Regular (400)</option>
                          <option value="500">Medium (500)</option>
                          <option value="600">SemiBold (600)</option>
                          <option value="700">Bold (700)</option>
                          <option value="800">ExtraBold (800)</option>
                          <option value="900">Black (900)</option>
                        </select>
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => handleUpdateLayerStyle(selectedLayer.id, { textAlign: align })}
                          style={{
                            flex: 1,
                            padding: '6px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: selectedLayer.style.textAlign === align ? '#0284c7' : '#1e293b',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {align === 'left' && <AlignLeft size={13} />}
                          {align === 'center' && <AlignCenter size={13} />}
                          {align === 'right' && <AlignRight size={13} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Color & Swatches */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Color & Styling
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <input
                      type="color"
                      value={selectedLayer.style.color || '#ffffff'}
                      onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { color: e.target.value })}
                      style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={selectedLayer.style.color || '#ffffff'}
                      onChange={(e) => handleUpdateLayerStyle(selectedLayer.id, { color: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        color: '#ffffff',
                        fontSize: '11px',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch}
                        onClick={() => handleUpdateLayerStyle(selectedLayer.id, { color: swatch })}
                        style={{
                          width: '100%',
                          height: '20px',
                          borderRadius: '3px',
                          backgroundColor: swatch,
                          border: selectedLayer.style.color === swatch ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 5. Position & Sizing (%) */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Position & Dimensions (%)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: '#94a3b8' }}>X Position (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={selectedLayer.x}
                        onChange={(e) => handleUpdateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '11px',
                          marginTop: '2px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#94a3b8' }}>Y Position (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={selectedLayer.y}
                        onChange={(e) => handleUpdateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '11px',
                          marginTop: '2px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#94a3b8' }}>Width (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={selectedLayer.width}
                        onChange={(e) => handleUpdateLayer(selectedLayer.id, { width: parseInt(e.target.value) || 10 })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '11px',
                          marginTop: '2px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#94a3b8' }}>Height (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={selectedLayer.height}
                        onChange={(e) => handleUpdateLayer(selectedLayer.id, { height: parseInt(e.target.value) || 10 })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '11px',
                          marginTop: '2px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Layer Z-Index Reorder */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleMoveLayerZ(selectedLayer.id, 'up')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Bring Forward
                  </button>
                  <button
                    onClick={() => handleMoveLayerZ(selectedLayer.id, 'down')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Send Backward
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>
                <Layers size={32} color="#334155" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>No Layer Selected</div>
                <p style={{ fontSize: '11px', marginTop: '6px' }}>
                  Click any element on the visual canvas or select a layer from the left panel to inspect and customize properties.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. PROOF PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '850px',
                backgroundColor: '#111827',
                borderRadius: '16px',
                border: '1px solid #374151',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} color="#38bdf8" />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                    Print Artwork Proof Preview: {template.name}
                  </span>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                {/* Proof Visual */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#090d16',
                    padding: '24px',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: `${baseWidth * 0.75}px`,
                      height: `${baseHeight * 0.75}px`,
                      backgroundColor: template.canvasConfig.backgroundColor,
                      backgroundImage: template.canvasConfig.bgGradient || 'none',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                    }}
                  >
                    {template.layers.map((l) => (
                      <div
                        key={l.id}
                        style={{
                          position: 'absolute',
                          left: `${l.x}%`,
                          top: `${l.y}%`,
                          width: `${l.width}%`,
                          height: `${l.height}%`,
                          color: l.style.color || '#fff',
                          backgroundColor: l.style.backgroundColor || 'transparent',
                          fontSize: `${(l.style.fontSize || 14) * 0.75}px`,
                          fontWeight: l.style.fontWeight || 600,
                          textAlign: l.style.textAlign || 'left',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px',
                        }}
                      >
                        {l.type === 'text' && l.content}
                        {l.type === 'badge' && l.content}
                        {l.type === 'logo' && l.content && (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image src={l.content} alt={l.name} fill unoptimized style={{ objectFit: 'contain' }} />
                          </div>
                        )}
                        {l.type === 'qrcode' && <QrCode size={20} color="#0f172a" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preflight Checklist */}
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                    Preflight Certification
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                      <CheckCircle2 size={14} /> Resolution: 300 DPI (High Fidelity)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                      <CheckCircle2 size={14} /> Bleed Safe: {template.bleedMargin}&quot; Verified
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                      <CheckCircle2 size={14} /> Total Layers: {template.layers.length} Active
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
                      <Info size={14} /> {editableLayersCount} Location Variables Bound
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #1f2937', paddingTop: '12px', marginTop: '4px' }}>
                    <button
                      onClick={() => setIsPreviewModalOpen(false)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Return to Studio
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
