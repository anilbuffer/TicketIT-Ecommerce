// src/app/admin/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const isReadOnly = role === 'head_office';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#E7EAEF',
        color: '#2B253E',
        overflowX: 'clip',
      }}
    >
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Responsive Admin Sidebar (Desktop sticky / Mobile slide-over drawer) */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            width: '100%',
            overflowX: 'clip',
          }}
        >
          {isReadOnly && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                borderBottom: '1px solid #fde68a',
                padding: '0.55rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: '#92400e',
                fontWeight: 700,
                zIndex: 35,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} color="#d97706" />
                <span>
                  <strong>Head Office Read-Only Mode:</strong> Multi-site status visibility enabled across all 34 branches. Status actions & mutations require Platform Admin clearance.
                </span>
              </div>
              <Link
                href="/head-office"
                style={{
                  color: '#b45309',
                  textDecoration: 'underline',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>Go to Head Office Portal</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['admin', 'head_office']}>
      <SidebarProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </SidebarProvider>
    </AuthGuard>
  );
}
