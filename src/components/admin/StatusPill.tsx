// src/components/admin/StatusPill.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { OrderStatus, ProductStatus } from '@/lib/services/types';

interface StatusPillProps {
  status: OrderStatus | ProductStatus | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'SETTLED' | 'PENDING' | 'DISPUTED' | string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'RECEIVED':
        return {
          bg: '#FFF0F6',
          text: '#F73582',
          border: 'rgba(247, 53, 130, 0.25)',
          dot: '#F73582',
          label: 'Received',
        };
      case 'PROCESSING':
        return {
          bg: '#FEF3C7',
          text: '#D97706',
          border: 'rgba(217, 119, 6, 0.25)',
          dot: '#F59E0B',
          label: 'Processing',
        };
      case 'DISPATCHED':
        return {
          bg: '#E0F2FE',
          text: '#0284C7',
          border: 'rgba(2, 132, 199, 0.25)',
          dot: '#0EA5E9',
          label: 'Dispatched',
        };
      case 'DELIVERED':
      case 'ACTIVE':
      case 'SETTLED':
        return {
          bg: '#EAF8EF',
          text: '#228B53',
          border: 'rgba(88, 185, 125, 0.3)',
          dot: '#58B97D',
          label: status === 'DELIVERED' ? 'Delivered' : status === 'ACTIVE' ? 'Active' : 'Settled',
        };
      case 'UNAVAILABLE':
      case 'PENDING':
        return {
          bg: '#FEF2F2',
          text: '#DC2626',
          border: 'rgba(220, 38, 38, 0.25)',
          dot: '#EF4444',
          label: status === 'UNAVAILABLE' ? 'Unavailable' : 'Pending',
        };
      case 'SUPERSEDED':
      case 'INACTIVE':
      case 'SUSPENDED':
        return {
          bg: '#F1F5F9',
          text: '#64748B',
          border: 'rgba(100, 116, 139, 0.25)',
          dot: '#94A3B8',
          label: status === 'SUPERSEDED' ? 'Superseded' : status === 'INACTIVE' ? 'Inactive' : 'Suspended',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          border: 'rgba(148, 163, 184, 0.25)',
          dot: '#94A3B8',
          label: status,
        };
    }
  };

  const config = getStatusStyles();

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '0.72rem', dotSize: 5 },
    md: { padding: '4px 11px', fontSize: '0.8rem', dotSize: 6 },
    lg: { padding: '6px 14px', fontSize: '0.88rem', dotSize: 7 },
  }[size];

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        borderRadius: '9999px',
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontWeight: 700,
        letterSpacing: '0.01em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: sizeStyles.dotSize,
          height: sizeStyles.dotSize,
          borderRadius: '50%',
          backgroundColor: config.dot,
          display: 'inline-block',
          boxShadow: `0 0 6px ${config.dot}`,
        }}
      />
      {config.label}
    </motion.span>
  );
}
