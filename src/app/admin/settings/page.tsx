// src/app/admin/settings/page.tsx
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Settings,
  Users,
  Shield,
  CheckSquare,
  Sparkles,
  Save,
  CheckCircle,
  Database,
  Globe,
  Plus,
  Search,
  Check,
  X,
  AlertCircle,
  Clock,
  Play,
  Send,
  RefreshCw,
  Code2,
  Server,
  Zap,
  Lock,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useUsers, useSites, useAccountMutations } from '@/lib/hooks/useAccounts';
import { ROLE_PERMISSIONS, Permission } from '@/lib/auth/rbac';
import type { UserRole, PortalUser, IntegrationWebhook, WebhookDeliveryLog } from '@/lib/services/types';

type SettingsTab = 'general' | 'users' | 'roles' | 'po-validation' | 'integrations';

const INITIAL_WEBHOOKS: IntegrationWebhook[] = [
  {
    id: 'wh-print-01',
    name: 'PrintFlow Production Webhook (CMYK Dispatch)',
    targetSystem: 'PRINT_PRODUCTION',
    url: 'https://api.printflow.production.net/v2/orders/inbound',
    events: ['ORDER_APPROVED', 'ORDER_CONFIRMED'],
    status: 'ACTIVE',
    secretKey: 'sec_live_99482019ab9284102',
    lastTriggeredAt: '2026-08-20T08:12:00.000Z',
    successRatePct: 99.4,
    totalCalls: 1420,
  },
  {
    id: 'wh-3pl-02',
    name: 'Rahhawan 3PL WMS Automated Dispatch',
    targetSystem: 'WAREHOUSE_3PL',
    url: 'https://wms.rahhawan-logistics.io/api/v1/fulfillment/create-pick',
    events: ['ORDER_PROCESSING', 'INVENTORY_RESERVED'],
    status: 'ACTIVE',
    secretKey: 'sec_live_38291048bc7193021',
    lastTriggeredAt: '2026-08-20T09:45:00.000Z',
    successRatePct: 100.0,
    totalCalls: 3890,
  },
  {
    id: 'wh-erp-03',
    name: 'SAP S/4HANA & NetSuite Billing Ingest',
    targetSystem: 'ERP_FINANCE',
    url: 'https://finance-gw.enterprise-erp.com/odata/v4/JournalEntries',
    events: ['MONTHLY_BILLING_CONSOLIDATED', 'ORDER_DELIVERED'],
    status: 'ACTIVE',
    secretKey: 'sec_live_77192840ac8291045',
    lastTriggeredAt: '2026-08-19T23:59:00.000Z',
    successRatePct: 98.8,
    totalCalls: 540,
  },
];

