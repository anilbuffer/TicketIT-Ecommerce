'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Layers,
  Users,
  History,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Sliders,
  DollarSign,
  Store,
  FileText,
  Lock,
} from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { SaaSLayout } from '../../../components/layout/SaaSLayout';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  MARKETING_ASSETS,
  MOCK_AUDIT_LOGS,
  MONTHLY_BILLING_SUMMARY,
  MarketingAsset,
  AuditLogEntry,
} from '../../../data/marketingAssets';

function AdminPortalContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalogue' | 'sites' | 'audit'>('catalogue');

  // DAM Catalogue state
  const [assets, setAssets] = useState<MarketingAsset[]>(MARKETING_ASSETS);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // New Asset Form state
  const [newAsset, setNewAsset] = useState<Partial<MarketingAsset>>({
    title: '',
    sku: '',
    category: 'Point of Sale',
    description: '',
    specifications: '',
    unitCost: 120,
    packQuantity: 1,
    leadTimeDays: 3,
    dimensions: 'Standard Format',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
    tags: ['New Release', 'Spring 2026'],
    isAvailable: true,
    approvalStatus: 'Approved',
    stockRemaining: 50,
  });

  const handleToggleAssetAvailability = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, isAvailable: !a.isAvailable } : a))
    );

    // Append to audit log
    const target = assets.find((a) => a.id === assetId);
    const newEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: user?.name || 'David Sterling',
      actorRole: 'Portal Administrator',
      actorEmail: user?.email || 'david.sterling@yellowdelivery.io',
      action: 'CATALOG_UPDATED',
      targetResource: `${target?.sku} (${target?.title})`,
      details: `Toggled availability status to ${!target?.isAvailable ? 'AVAILABLE' : 'DISABLED'}`,
      siteCode: 'SYS-GLOBAL',
      ipAddress: '192.0.2.14 (Admin Console)',
    };
    setAuditLogs([newEntry, ...auditLogs]);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.title || !newAsset.sku) return;

    const created: MarketingAsset = {
      id: `asset_${Date.now()}`,
      sku: newAsset.sku,
      title: newAsset.title,
      category: newAsset.category || 'Point of Sale',
      description: newAsset.description || 'Approved brand collateral asset.',
      specifications: newAsset.specifications || 'Standard specifications.',
      unitCost: Number(newAsset.unitCost) || 0,
      packQuantity: Number(newAsset.packQuantity) || 1,
      leadTimeDays: Number(newAsset.leadTimeDays) || 2,
      dimensions: newAsset.dimensions || 'Standard',
      thumbnail:
        newAsset.thumbnail ||
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
      tags: ['Approved DAM', 'New Collateral'],
      isAvailable: true,
      approvalStatus: 'Approved',
      stockRemaining: Number(newAsset.stockRemaining) || 100,
    };

    setAssets([created, ...assets]);
    setIsAddAssetOpen(false);

    // Append to audit log
    const newEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: user?.name || 'David Sterling',
      actorRole: 'Portal Administrator',
      actorEmail: user?.email || 'david.sterling@yellowdelivery.io',
      action: 'CATALOG_UPDATED',
      targetResource: `${created.sku} (${created.title})`,
      details: `Published new approved marketing asset into central DAM catalogue ($${created.unitCost} billing rate)`,
      siteCode: 'SYS-GLOBAL',
      valueAmount: created.unitCost,
      ipAddress: '192.0.2.14 (Admin Console)',
    };
    setAuditLogs([newEntry, ...auditLogs]);
  };

  // Filtered lists
  const filteredCatalog = assets.filter(
    (a) =>
      a.title.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
      a.sku.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchCatalogQuery.toLowerCase())
  );

  const filteredAudit = auditLogs.filter(
    (log) =>
      log.actorName.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <Container>
        {/* Banner Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e192c 0%, #362f4e 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            color: '#ffffff',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(247, 53, 130, 0.25)',
                color: '#ff7b83',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                border: '1px solid rgba(247, 53, 130, 0.4)',
              }}
            >
              <Shield size={14} />
              <span>ROLE 03 • PORTAL ADMINISTRATOR CONTROL HQ</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
              DAM Catalogue Maintenance & Enterprise Audit
            </h1>
            <p style={{ color: '#c3bfd4', fontSize: 'var(--font-size-sm)', maxWidth: '680px', lineHeight: 1.5 }}>
              Central DAM library management, retail branch client registry, billing rate maintenance, and full transactional audit logs.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddAssetOpen(true)}
            leftIcon={<Plus size={16} />}
          >
            Publish New DAM Asset
          </Button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(231, 234, 239, 0.8)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            width: 'fit-content',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => setActiveTab('catalogue')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              background: activeTab === 'catalogue' ? 'var(--color-secondary)' : 'transparent',
              color: activeTab === 'catalogue' ? '#ffffff' : 'var(--color-text-main)',
              transition: 'all 0.2s',
            }}
          >
            DAM Asset Catalogue ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('sites')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              background: activeTab === 'sites' ? 'var(--color-secondary)' : 'transparent',
              color: activeTab === 'sites' ? '#ffffff' : 'var(--color-text-main)',
              transition: 'all 0.2s',
            }}
          >
            Client & Site Registry (34 Sites)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              background: activeTab === 'audit' ? 'var(--color-secondary)' : 'transparent',
              color: activeTab === 'audit' ? '#ffffff' : 'var(--color-text-main)',
              transition: 'all 0.2s',
            }}
          >
            Audit Trail Logs ({auditLogs.length})
          </button>
        </div>

        {/* Tab 1: Catalogue Manager */}
        {activeTab === 'catalogue' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Filter DAM assets..."
                  value={searchCatalogQuery}
                  onChange={(e) => setSearchCatalogQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-xs)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', fontWeight: 800 }}>
                    <th style={{ padding: '1rem' }}>THUMBNAIL</th>
                    <th style={{ padding: '1rem' }}>SKU & ASSET TITLE</th>
                    <th style={{ padding: '1rem' }}>CATEGORY</th>
                    <th style={{ padding: '1rem' }}>UNIT BILLING COST</th>
                    <th style={{ padding: '1rem' }}>LEAD TIME</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalog.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(43, 37, 62, 0.08)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden' }}>
                          <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{item.title}</div>
                        <code style={{ color: 'var(--color-primary)', fontSize: '0.7rem' }}>{item.sku}</code>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ background: 'rgba(231, 234, 239, 0.6)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-sub)' }}>
                        {item.leadTimeDays} Business Days
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            background: item.isAvailable ? '#ecfdf5' : '#fee2e2',
                            color: item.isAvailable ? '#059669' : '#b91c1c',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                          }}
                        >
                          {item.isAvailable ? 'Active in Portal' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleAssetAvailability(item.id)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: item.isAvailable ? '#fef2f2' : '#f0fdf4',
                            color: item.isAvailable ? '#dc2626' : '#16a34a',
                            border: '1px solid currentColor',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {item.isAvailable ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Site Registry */}
        {activeTab === 'sites' && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
              Customer & Site Location Master Registry
            </h2>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', marginBottom: '1.5rem' }}>
              Enterprise customer account: <strong>Apex Retail Group</strong> (34 Active Storefronts & Fulfillment Endpoints)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {MONTHLY_BILLING_SUMMARY.siteBreakdowns.map((site) => (
                <div
                  key={site.siteCode}
                  style={{
                    background: 'rgba(231, 234, 239, 0.4)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <code style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{site.siteCode}</code>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                      Active Store
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>
                    {site.siteName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-sub)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Budget Limit: $8,500/mo</span>
                    <span>PO Allocation: {site.poCount} active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: System Audit Trail */}
        {activeTab === 'audit' && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>
                  Enterprise System Audit Trail & Compliance Ledger
                </h2>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)' }}>
                  Tamper-evident record of all collateral orders, billing exports, and DAM modifications.
                </p>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search audit trail..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(231, 234, 239, 0.4)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-xs)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', fontWeight: 800 }}>
                    <th style={{ padding: '0.75rem 1rem' }}>TIMESTAMP</th>
                    <th style={{ padding: '0.75rem 1rem' }}>ACTOR & ROLE</th>
                    <th style={{ padding: '0.75rem 1rem' }}>ACTION</th>
                    <th style={{ padding: '0.75rem 1rem' }}>TARGET RESOURCE</th>
                    <th style={{ padding: '0.75rem 1rem' }}>DETAILS</th>
                    <th style={{ padding: '0.75rem 1rem' }}>IP / TERMINAL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid rgba(43, 37, 62, 0.08)' }}>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{entry.actorName}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{entry.actorRole}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <code
                          style={{
                            background: 'rgba(43, 37, 62, 0.08)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            color: 'var(--color-secondary)',
                          }}
                        >
                          {entry.action}
                        </code>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                        {entry.targetResource}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-sub)' }}>
                        {entry.details}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                        {entry.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Publish New DAM Asset */}
        <AnimatePresence>
          {isAddAssetOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(43, 37, 62, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  width: '100%',
                  maxWidth: '540px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '2rem',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
                    Add Approved Marketing Asset
                  </h2>
                  <button onClick={() => setIsAddAssetOpen(false)} style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateAsset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Input
                    label="Asset Title"
                    value={newAsset.title}
                    onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                    placeholder="e.g. Autumn Window Poster Set"
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                      label="Asset SKU"
                      value={newAsset.sku}
                      onChange={(e) => setNewAsset({ ...newAsset, sku: e.target.value })}
                      placeholder="e.g. POS-WIN-202"
                      required
                    />
                    <Input
                      label="Unit Cost (USD)"
                      type="number"
                      value={String(newAsset.unitCost)}
                      onChange={(e) => setNewAsset({ ...newAsset, unitCost: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Category
                    </label>
                    <select
                      value={newAsset.category}
                      onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                    >
                      <option value="Point of Sale">Point of Sale</option>
                      <option value="Digital & Signage">Digital & Signage</option>
                      <option value="Apparel & Uniforms">Apparel & Uniforms</option>
                      <option value="Print Collateral">Print Collateral</option>
                      <option value="Branded Merch">Branded Merch</option>
                    </select>
                  </div>

                  <Input
                    label="Specifications"
                    value={newAsset.specifications}
                    onChange={(e) => setNewAsset({ ...newAsset, specifications: e.target.value })}
                    placeholder="e.g. 2000 x 850 mm • 300gsm Silk"
                  />

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <Button type="button" variant="outline" size="md" style={{ flex: 1 }} onClick={() => setIsAddAssetOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="md" style={{ flex: 1 }}>
                      Publish Asset
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <AuthGuard allowedRoles={['admin']} requiredPermission="manage_catalogue">
      <SaaSLayout>
        <AdminPortalContent />
      </SaaSLayout>
    </AuthGuard>
  );
}
