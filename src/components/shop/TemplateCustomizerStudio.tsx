// src/components/shop/TemplateCustomizerStudio.tsx
'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Lock, Type,
  Plus, Minus,
  FileText, QrCode,
  ShieldCheck, RotateCcw, Sparkles,
  Info, CheckCircle2,
  Building2, Phone, Mail, Globe, MapPin, Tag,
} from 'lucide-react';
import type { PrintTemplate, TemplateLayer } from '@/lib/services/types';
import { useAuth } from '@/context/AuthContext';

interface TemplateCustomizerStudioProps {
  template: PrintTemplate;
}

export function TemplateCustomizerStudio({ template }: TemplateCustomizerStudioProps) {
  const router = useRouter();
  const { user } = useAuth();
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.layers.forEach((layer) => {
      if (layer.isEditableBySiteUser && layer.fieldKey) {
        if (layer.fieldKey === 'businessName') initial[layer.fieldKey] = user?.siteName || layer.content;
        else if (layer.fieldKey === 'contactName') initial[layer.fieldKey] = user?.name || layer.content;
        else if (layer.fieldKey === 'email') initial[layer.fieldKey] = user?.email || layer.content;
        else initial[layer.fieldKey] = layer.content;
      }
    });
    return initial;
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'locked'>('content');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showSafeArea, setShowSafeArea] = useState<boolean>(true);
  const [showBleed, setShowBleed] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<'front' | 'back'>('front');
  const [showAutoFillSuccess, setShowAutoFillSuccess] = useState<boolean>(false);

  // Filter only text and content layers that are editable by site users
  const editableLayers = template.layers.filter(
    (l) => l.isEditableBySiteUser && l.type !== 'logo' && l.type !== 'image'
  );
  const lockedLayers = template.layers.filter(
    (l) => !l.isEditableBySiteUser || l.type === 'logo' || l.type === 'image'
  );

  const handleFieldChange = (key: string, value: string) => {
    setCustomValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectLayer = (layerId: string) => {
    setSelectedLayerId(layerId);
    setTimeout(() => {
      const el = inputRefs.current[layerId];
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleAutoFill = () => {
    setCustomValues((prev) => {
      const next = { ...prev };
      template.layers.forEach((l) => {
        if (l.isEditableBySiteUser && l.fieldKey) {
          if (l.fieldKey === 'businessName' && user?.siteName) next[l.fieldKey] = user.siteName;
          if (l.fieldKey === 'contactName' && user?.name) next[l.fieldKey] = user.name;
          if (l.fieldKey === 'email' && user?.email) next[l.fieldKey] = user.email;
        }
      });
      return next;
    });
    setShowAutoFillSuccess(true);
    setTimeout(() => setShowAutoFillSuccess(false), 3000);
  };

  const handleResetAll = () => {
    const initial: Record<string, string> = {};
    template.layers.forEach((layer) => {
      if (layer.isEditableBySiteUser && layer.fieldKey) {
        initial[layer.fieldKey] = layer.content;
      }
    });
    setCustomValues(initial);
    setSelectedLayerId(null);
  };

  const handleProceedToPO = () => {
    const poPayload = {
      templateId: template.id,
      templateName: template.name,
      productId: template.productId,
      productName: template.productName,
      category: template.category,
      thumbnailUrl: template.thumbnailUrl,
      customValues,
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

  const canvasWidth = template.orientation === 'portrait' ? 340 : template.orientation === 'square' ? 400 : 500;
  const [aw, ah] = template.aspectRatio.split(':').map(Number);
  const canvasHeight = Math.round((canvasWidth * (ah || 1)) / (aw || 1));

  // Determine field icon by fieldKey or layer type
  const getFieldIcon = (layer: TemplateLayer) => {
    switch (layer.fieldKey) {
      case 'businessName': return Building2;
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'website': return Globe;
      case 'address': return MapPin;
      case 'tagline': case 'promoOffer': return Tag;
      default: return layer.type === 'qrcode' ? QrCode : Type;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#f1f5f9', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* TOP HEADER */}
      <div style={{ height: '56px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', gap: '16px' }}>
        {/* Left: Back & Template Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <Link
            href="/shop/templates"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              color: '#475569',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
              transition: 'all 0.15s ease',
            }}
            title="Back to Templates Catalog"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{template.name}</span>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#ede9fe', color: '#6d28d9' }}>
                {template.category}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
              Format: {template.dimensions.width}&quot; &times; {template.dimensions.height}&quot; &bull; {template.orientation} orientation
            </div>
          </div>
        </div>

        {/* Center: Brand Protection Guarantee & Auto-fill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '5px 12px', borderRadius: '20px' }}>
            <ShieldCheck size={14} color="#16a34a" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>
              Brand Governed Template
            </span>
            <span style={{ fontSize: '11px', color: '#86efac' }}>•</span>
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: 500 }}>
              Layout & Fonts Locked by Corporate
            </span>
          </div>

          <button
            onClick={handleAutoFill}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#faf5ff',
              border: '1px solid #d8b4fe',
              color: '#7e22ce',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Auto-fill branch name and details from your user profile"
          >
            <Sparkles size={12} />
            {showAutoFillSuccess ? 'Filled from Profile!' : 'Auto-Fill Branch Info'}
          </button>

          <button
            onClick={handleResetAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Reset all fields to template default content"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Right: Proceed to PO CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Zero Site Payment Liability</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>Billed to Head Office</div>
          </div>
          <button
            onClick={handleProceedToPO}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '10px',
              backgroundColor: '#f73582',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(247,53,130,0.35)',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            }}
          >
            <FileText size={15} /> Save & Create PO →
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT PANEL: PERSONALIZATION FORM */}
        <div
          style={{
            width: '380px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            zIndex: 30,
            boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
          }}
        >
          {/* Panel Header & Segmented Tabs */}
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Personalize Content
                </h2>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                  Update branch text & details below. The proof updates in real-time.
                </p>
              </div>
            </div>

            {/* Tab Switches: Editable Fields vs Locked Elements */}
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '3px', gap: '3px' }}>
              <button
                onClick={() => setActiveTab('content')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'content' ? '#ffffff' : 'transparent',
                  color: activeTab === 'content' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'content' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Type size={13} color={activeTab === 'content' ? '#7c3aed' : '#64748b'} />
                Editable Fields ({editableLayers.length})
              </button>
              <button
                onClick={() => setActiveTab('locked')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'locked' ? '#ffffff' : 'transparent',
                  color: activeTab === 'locked' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'locked' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Lock size={12} color={activeTab === 'locked' ? '#475569' : '#94a3b8'} />
                Brand Protected ({lockedLayers.length})
              </button>
            </div>
          </div>

          {/* Form Scrollable Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeTab === 'content' && (
              <>
                {/* Brand Guidance Note */}
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Info size={14} color="#64748b" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#475569', lineHeight: 1.45 }}>
                    Click any text field below or click directly on the artwork preview to edit branch-specific text.
                  </span>
                </div>

                {/* Form Fields for Each Editable Layer */}
                {editableLayers.map((layer) => {
                  const fieldKey = layer.fieldKey || layer.id;
                  const currentValue = customValues[fieldKey] ?? layer.content;
                  const isSelected = selectedLayerId === layer.id;
                  const Icon = getFieldIcon(layer);
                  const isQR = layer.type === 'qrcode';
                  const isMultiline = layer.height > 12 || (currentValue && currentValue.includes('\n'));

                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? '#faf5ff' : '#ffffff',
                        border: isSelected ? '1.5px solid #a855f7' : '1px solid #e2e8f0',
                        boxShadow: isSelected ? '0 0 0 3px rgba(168,85,247,0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Field Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: isSelected ? '#6b21a8' : '#1e293b' }}>
                          <Icon size={13} color={isSelected ? '#9333ea' : '#64748b'} />
                          <span>{layer.label || layer.name}</span>
                          {layer.isRequired && <span style={{ color: '#ef4444', fontWeight: 800 }}>*</span>}
                        </label>

                        {/* Reset Single Field */}
                        {currentValue !== layer.content && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFieldChange(fieldKey, layer.content);
                            }}
                            title="Reset to template default"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              fontSize: '10px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '2px 4px',
                            }}
                          >
                            <RotateCcw size={10} /> Reset
                          </button>
                        )}
                      </div>

                      {/* Field Inputs Based on Type */}
                      {isQR ? (
                        <div>
                          <input
                            ref={(el) => { inputRefs.current[layer.id] = el; }}
                            type="url"
                            value={currentValue}
                            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                            placeholder="https://yourbranch.example.com"
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '7px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              color: '#0f172a',
                              backgroundColor: '#ffffff',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                            Live QR code will encode and link directly to this web address.
                          </span>
                        </div>
                      ) : isMultiline ? (
                        <div>
                          <textarea
                            ref={(el) => { inputRefs.current[layer.id] = el; }}
                            rows={3}
                            value={currentValue}
                            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                            placeholder={layer.helperText || 'Enter content...'}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '7px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              color: '#0f172a',
                              backgroundColor: '#ffffff',
                              outline: 'none',
                              lineHeight: 1.45,
                              resize: 'vertical',
                              boxSizing: 'border-box',
                              fontFamily: 'inherit',
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Supports multiple lines & bullet lists</span>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{currentValue?.length || 0} chars</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            ref={(el) => { inputRefs.current[layer.id] = el; }}
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                            placeholder={layer.helperText || 'Enter content...'}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '7px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              color: '#0f172a',
                              backgroundColor: '#ffffff',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3px' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{currentValue?.length || 0} chars</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'locked' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                    These elements are locked by the Head Office Marketing & Brand Team to ensure corporate compliance and visual consistency across all branches.
                  </p>
                </div>

                {lockedLayers.map((layer) => (
                  <div
                    key={layer.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={11} color="#94a3b8" />
                        <span>{layer.name}</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                        Type: {layer.type} &bull; Position: {layer.x}%, {layer.y}%
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                      Locked
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel Footer: Status Summary */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#16a34a" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>
                All {editableLayers.length} fields personalized
              </span>
            </div>
            <button
              onClick={handleProceedToPO}
              style={{
                background: 'none',
                border: 'none',
                color: '#f73582',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              Continue →
            </button>
          </div>
        </div>

        {/* CENTER: LIVE ARTWORK PROOF CANVAS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {/* Canvas Toolbar (Safety Margins & Zoom) */}
          <div style={{ height: '44px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
            {/* Guide Overlays */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Proof Guides:</span>
              <button
                onClick={() => setShowSafeArea(!showSafeArea)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: showSafeArea ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: showSafeArea ? '#eff6ff' : '#ffffff',
                  color: showSafeArea ? '#1d4ed8' : '#64748b',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: showSafeArea ? '#3b82f6' : '#cbd5e1' }} />
                Safety Margin
              </button>
              <button
                onClick={() => setShowBleed(!showBleed)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: showBleed ? '1px solid #fdba74' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: showBleed ? '#fff7ed' : '#ffffff',
                  color: showBleed ? '#c2410c' : '#64748b',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: showBleed ? '#f97316' : '#cbd5e1' }} />
                Bleed Area
              </button>
            </div>

            {/* Proof Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 40))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                  color: '#475569',
                }}
                title="Zoom Out"
              >
                <Minus size={13} />
              </button>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', minWidth: '40px', textAlign: 'center' }}>
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 200))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                  color: '#475569',
                }}
                title="Zoom In"
              >
                <Plus size={13} />
              </button>
              <div style={{ width: '1px', height: '16px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />
              <button
                onClick={() => setZoomLevel(100)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Fit 100%
              </button>
            </div>
          </div>

          {/* Canvas Scroll Area */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: '#e2e8f0',
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              padding: '36px 24px',
              position: 'relative',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedLayerId(null);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              {/* Artwork Proof Canvas Container */}
              <div
                style={{
                  position: 'relative',
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease',
                  backgroundColor: template.canvasConfig.backgroundColor,
                  backgroundImage: template.canvasConfig.bgGradient || 'none',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedLayerId(null);
                }}
              >
                {/* Bleed Guideline Overlay */}
                {showBleed && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      border: '2px dashed rgba(249,115,22,0.7)',
                      pointerEvents: 'none',
                      zIndex: 50,
                      borderRadius: '4px',
                    }}
                  />
                )}

                {/* Safe Area Guideline Overlay */}
                {showSafeArea && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '14px',
                      border: '1.5px dashed rgba(59,130,246,0.7)',
                      pointerEvents: 'none',
                      zIndex: 50,
                    }}
                  />
                )}

                {/* Render All Template Layers */}
                {template.layers.map((layer) => {
                  const fieldKey = layer.fieldKey || layer.id;
                  const displayContent = layer.isEditableBySiteUser && customValues[fieldKey] !== undefined
                    ? customValues[fieldKey]
                    : layer.content;
                  const isSelected = selectedLayerId === layer.id;
                  const isEditable = layer.isEditableBySiteUser && layer.type !== 'logo' && layer.type !== 'image';

                  return (
                    <div
                      key={layer.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isEditable) handleSelectLayer(layer.id);
                      }}
                      title={isEditable ? `✎ Click to edit ${layer.label || layer.name}` : `🔒 ${layer.name} (Locked Corporate Element)`}
                      style={{
                        position: 'absolute',
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: `${layer.width}%`,
                        height: `${layer.height}%`,
                        zIndex: (layer.zIndex || 1) + (isSelected ? 15 : 0),
                        backgroundColor: layer.style.backgroundColor || 'transparent',
                        borderRadius: layer.style.borderRadius ? `${layer.style.borderRadius}px` : 0,
                        opacity: layer.style.opacity ?? 1,
                        cursor: isEditable ? 'pointer' : 'default',
                        outline: isSelected
                          ? '2.5px solid #a855f7'
                          : 'none',
                        outlineOffset: '2px',
                        display: 'flex',
                        alignItems: layer.type === 'text' ? 'flex-start' : 'center',
                        justifyContent: layer.type === 'qrcode' ? 'center' : 'flex-start',
                        padding: layer.style.padding ? `${layer.style.padding}px` : '4px',
                        overflow: 'hidden',
                        transition: 'outline 0.15s ease',
                      }}
                    >
                      {/* Active Editing Indicator Tag */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-24px',
                            left: '0',
                            backgroundColor: '#7e22ce',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            zIndex: 60,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span>✎ Editing {layer.label || layer.name}</span>
                        </div>
                      )}

                      {/* Text Layer Render */}
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
                            fontFamily: layer.style.fontFamily || 'inherit',
                          }}
                        >
                          {displayContent}
                        </div>
                      )}

                      {/* Logo / Image Layer Render (Locked Brand Asset) */}
                      {(layer.type === 'logo' || layer.type === 'image') && displayContent && (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image src={displayContent} alt="Logo" fill unoptimized style={{ objectFit: 'contain' }} />
                        </div>
                      )}

                      {/* QR Code Layer Render */}
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
                          <QrCode size={30} color="#0f172a" />
                          <span style={{ fontSize: '6px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                            SCAN ME
                          </span>
                        </div>
                      )}

                      {/* Shape / Decorative Layer Render */}
                      {layer.type === 'shape' && (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: layer.style.backgroundColor || '#e2e8f0',
                            borderRadius: layer.style.borderRadius ? `${layer.style.borderRadius}px` : '0',
                          }}
                        />
                      )}

                      {/* Badge Layer Render */}
                      {layer.type === 'badge' && (
                        <div
                          style={{
                            fontSize: `${layer.style.fontSize || 11}px`,
                            fontWeight: layer.style.fontWeight || 800,
                            color: layer.style.color || '#ffffff',
                            letterSpacing: `${layer.style.letterSpacing || 1}px`,
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

              {/* Physical Dimension Ruler Indicator */}
              <div style={{ width: `${canvasWidth}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#94a3b8' }} />
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                  {template.dimensions.width} &times; {template.dimensions.height} {template.dimensions.unit} (Scale 1:1 Ready for Print)
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#94a3b8' }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: SIDES & PAGES SELECTOR */}
        <div
          style={{
            width: '88px',
            backgroundColor: '#ffffff',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 8px',
            gap: '14px',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sides
          </span>

          {(['front', 'back'] as const).map((page) => (
            <div key={page} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
              <button
                onClick={() => setActivePage(page)}
                style={{
                  width: '64px',
                  aspectRatio: template.orientation === 'landscape' ? '3/2' : template.orientation === 'square' ? '1/1' : '2/3',
                  borderRadius: '6px',
                  border: activePage === page ? '2.5px solid #7c3aed' : '1.5px solid #e2e8f0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: page === 'front' ? template.canvasConfig.backgroundColor : '#f8fafc',
                  backgroundImage: page === 'front' ? (template.canvasConfig.bgGradient || 'none') : 'none',
                  padding: 0,
                  boxShadow: activePage === page ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {page === 'back' ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
                    <span style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 700 }}>BLANK</span>
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                    {template.layers.map((l) => (
                      <div
                        key={l.id}
                        style={{
                          position: 'absolute',
                          left: `${l.x}%`,
                          top: `${l.y}%`,
                          width: `${l.width}%`,
                          height: `${l.height}%`,
                          backgroundColor: l.style.backgroundColor || 'transparent',
                          color: l.style.color || '#fff',
                          fontSize: `${Math.max((l.style.fontSize || 14) * 0.18, 3)}px`,
                          overflow: 'hidden',
                          lineHeight: 1,
                        }}
                      >
                        {l.type === 'text' && <span>{l.content}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </button>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: activePage === page ? '#7c3aed' : '#64748b',
                  textTransform: 'capitalize',
                }}
              >
                {page === 'front' ? 'Front Side' : 'Back Side'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