const INITIAL_LOGS: WebhookDeliveryLog[] = [
  {
    id: 'log-001',
    webhookId: 'wh-3pl-02',
    webhookName: 'Rahhawan 3PL WMS Automated Dispatch',
    targetSystem: 'WAREHOUSE_3PL',
    event: 'ORDER_PROCESSING',
    status: 'SUCCESS',
    httpCode: 200,
    payloadSummary: '{"orderNumber":"ORD-2026-0891","siteCode":"APX-MID-101","items":3}',
    timestamp: '2026-08-20T09:45:12.110Z',
    responseTimeMs: 142,
  },
  {
    id: 'log-002',
    webhookId: 'wh-print-01',
    webhookName: 'PrintFlow Production Webhook',
    targetSystem: 'PRINT_PRODUCTION',
    event: 'ORDER_APPROVED',
    status: 'SUCCESS',
    httpCode: 201,
    payloadSummary: '{"orderNumber":"ORD-2026-0998","template":"POS-WND-BANNER-01","bleedMm":3}',
    timestamp: '2026-08-20T08:12:04.450Z',
    responseTimeMs: 210,
  },
  {
    id: 'log-003',
    webhookId: 'wh-erp-03',
    webhookName: 'SAP S/4HANA & NetSuite Billing Ingest',
    targetSystem: 'ERP_FINANCE',
    event: 'MONTHLY_BILLING_CONSOLIDATED',
    status: 'SUCCESS',
    httpCode: 200,
    payloadSummary: '{"period":"August 2026","accountId":"acc-001","totalAmount":28450.00}',
    timestamp: '2026-08-19T23:59:10.000Z',
    responseTimeMs: 380,
  },
];

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTabParam = (searchParams.get('tab') as SettingsTab) || 'general';
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    ['general', 'users', 'roles', 'po-validation', 'integrations'].includes(activeTabParam)
      ? activeTabParam
      : 'general'
  );

  const setTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.replace(`/admin/settings?tab=${tab}`);
  };

  // GENERAL CONFIG STATE
  const [platformName, setPlatformName] = useState('TicketIT Enterprise Platform');
  const [currency, setCurrency] = useState('USD ($)');
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [generalSaved, setGeneralSaved] = useState(false);

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 2500);
  };

  // USERS MANAGEMENT STATE
  const [searchQuery, setSearchQuery] = useState('');
  const { data: usersData, isLoading: isUsersLoading, refetch: refetchUsers } = useUsers({ search: searchQuery });
  const { data: sitesData } = useSites();
  const { createUser } = useAccountMutations();

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<PortalUser['role']>('SITE_USER');
  const [userSiteId, setUserSiteId] = useState('');
  const [userDepartment, setUserDepartment] = useState('');
  const [userBudgetCap, setUserBudgetCap] = useState(15000);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    const site = sitesData?.items.find((s) => s.id === userSiteId);
    setIsSubmittingUser(true);
    try {
      await createUser({
        name: userName,
        email: userEmail,
        role: userRole,
        siteId: userSiteId || undefined,
        siteCode: site?.code,
        siteName: site?.name,
        accountId: site?.accountId,
        accountName: site?.accountName,
        department: userDepartment || 'Store Operations',
        monthlyBudgetCap: Number(userBudgetCap),
        status: 'ACTIVE',
      });
      setUserName('');
      setUserEmail('');
      setUserDepartment('');
      setIsAddingUser(false);
      refetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // ROLES & RBAC MATRIX CONFIG
  const permissionsList: { id: Permission; label: string; desc: string }[] = [
    { id: 'VIEW_DASHBOARD', label: 'View Operational Dashboard', desc: 'Access high-level analytics, revenue figures, and KPIs' },
    { id: 'MANAGE_CATALOGUE', label: 'Manage Product Catalogue & Pricing', desc: 'Add, update, or archive collateral SKUs and base prices' },
    { id: 'VIEW_CATALOGUE', label: 'Browse Catalogue & Assets', desc: 'View available marketing and logistics materials' },
    { id: 'MANAGE_ACCOUNTS', label: 'Manage Customer Accounts & Sites', desc: 'Register healthcare groups, dispensary sites, and branch addresses' },
    { id: 'VIEW_ACCOUNTS', label: 'View Organization Hierarchy', desc: 'Read-only directory of accounts and branches' },
    { id: 'MANAGE_RATE_CARDS', label: 'Configure Commercial Rate Cards', desc: 'Create custom contract tier pricing and discount matrices' },
    { id: 'MANAGE_ALL_ORDERS', label: 'Manage All Orders Across Sites', desc: 'Access full line item detail and customer requisition orders' },
    { id: 'UPDATE_ORDER_STATUS', label: 'Execute Order Status Transitions', desc: 'Move orders between Received, Processing, Dispatched, and Delivered' },
    { id: 'VIEW_SITE_ORDERS', label: 'View Branch Order History', desc: 'Inspect requisitions belonging to the active site branch' },
    { id: 'PLACE_ORDER', label: 'Place New Branch Requisitions', desc: 'Build baskets, enter PO references, and submit collateral orders' },
    { id: 'VIEW_CONSOLIDATED_BILLING', label: 'View Multi-Site Consolidated Billing', desc: 'Access consolidated invoice breakdowns feeding monthly reporting' },
    { id: 'EXPORT_REPORTS', label: 'Export Reports (CSV, XLSX, PDF)', desc: 'Download raw accounting data and statement slips' },
    { id: 'VIEW_AUDIT_TRAIL', label: 'View HIPAA Compliance Audit Logs', desc: 'Inspect immutable ledger of system actions and payload metadata' },
    { id: 'MANAGE_SETTINGS', label: 'Configure System Architecture & RBAC', desc: 'Modify global platform flags and PO verification rules' },
  ];

  const roles: { id: UserRole; title: string; subtitle: string; color: string; bg: string }[] = [
    { id: 'ADMIN', title: 'Admin', subtitle: 'Full Operations HQ', color: '#059669', bg: '#EAF8EF' },
    { id: 'HEAD_OFFICE', title: 'Head Office', subtitle: 'Consolidated Billing (All Sites)', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'SITE_USER', title: 'Site User', subtitle: 'Branch Marketing & Orders', color: '#F73582', bg: '#FFF0F6' },
  ];

  // PO VALIDATION RULES STATE
  const [requirePoNumber, setRequirePoNumber] = useState(true);
  const [poPrefixEnforced, setPoPrefixEnforced] = useState(true);
  const [requireDeliveryNotes, setRequireDeliveryNotes] = useState(false);
  const [enforceMoq, setEnforceMoq] = useState(true);
  const [enforceOrderMultiples, setEnforceOrderMultiples] = useState(true);
  const [poSaved, setPoSaved] = useState(false);

  const handlePoSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPoSaved(true);
    setTimeout(() => setPoSaved(false), 2500);
  };

  // ENTERPRISE APIS & WEBHOOKS STATE
  const [webhooks, setWebhooks] = useState<IntegrationWebhook[]>(INITIAL_WEBHOOKS);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>(INITIAL_LOGS);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<IntegrationWebhook | null>(null);
  const [testResult, setTestResult] = useState<{
    status: 'SUCCESS' | 'FAILED';
    code: number;
    responseTimeMs: number;
    requestPayload: any;
    responseBody: any;
  } | null>(null);

  const handleTestTrigger = async (wh: IntegrationWebhook) => {
    setSelectedWebhook(wh);
    setIsTesting(true);
    setTestResult(null);

    const payload = {
      event: wh.events[0],
      timestamp: new Date().toISOString(),
      order: {
        orderNumber: 'ORD-2026-TEST',
        accountId: 'acc-001',
        accountName: 'Apex Healthcare Group',
        siteCode: 'APX-MID-101',
        totalAmount: 1420.0,
        poReference: 'PO-TEST-9921',
      },
    };

    setTimeout(() => {
      const responseTime = Math.floor(90 + Math.random() * 120);
      const newLog: WebhookDeliveryLog = {
        id: `log-${Date.now()}`,
        webhookId: wh.id,
        webhookName: wh.name,
        targetSystem: wh.targetSystem,
        event: wh.events[0],
        status: 'SUCCESS',
        httpCode: 200,
        payloadSummary: JSON.stringify(payload),
        timestamp: new Date().toISOString(),
        responseTimeMs: responseTime,
      };

      setLogs([newLog, ...logs]);
      setTestResult({
        status: 'SUCCESS',
        code: 200,
        responseTimeMs: responseTime,
        requestPayload: payload,
        responseBody: {
          success: true,
          message: 'Payload ingested and queued for processing',
          queueId: `q_${Math.random().toString(36).substring(2, 9)}`,
        },
      });
      setIsTesting(false);
    }, 600);
  };

  return (
    <>
      <AdminHeader
        title="Enterprise Platform Settings"
        subtitle="Unified configuration hub for global environment, user access, RBAC matrix, checkout rules, and enterprise integrations"
        actionButton={
          activeTab === 'users' ? (
            <button
              type="button"
              onClick={() => setIsAddingUser(!isAddingUser)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: isAddingUser ? '#475569' : '#F73582',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <Plus size={16} />
              <span>{isAddingUser ? 'Cancel' : 'Invite User'}</span>
            </button>
          ) : activeTab === 'general' ? (
            <button
              type="button"
              onClick={handleGeneralSave}
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
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <Save size={16} />
              <span>{generalSaved ? 'Saved!' : 'Save Config'}</span>
            </button>
          ) : activeTab === 'po-validation' ? (
            <button
              type="button"
              onClick={handlePoSave}
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
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <Save size={16} />
              <span>{poSaved ? 'Rules Saved!' : 'Save Rules'}</span>
            </button>
          ) : null
        }
      />

      <main style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Navigation Tabs Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(43, 37, 62, 0.05)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            width: 'fit-content',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => setTab('general')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'general' ? '#2B253E' : 'transparent',
              color: activeTab === 'general' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Settings size={16} color={activeTab === 'general' ? '#F73582' : '#94A3B8'} />
            <span>General Config</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'users' ? '#2B253E' : 'transparent',
              color: activeTab === 'users' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Users size={16} color={activeTab === 'users' ? '#F73582' : '#94A3B8'} />
            <span>User Management</span>
            {usersData?.items && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  backgroundColor: activeTab === 'users' ? 'rgba(247, 53, 130, 0.25)' : '#F1F5F9',
                  color: activeTab === 'users' ? '#FFFFFF' : '#64748B',
                }}
              >
                {usersData.items.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTab('roles')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'roles' ? '#2B253E' : 'transparent',
              color: activeTab === 'roles' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Shield size={16} color={activeTab === 'roles' ? '#F73582' : '#94A3B8'} />
            <span>Roles & RBAC Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('po-validation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'po-validation' ? '#2B253E' : 'transparent',
              color: activeTab === 'po-validation' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <CheckSquare size={16} color={activeTab === 'po-validation' ? '#F73582' : '#94A3B8'} />
            <span>PO Validation Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('integrations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'integrations' ? '#2B253E' : 'transparent',
              color: activeTab === 'integrations' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Sparkles size={16} color={activeTab === 'integrations' ? '#F73582' : '#94A3B8'} />
            <span>Enterprise APIs</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '999px',
                backgroundColor: activeTab === 'integrations' ? 'rgba(88, 185, 125, 0.3)' : 'rgba(88, 185, 125, 0.15)',
                color: activeTab === 'integrations' ? '#FFFFFF' : '#059669',
                fontWeight: 800,
              }}
            >
              LIVE
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: GENERAL CONFIGURATION */}
        {/* ============================================================ */}
        {activeTab === 'general' && (
          <div style={{ maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Architecture Notice Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#EAF8EF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Database size={20} color="#58B97D" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
                  Service Layer Boundary Architecture Active
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>
                  UI components import exclusively from <code>/lib/services/*</code>. The data layer adapter currently routes to high-fidelity in-memory mock adapters with simulated latency. When ready for production database, set <code>NEXT_PUBLIC_DATA_SOURCE=production</code> without altering any UI components.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#EAF8EF',
                      color: '#059669',
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    MOCK_DATA_ACTIVE
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    LATENCY_SIMULATION: 150ms
                  </span>
                </div>
              </div>
            </div>

            {/* General Form */}
            <form
              onSubmit={handleGeneralSave}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
                Platform Environment & Organization Parameters
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                  Platform Name / Brand Identifier
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    color: '#2B253E',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                    Reporting & Billing Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      color: '#2B253E',
                    }}
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="AUD ($)">AUD ($) - Australian Dollar</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                    Session Security Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 30)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      color: '#2B253E',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    backgroundColor: '#F73582',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <Save size={16} />
                  <span>{generalSaved ? 'Configuration Saved!' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: USER MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isAddingUser && (
              <form
                onSubmit={handleCreateUser}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(43, 37, 62, 0.08)',
                  border: '1px solid rgba(247, 53, 130, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#2B253E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#F73582" />
                  <span>Provision New Portal User</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="marcus.vance@sydney-flagship.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Assigned Role *
                    </label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as any)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="ADMIN">Admin (Full Operations HQ)</option>
                      <option value="HEAD_OFFICE">Head Office (Consolidated Multi-Site View)</option>
                      <option value="SITE_USER">Site User (Branch Marketing & Orders)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Assigned Site Branch
                    </label>
                    <select
                      value={userSiteId}
                      onChange={(e) => setUserSiteId(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="">None / Global HQ</option>
                      {sitesData?.items.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.name} ({site.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Monthly Budget Cap ($)
                    </label>
                    <input
                      type="number"
                      value={userBudgetCap}
                      onChange={(e) => setUserBudgetCap(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'transparent' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingUser}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#F73582', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    {isSubmittingUser ? 'Sending...' : 'Send Access Invite'}
                  </button>
                </div>
              </form>
            )}

            {/* Filter Bar */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(43, 37, 62, 0.04)',
                border: '1px solid rgba(43, 37, 62, 0.05)',
              }}
            >
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search users by name, email, role, or site branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', width: '100%', fontSize: '0.85rem', outline: 'none', color: '#2B253E' }}
              />
            </div>

            {/* Users Table */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                overflow: 'hidden',
              }}
            >
              {isUsersLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading user directory...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', color: '#64748B', fontWeight: 700 }}>User Profile</th>
                      <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700 }}>Role</th>
                      <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700 }}>Branch & Org</th>
                      <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700 }}>Department</th>
                      <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Budget Cap</th>
                      <th style={{ padding: '14px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.items.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#2B253E',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                              }}
                            >
                              {u.name[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#2B253E' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor:
                                u.role === 'ADMIN'
                                  ? '#FFF0F6'
                                  : u.role === 'HEAD_OFFICE'
                                  ? '#EAF8EF'
                                  : '#FEF3C7',
                              color:
                                u.role === 'ADMIN'
                                  ? '#F73582'
                                  : u.role === 'HEAD_OFFICE'
                                  ? '#10B981'
                                  : '#D97706',
                            }}
                          >
                            {u.role === 'ADMIN' ? 'Admin (Operations HQ)' : u.role === 'HEAD_OFFICE' ? 'Head Office' : 'Site User'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#2B253E', fontWeight: 600 }}>
                          <div>{u.siteName || 'Global Platform'}</div>
                          {u.siteCode && <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>{u.siteCode}</div>}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748B' }}>
                          {u.department || 'Operations'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#2B253E' }}>
                          {u.monthlyBudgetCap ? `$${u.monthlyBudgetCap.toLocaleString()}` : 'Unlimited'}
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                          <StatusPill status={u.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ROLES & RBAC MATRIX */}
        {/* ============================================================ */}
        {activeTab === 'roles' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
                  Role-Based Access Control (RBAC) Governance Matrix
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Granular permission capability mapping across Super Admin, Head Office, and Site User accounts
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                14 Policy Controls Active
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: 700, width: '45%' }}>
                    Platform Capability / Permission
                  </th>
                  {roles.map((r) => (
                    <th key={r.id} style={{ padding: '16px 20px', textAlign: 'center', width: '18%' }}>
                      <div style={{ fontWeight: 800, color: '#2B253E' }}>{r.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{r.subtitle}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionsList.map((perm) => (
                  <tr key={perm.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ fontWeight: 700, color: '#2B253E' }}>{perm.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{perm.desc}</div>
                      <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#94A3B8', marginTop: '2px' }}>
                        ID: {perm.id}
                      </div>
                    </td>
                    {roles.map((r) => {
                      const hasPermission = ROLE_PERMISSIONS[r.id].includes(perm.id);
                      return (
                        <td key={r.id} style={{ padding: '14px 20px', textAlign: 'center' }}>
                          {hasPermission ? (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#EAF8EF',
                                color: '#059669',
                              }}
                            >
                              <Check size={16} />
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#F1F5F9',
                                color: '#94A3B8',
                              }}
                            >
                              <X size={16} />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PO VALIDATION RULES */}
        {/* ============================================================ */}
        {activeTab === 'po-validation' && (
          <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <form
              onSubmit={handlePoSave}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
                Checkout & Requisition Validation Rules
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={requirePoNumber}
                    onChange={(e) => setRequirePoNumber(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#F73582', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                      Require Purchase Order (PO) Number at Checkout
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Mandates that store users enter a customer PO reference before order submission can proceed.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={poPrefixEnforced}
                    onChange={(e) => setPoPrefixEnforced(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#F73582', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                      Automated PO Prefix Format Verification
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Enforces that PO format begins with customer account acronym (e.g. <code>STJUDE-</code> or <code>APX-</code>).
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={requireDeliveryNotes}
                    onChange={(e) => setRequireDeliveryNotes(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#F73582', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                      Require Dispatch / Loading Dock Special Instructions
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Forces branch managers to provide pallet dock clearance details prior to warehouse dispatch.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enforceMoq}
                    onChange={(e) => setEnforceMoq(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#F73582', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                      Enforce Strict Minimum Order Quantity (MOQ)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Prevents adding items to cart if quantity is below the item MOQ threshold.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enforceOrderMultiples}
                    onChange={(e) => setEnforceOrderMultiples(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#F73582', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                      Enforce Bulk Pack Multiples (e.g. Packs of 50 / 100)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Cart quantities automatically round up to the nearest package multiple.
                    </div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    backgroundColor: '#F73582',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <Save size={16} />
                  <span>{poSaved ? 'Validation Rules Saved!' : 'Save Rules'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: ENTERPRISE APIS & WEBHOOKS */}
        {/* ============================================================ */}
        {activeTab === 'integrations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Overview Banner */}
            <div
              style={{
                backgroundColor: '#2B253E',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(43, 37, 62, 0.12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #F73582 0%, #FF7B83 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(247, 53, 130, 0.4)',
                  }}
                >
                  <Sparkles size={24} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Enterprise System Event Dispatcher
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                    Real-time outbound webhooks for PrintFlow CMYK production, Rahhawan 3PL WMS, and SAP/NetSuite ERP finance.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#58B97D' }}>99.8%</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Delivery SLA</div>
                </div>
              </div>
            </div>

            {/* Webhooks Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '22px',
                    boxShadow: '0 2px 8px rgba(43, 37, 62, 0.05)',
                    border: '1px solid rgba(43, 37, 62, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: wh.targetSystem === 'PRINT_PRODUCTION' ? '#FFF0F6' : wh.targetSystem === 'WAREHOUSE_3PL' ? '#EFF6FF' : '#FEF3C7',
                          color: wh.targetSystem === 'PRINT_PRODUCTION' ? '#F73582' : wh.targetSystem === 'WAREHOUSE_3PL' ? '#2563EB' : '#D97706',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {wh.targetSystem}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                        {wh.status}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2B253E', marginTop: '10px' }}>
                      {wh.name}
                    </div>

                    <div
                      style={{
                        marginTop: '10px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontFamily: 'monospace',
                        fontSize: '0.72rem',
                        color: '#475569',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {wh.url}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {wh.events.map((ev) => (
                        <span
                          key={ev}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                          }}
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '14px',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Calls: <strong>{wh.totalCalls}</strong> ({wh.successRatePct}%)
                    </div>
                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={() => handleTestTrigger(wh)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#2B253E',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={12} />
                      <span>{isTesting && selectedWebhook?.id === wh.id ? 'Sending...' : 'Test Trigger'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Trigger Result Display */}
            {testResult && selectedWebhook && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} color="#059669" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#059669' }}>
                      Webhook Dispatched Successfully (HTTP {testResult.code} OK - {testResult.responseTimeMs}ms)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Target: {selectedWebhook.name}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: '#0F172A', padding: '12px', borderRadius: '8px', color: '#94A3B8', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                    <div style={{ color: '#38BDF8', fontWeight: 700, marginBottom: '4px' }}>// Outbound Payload Sent</div>
                    <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(testResult.requestPayload, null, 2)}</pre>
                  </div>
                  <div style={{ backgroundColor: '#0F172A', padding: '12px', borderRadius: '8px', color: '#94A3B8', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                    <div style={{ color: '#4ADE80', fontWeight: 700, marginBottom: '4px' }}>// Remote Ingest Response Received</div>
                    <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(testResult.responseBody, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Logs Table */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
                border: '1px solid rgba(43, 37, 62, 0.06)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', fontWeight: 800, fontSize: '0.95rem', color: '#2B253E' }}>
                Recent Outbound Event Delivery Audit Log
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700 }}>Target System</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Event Trigger</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>HTTP Status</th>
                    <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>Response Time</th>
                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 24px', fontWeight: 700, color: '#2B253E' }}>
                        {log.webhookName}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#F73582' }}>
                        {log.event}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#EAF8EF',
                            color: '#059669',
                          }}
                        >
                          {log.httpCode} SUCCESS
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>
                        {log.responseTimeMs} ms
                      </td>
                      <td style={{ padding: '12px 24px', textAlign: 'right', color: '#94A3B8', fontSize: '0.75rem' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
      <AdminSettingsContent />
    </Suspense>
  );
}
