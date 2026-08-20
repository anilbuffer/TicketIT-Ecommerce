// src/components/shop/TemplateCustomizerStudio.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Unlock,
  Check,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  Type,
  Eye,
  ShoppingBag,
  FileText,
  Building2,
  ShieldCheck,
  RotateCcw,
  Sliders,
  ZoomIn,
  ZoomOut,
  Info,
  Maximize2,
} from 'lucide-react';
import type {
  PrintTemplate,
  TemplateLayer,
  TemplateFieldKey,
  ProductSizeOption,
  ProductMaterialOption,
  ProductFinishOption,
} from '@/lib/services/types';
import { useAuth } from '@/context/AuthContext';

interface TemplateCustomizerStudioProps {
  template: PrintTemplate;
}

export function TemplateCustomizerStudio({ template }: TemplateCustomizerStudioProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Initialize customized values from template default or user site profile
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.layers.forEach((layer) => {
      if (layer.isEditableBySiteUser && layer.fieldKey) {
        if (layer.fieldKey === 'businessName') {
          initial[layer.fieldKey] = user?.siteName || layer.content;
        } else if (layer.fieldKey === 'contactName') {
          initial[layer.fieldKey] = user?.name || layer.content;
        } else if (layer.fieldKey === 'email') {
          initial[layer.fieldKey] = user?.email || layer.content;
        } else {
          initial[layer.fieldKey] = layer.content;
        }
      }
    });
    return initial;
  });

  const [activeViewMode, setActiveViewMode] = useState<'proof' | 'mockup'>('proof');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(true);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  // Specifications configuration before PO
  const [selectedQuantity, setSelectedQuantity] = useState<number>(10);
  const [selectedSize, setSelectedSize] = useState<string>('Standard');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Standard 4mm Coroplast');
  const [selectedFinish, setSelectedFinish] = useState<string>('Double-Sided UV Print');

  const handleFieldChange = (key: string, value: string) => {
    setCustomValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProceedToPO = () => {
    // Save customization payload to session/local storage for PO generator
    const poPayload = {
      templateId: template.id,
      templateName: template.name,
      productId: template.productId,
      productName: template.productName,
      category: template.category,
      customValues,
      selectedQuantity,
      selectedSize,
      selectedMaterial,
      selectedFinish,
      dimensions: template.dimensions,
      aspectRatio: template.aspectRatio,
      canvasConfig: template.canvasConfig,
      layers: template.layers,
      timestamp: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('TICKETIT_CURRENT_PO_CUSTOMIZATION', JSON.stringify(poPayload));
    }

    router.push('/shop/po/create');
  };

  const editableLayers = template.layers.filter((l) => l.isEditableBySiteUser);
  const lockedLayers = template.layers.filter((l) => !l.isEditableBySiteUser);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* 1. Top Navigation & Workflow Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/shop/templates"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#fdf2f8',
                  color: '#f73582',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                Step 6: Personalize Content
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {template.category} • {template.dimensions.width}&quot; × {template.dimensions.height}&quot; {template.dimensions.unit}
              </span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
              {template.name}
            </h1>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>
              Payment Rule:
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
              Billed on Head Office Corporate Statement
            </span>
          </div>

          <button
            onClick={handleProceedToPO}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: '#f73582',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(247, 53, 130, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            <FileText size={16} />
            Review & Create Purchase Order (PO)
          </button>
        </div>
      </div>

      {/* 2. Workspace: Form Personalizer + Live WYSIWYG Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
        {/* LEFT COLUMN: Personalize Permitted Fields */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Brand Lock Policy Card */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
              <strong>Brand Protection Active:</strong> Overall design layout, corporate typography, and print-safe bleed margins are locked by Brand Admin. Customize your local branch information below.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Branch Customization Fields
            </h3>

            {editableLayers.map((layer) => {
              const fieldKey = layer.fieldKey || layer.id;
              const currentValue = customValues[fieldKey] ?? layer.content;

              if (layer.type === 'logo') {
                return (
                  <div key={layer.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                      {layer.label || 'Branch Brand Logo'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          border: '1.5px dashed #cbd5e1',
                          position: 'relative',
                          backgroundColor: '#f8fafc',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {currentValue ? (
                          <Image src={currentValue} alt="Logo" fill unoptimized style={{ objectFit: 'contain' }} />
                        ) : (
                          <ImageIcon size={20} color="#94a3b8" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newUrl = window.prompt('Enter image URL or select brand asset:', currentValue);
                            if (newUrl) handleFieldChange(fieldKey, newUrl);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Change Logo Image
                        </button>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                          Approved PNG/SVG with transparent background
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (layer.type === 'qrcode') {
                return (
                  <div key={layer.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <QrCode size={14} color="#f73582" />
                      {layer.label || 'Website URL (Auto-Generated QR Code)'}
                    </label>
                    <input
                      type="url"
                      value={currentValue}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      placeholder="https://apexhealth.org/midtown"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#f8fafc',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Scannable QR code updates dynamically on your artwork.
                    </span>
                  </div>
                );
              }

              return (
                <div key={layer.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                    {layer.label || layer.name}
                    {layer.isRequired && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                  </label>
                  {layer.height > 15 ? (
                    <textarea
                      rows={3}
                      value={currentValue}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      placeholder={layer.helperText || 'Enter content...'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#f8fafc',
                        outline: 'none',
                        lineHeight: 1.4,
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      placeholder={layer.helperText || 'Enter content...'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#f8fafc',
                        outline: 'none',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Locked Elements Summary */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Lock size={13} color="#94a3b8" />
              Locked Master Brand Elements ({lockedLayers.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {lockedLayers.map((l) => (
                <span
                  key={l.id}
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  🔒 {l.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive WYSIWYG Preview Canvas & Mockups */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* View Mode Switcher Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
              <button
                onClick={() => setActiveViewMode('proof')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeViewMode === 'proof' ? '#ffffff' : 'transparent',
                  color: activeViewMode === 'proof' ? '#0f172a' : '#64748b',
                  boxShadow: activeViewMode === 'proof' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <FileText size={14} />
                Print Proof View
              </button>

              <button
                onClick={() => setActiveViewMode('mockup')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeViewMode === 'mockup' ? '#ffffff' : 'transparent',
                  color: activeViewMode === 'mockup' ? '#0f172a' : '#64748b',
                  boxShadow: activeViewMode === 'mockup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Eye size={14} />
                Realistic 3D Environment
              </button>
            </div>

            {activeViewMode === 'proof' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={showSafeGuides}
                    onChange={(e) => setShowSafeGuides(e.target.checked)}
                  />
                  <span>Show Safe/Trim Margin</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 8px' }}>
                  <button onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <ZoomOut size={14} />
                  </button>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', minWidth: '35px', textAlign: 'center' }}>{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Display Area */}
          <div
            style={{
              backgroundColor: activeViewMode === 'proof' ? '#1e293b' : '#f1f5f9',
              borderRadius: '16px',
              minHeight: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {activeViewMode === 'proof' ? (
              /* High-Res Proof WYSIWYG Canvas */
              <div
                style={{
                  position: 'relative',
                  width: template.orientation === 'portrait' ? '360px' : '520px',
                  aspectRatio: template.aspectRatio.replace(':', ' / '),
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease',
                  borderRadius: '4px',
                  backgroundColor: template.canvasConfig.backgroundColor,
                  backgroundImage: template.canvasConfig.bgGradient || 'none',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* Safe Margins */}
                {showSafeGuides && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '12px',
                      border: '1px dashed rgba(74, 222, 128, 0.5)',
                      pointerEvents: 'none',
                      zIndex: 30,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '4px',
                        fontSize: '8px',
                        fontWeight: 700,
                        color: '#4ade80',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        padding: '1px 3px',
                        borderRadius: '2px',
                      }}
                    >
                      SAFE PRINT MARGIN
                    </span>
                  </div>
                )}

                {/* Render Layers with Customized Site Values */}
                {template.layers.map((layer) => {
                  const fieldKey = layer.fieldKey || layer.id;
                  const displayContent =
                    layer.isEditableBySiteUser && customValues[fieldKey] !== undefined
                      ? customValues[fieldKey]
                      : layer.content;

                  return (
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
                        borderColor: layer.style.borderColor || 'transparent',
                        borderWidth: layer.style.borderWidth ? `${layer.style.borderWidth}px` : 0,
                        borderRadius: layer.style.borderRadius ? `${layer.style.borderRadius}px` : 0,
                        opacity: layer.style.opacity ?? 1,
                        display: 'flex',
                        alignItems: layer.type === 'text' ? 'flex-start' : 'center',
                        justifyContent: layer.type === 'qrcode' ? 'center' : 'flex-start',
                        padding: layer.style.padding ? `${layer.style.padding}px` : '4px',
                        overflow: 'hidden',
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
                            letterSpacing: layer.style.letterSpacing ? `${layer.style.letterSpacing}px` : 'normal',
                            textTransform: layer.style.textTransform || 'none',
                            width: '100%',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {displayContent}
                        </div>
                      )}

                      {layer.type === 'logo' && (
                        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'inherit' }}>
                          <Image src={displayContent} alt="Logo" fill unoptimized style={{ objectFit: 'contain' }} />
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
                          <QrCode size={32} color="#0f172a" />
                          <span style={{ fontSize: '6px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
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
                          {displayContent}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Realistic 3D Environment Mockup View */
              <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden' }}>
                <Image
                  src={template.previewMockupUrl || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80'}
                  alt="Realistic Environment Mockup"
                  fill
                  unoptimized
                  style={{ objectFit: 'cover', filter: 'brightness(0.95)' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Simulated Real-World Setting</span>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>
                      {template.category} • In-Situ Environmental Rendering
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>✓ High-Resolution Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
