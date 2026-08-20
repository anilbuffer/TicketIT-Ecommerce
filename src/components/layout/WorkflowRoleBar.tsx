// src/components/layout/WorkflowRoleBar.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Building2,
  Store,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Palette,
  FileCheck,
  CreditCard,
  Truck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, ROLE_DETAILS } from '@/types/auth';

export function WorkflowRoleBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, switchUserRole, user } = useAuth();

  const handleSwitch = (newRole: UserRole) => {
    switchUserRole(newRole);
    if (newRole === 'admin') {
      router.push('/admin/templates');
    } else if (newRole === 'site_user') {
      router.push('/shop/templates');
    } else if (newRole === 'head_office') {
      router.push('/head-office/approvals');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1b38',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '6px 20px',
        color: '#ffffff',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        zIndex: 950,
      }}
    >
      {/* Workflow Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Workflow:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#cbd5e1' }}>
          <span style={{ color: role === 'admin' ? '#34d399' : '#94a3b8', fontWeight: role === 'admin' ? 800 : 500 }}>
            1. Admin (Builder & Rules)
          </span>
          <ChevronRight size={12} color="#64748b" />
          <span style={{ color: role === 'site_user' ? '#f472b6' : '#94a3b8', fontWeight: role === 'site_user' ? 800 : 500 }}>
            2. Site User (Customize & Submit PO)
          </span>
          <ChevronRight size={12} color="#64748b" />
          <span style={{ color: role === 'head_office' ? '#60a5fa' : '#94a3b8', fontWeight: role === 'head_office' ? 800 : 500 }}>
            3. Head Office (Approve & Pay)
          </span>
          <ChevronRight size={12} color="#64748b" />
          <span style={{ color: '#94a3b8' }}>4. Order Production & Delivery</span>
        </div>
      </div>

      {/* Quick 1-Click Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Switch Persona:</span>

        {/* Admin Button */}
        <button
          onClick={() => handleSwitch('admin')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: role === 'admin' ? '#059669' : 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            boxShadow: role === 'admin' ? '0 2px 6px rgba(5, 150, 105, 0.4)' : 'none',
          }}
        >
          <Palette size={12} />
          Admin (Builder)
        </button>

        {/* Site User Button */}
        <button
          onClick={() => handleSwitch('site_user')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: role === 'site_user' ? '#f73582' : 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            boxShadow: role === 'site_user' ? '0 2px 6px rgba(247, 53, 130, 0.4)' : 'none',
          }}
        >
          <Store size={12} />
          Site User (Shop & PO)
        </button>

        {/* Head Office Button */}
        <button
          onClick={() => handleSwitch('head_office')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: role === 'head_office' ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            boxShadow: role === 'head_office' ? '0 2px 6px rgba(37, 99, 235, 0.4)' : 'none',
          }}
        >
          <CreditCard size={12} />
          Head Office (Approve & Pay)
        </button>
      </div>
    </div>
  );
}
