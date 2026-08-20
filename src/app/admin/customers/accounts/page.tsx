// src/app/admin/customers/accounts/page.tsx
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Building2,
  MapPin,
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Shield,
  Truck,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { useAccounts, useSites, useUsers, useAccountMutations } from '@/lib/hooks/useAccounts';
import type { PortalUser } from '@/lib/services/types';

type AccountsTab = 'accounts' | 'sites' | 'users';

function CustomerAccountsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTabParam = (searchParams.get('tab') as AccountsTab) || 'accounts';
  const [activeTab, setActiveTab] = useState<AccountsTab>(
    ['accounts', 'sites', 'users'].includes(activeTabParam) ? activeTabParam : 'accounts'
  );

  const setTab = (tab: AccountsTab) => {
    setActiveTab(tab);
    router.replace(`/admin/customers/accounts?tab=${tab}`);
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState('');

  // Data Hooks
  const { data: accountsData, isLoading: isAccountsLoading, refetch: refetchAccounts } = useAccounts({ search: searchQuery });
  const { data: sitesData, isLoading: isSitesLoading, refetch: refetchSites } = useSites({ search: searchQuery });
  const { data: usersData, isLoading: isUsersLoading, refetch: refetchUsers } = useUsers({ search: searchQuery });
  const { createAccount, createSite, createUser } = useAccountMutations();

  // Add Item States
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Account Form State
  const [accName, setAccName] = useState('');
  const [accCode, setAccCode] = useState('');
  const [accContactEmail, setAccContactEmail] = useState('');
  const [accContactPhone, setAccContactPhone] = useState('');

  // New Site Form State
  const [siteName, setSiteName] = useState('');
  const [siteCode, setSiteCode] = useState('');
  const [siteAccountId, setSiteAccountId] = useState('');
  const [siteStreet, setSiteStreet] = useState('');
  const [siteCity, setSiteCity] = useState('');
  const [siteState, setSiteState] = useState('');
  const [sitePostalCode, setSitePostalCode] = useState('');

  // New User Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<PortalUser['role']>('SITE_USER');
  const [userSiteId, setUserSiteId] = useState('');
  const [userDepartment, setUserDepartment] = useState('');
  const [userBudgetCap, setUserBudgetCap] = useState(15000);

  // Handlers
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName || !accCode || !accContactEmail) return;
    setIsSubmitting(true);
    try {
      await createAccount({
        name: accName,
        accountCode: accCode,
        status: 'ACTIVE',
        contactEmail: accContactEmail,
        contactPhone: accContactPhone,
      });
      setAccName('');
      setAccCode('');
      setAccContactEmail('');
      setAccContactPhone('');
      setIsAdding(false);
      refetchAccounts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !siteCode || !siteAccountId) return;
    const acc = accountsData?.items.find((a) => a.id === siteAccountId);
    setIsSubmitting(true);
    try {
      await createSite({
        accountId: siteAccountId,
        accountName: acc?.name,
        name: siteName,
        code: siteCode,
        billToAddress: {
          street: siteStreet || '550 Lexington Avenue',
          city: siteCity || 'New York',
          state: siteState || 'NY',
          postalCode: sitePostalCode || '10022',
          country: 'USA',
        },
        shipToAddress: {
          street: siteStreet || '550 Lexington Avenue',
          city: siteCity || 'New York',
          state: siteState || 'NY',
          postalCode: sitePostalCode || '10022',
          country: 'USA',
        },
      });
      setSiteName('');
      setSiteCode('');
      setSiteStreet('');
      setSiteCity('');
      setSiteState('');
      setSitePostalCode('');
      setIsAdding(false);
      refetchSites();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    const site = sitesData?.items.find((s) => s.id === userSiteId);
    setIsSubmitting(true);
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
      setIsAdding(false);
      refetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionBtnLabel = () => {
    if (isAdding) return 'Cancel';
    if (activeTab === 'accounts') return 'New Account';
    if (activeTab === 'sites') return 'New Branch Site';
    return 'Invite New User';
  };

  const filteredSites = sitesData?.items.filter((site) => {
    if (!selectedAccountFilter) return true;
    return site.accountId === selectedAccountFilter;
  });

  return (
    <>
      <AdminHeader
        title="Customer Accounts & Organization Hub"
        subtitle="Consolidated management of healthcare networks, branch physical sites, and authorized portal users"
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
              backgroundColor: isAdding ? '#475569' : '#F73582',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 150ms ease',
            }}
          >
            <Plus size={16} />
            <span>{getActionBtnLabel()}</span>
          </button>
        }
      />

      <main style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          }}
        >
          <button
            type="button"
            onClick={() => {
              setTab('accounts');
              setIsAdding(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'accounts' ? '#2B253E' : 'transparent',
              color: activeTab === 'accounts' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Building2 size={16} color={activeTab === 'accounts' ? '#F73582' : '#94A3B8'} />
            <span>Customer Accounts</span>
            {accountsData?.items && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  backgroundColor: activeTab === 'accounts' ? 'rgba(247, 53, 130, 0.25)' : '#F1F5F9',
                  color: activeTab === 'accounts' ? '#FFFFFF' : '#64748B',
                }}
              >
                {accountsData.items.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('sites');
              setIsAdding(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'sites' ? '#2B253E' : 'transparent',
              color: activeTab === 'sites' ? '#FFFFFF' : '#64748B',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <MapPin size={16} color={activeTab === 'sites' ? '#F73582' : '#94A3B8'} />
            <span>Site Branches & Hubs</span>
            {sitesData?.items && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  backgroundColor: activeTab === 'sites' ? 'rgba(247, 53, 130, 0.25)' : '#F1F5F9',
                  color: activeTab === 'sites' ? '#FFFFFF' : '#64748B',
                }}
              >
                {sitesData.items.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('users');
              setIsAdding(false);
            }}
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
            <span>Account Users & Roles</span>
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
        </div>

        {/* Dynamic Add Form based on Active Tab */}
        {isAdding && activeTab === 'accounts' && (
          <form
            onSubmit={handleCreateAccount}
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
              <Building2 size={18} color="#F73582" />
              <span>Create New Enterprise Healthcare Account</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Account / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude Healthcare Network"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Account Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STJUDE-005"
                  value={accCode}
                  onChange={(e) => setAccCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Procurement Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="procurement@organization.org"
                  value={accContactEmail}
                  onChange={(e) => setAccContactEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={accContactPhone}
                  onChange={(e) => setAccContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#F73582', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Registering...' : 'Register Account'}
              </button>
            </div>
          </form>
        )}

        {isAdding && activeTab === 'sites' && (
          <form
            onSubmit={handleCreateSite}
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
              <MapPin size={18} color="#F73582" />
              <span>Add New Physical Site / Dispensary Branch</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Parent Account Organization *
                </label>
                <select
                  required
                  value={siteAccountId}
                  onChange={(e) => setSiteAccountId(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value="">Select Account...</option>
                  {accountsData?.items.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.accountCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Branch Site Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Queens Infusion Center"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Site Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APX-QN-106"
                  value={siteCode}
                  onChange={(e) => setSiteCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Main St"
                  value={siteStreet}
                  onChange={(e) => setSiteStreet(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  City & State
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, NY"
                  value={siteCity}
                  onChange={(e) => setSiteCity(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="10001"
                  value={sitePostalCode}
                  onChange={(e) => setSitePostalCode(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#F73582', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Registering...' : 'Register Site'}
              </button>
            </div>
          </form>
        )}

        {isAdding && activeTab === 'users' && (
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
                onClick={() => setIsAdding(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#F73582', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Access Invite'}
              </button>
            </div>
          </form>
        )}

        {/* Global Search & Filters Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(43, 37, 62, 0.04)',
            border: '1px solid rgba(43, 37, 62, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder={
                activeTab === 'accounts'
                  ? 'Search accounts by organization name or account code...'
                  : activeTab === 'sites'
                  ? 'Search branches by site name, code, or address...'
                  : 'Search users by name, email, or role...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', width: '100%', fontSize: '0.85rem', outline: 'none', color: '#2B253E' }}
            />
          </div>

          {activeTab === 'sites' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Filter Org:</span>
              <select
                value={selectedAccountFilter}
                onChange={(e) => setSelectedAccountFilter(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', color: '#2B253E' }}
              >
                <option value="">All Accounts</option>
                {accountsData?.items.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: ACCOUNTS TABLE */}
        {activeTab === 'accounts' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
              border: '1px solid rgba(43, 37, 62, 0.06)',
              overflow: 'hidden',
            }}
          >
            {isAccountsLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading accounts...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '14px 24px', color: '#64748B', fontWeight: 700 }}>Account Name</th>
                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700 }}>Account Code</th>
                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700 }}>Sites Count</th>
                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700 }}>Active Rate Card</th>
                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Monthly Spend</th>
                    <th style={{ padding: '14px 24px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsData?.items.map((acc) => (
                    <tr key={acc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 24px', fontWeight: 700, color: '#2B253E' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Building2 size={16} color="#2B253E" />
                          </div>
                          <div>
                            <div>{acc.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>{acc.contactEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#475569', fontSize: '0.8rem' }}>
                        {acc.accountCode}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#2B253E' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountFilter(acc.id);
                            setTab('sites');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#F73582',
                            cursor: 'pointer',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0,
                          }}
                        >
                          <span>{acc.sitesCount || 0} Branches</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>
                        {acc.activeRateCardName || 'Standard Baseline'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#2B253E' }}>
                        ${(acc.totalMonthlySpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <StatusPill status={acc.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: SITE BRANCHES GRID */}
        {activeTab === 'sites' && (
          <div>
            {isSitesLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading site branches...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                {filteredSites?.map((site) => (
                  <div
                    key={site.id}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: '#FFF0F6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MapPin size={17} color="#F73582" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2B253E' }}>{site.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{site.accountName}</div>
                          </div>
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
                          {site.code}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: '14px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          fontSize: '0.78rem',
                          color: '#475569',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#2B253E', marginBottom: '2px' }}>Ship-To Address:</div>
                        <div>{site.shipToAddress.street}, {site.shipToAddress.suite || ''}</div>
                        <div>{site.shipToAddress.city}, {site.shipToAddress.state} {site.shipToAddress.postalCode}</div>
                      </div>
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
                      <span style={{ color: '#64748B' }}>
                        <strong>{site.activeUsersCount || 1}</strong> Authorized Users
                      </span>
                      <span style={{ color: '#F73582', fontWeight: 800 }}>
                        ${(site.monthlySpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} spend
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT USERS TABLE */}
        {activeTab === 'users' && (
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
        )}
      </main>
    </>
  );
}

export default function CustomerAccountsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
      <CustomerAccountsContent />
    </Suspense>
  );
}
