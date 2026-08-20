// src/components/shop/OrderStatusBadge.tsx
'use client';

import React from 'react';
import { OrderStatus } from '@/lib/services/types';
import { Clock, RefreshCw, Truck, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function OrderStatusBadge({ status, size = 'md', showIcon = true }: OrderStatusBadgeProps) {
  const iconSize = size === 'sm' ? 12 : 14;

  const configs: Record<
    OrderStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ReactNode;
    }
  > = {
    DRAFT: {
      label: 'Draft PO',
      bg: 'rgba(100, 116, 139, 0.08)',
      text: '#64748b',
      border: 'rgba(100, 116, 139, 0.25)',
      icon: <FileText size={iconSize} color="#64748b" />,
    },
    PENDING_APPROVAL: {
      label: 'Pending Approval',
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#b45309',
      border: 'rgba(245, 158, 11, 0.35)',
      icon: <Clock size={iconSize} color="#b45309" />,
    },
    CHANGES_REQUESTED: {
      label: 'Changes Requested',
      bg: 'rgba(234, 88, 12, 0.12)',
      text: '#c2410c',
      border: 'rgba(234, 88, 12, 0.35)',
      icon: <AlertCircle size={iconSize} color="#c2410c" />,
    },
    APPROVED: {
      label: 'Approved',
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#047857',
      border: 'rgba(16, 185, 129, 0.35)',
      icon: <CheckCircle2 size={iconSize} color="#047857" />,
    },
    PAID: {
      label: 'Payment Authorized',
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#047857',
      border: 'rgba(16, 185, 129, 0.35)',
      icon: <CheckCircle2 size={iconSize} color="#047857" />,
    },
    ORDER_PLACED: {
      label: 'Order Placed',
      bg: 'rgba(59, 130, 246, 0.08)',
      text: '#2563eb',
      border: 'rgba(59, 130, 246, 0.25)',
      icon: <CheckCircle2 size={iconSize} color="#2563eb" />,
    },
    IN_PRODUCTION: {
      label: 'In Production',
      bg: 'rgba(245, 158, 11, 0.08)',
      text: '#d97706',
      border: 'rgba(245, 158, 11, 0.25)',
      icon: <RefreshCw size={iconSize} color="#d97706" style={{ animation: 'spin 4s linear infinite' }} />,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'rgba(239, 68, 68, 0.12)',
      text: '#b91c1c',
      border: 'rgba(239, 68, 68, 0.35)',
      icon: <Clock size={iconSize} color="#b91c1c" />,
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'rgba(100, 116, 139, 0.12)',
      text: '#475569',
      border: 'rgba(100, 116, 139, 0.3)',
      icon: <Clock size={iconSize} color="#475569" />,
    },
    RECEIVED: {
      label: 'Order Received',
      bg: 'rgba(59, 130, 246, 0.08)',
      text: '#2563eb',
      border: 'rgba(59, 130, 246, 0.25)',
      icon: <Clock size={iconSize} color="#2563eb" />,
    },
    PROCESSING: {
      label: 'In Fulfilment',
      bg: 'rgba(245, 158, 11, 0.08)',
      text: '#d97706',
      border: 'rgba(245, 158, 11, 0.25)',
      icon: <RefreshCw size={iconSize} color="#d97706" style={{ animation: 'spin 4s linear infinite' }} />,
    },
    DISPATCHED: {
      label: 'Dispatched & In Transit',
      bg: 'rgba(168, 85, 247, 0.08)',
      text: '#7c3aed',
      border: 'rgba(168, 85, 247, 0.25)',
      icon: <Truck size={iconSize} color="#7c3aed" />,
    },
    DELIVERED: {
      label: 'Delivered to Site',
      bg: 'rgba(88, 185, 125, 0.08)',
      text: '#16a34a',
      border: 'rgba(88, 185, 125, 0.25)',
      icon: <CheckCircle2 size={iconSize} color="#16a34a" />,
    },
  };

  const current = configs[status] || configs.RECEIVED;

  const sizeStyles = {
    sm: { fontSize: '11px', padding: '2px 8px', gap: '4px', fontWeight: 600 },
    md: { fontSize: '12px', padding: '4px 10px', gap: '6px', fontWeight: 700 },
    lg: { fontSize: '13px', padding: '6px 14px', gap: '8px', fontWeight: 700 },
  }[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        ...sizeStyles,
      }}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
}
