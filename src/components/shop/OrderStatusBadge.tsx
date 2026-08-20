// src/components/shop/OrderStatusBadge.tsx
'use client';

import React from 'react';
import { OrderStatus } from '@/lib/services/types';
import { Clock, RefreshCw, Truck, CheckCircle2 } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function OrderStatusBadge({ status, size = 'md', showIcon = true }: OrderStatusBadgeProps) {
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
    RECEIVED: {
      label: 'Order Received',
      bg: 'rgba(59, 130, 246, 0.08)',
      text: '#2563eb',
      border: 'rgba(59, 130, 246, 0.25)',
      icon: <Clock size={size === 'sm' ? 12 : 14} className="text-blue-600" />,
    },
    PROCESSING: {
      label: 'In Fulfilment',
      bg: 'rgba(245, 158, 11, 0.08)',
      text: '#d97706',
      border: 'rgba(245, 158, 11, 0.25)',
      icon: <RefreshCw size={size === 'sm' ? 12 : 14} className="text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />,
    },
    DISPATCHED: {
      label: 'Dispatched & In Transit',
      bg: 'rgba(168, 85, 247, 0.08)',
      text: '#7c3aed',
      border: 'rgba(168, 85, 247, 0.25)',
      icon: <Truck size={size === 'sm' ? 12 : 14} className="text-purple-600" />,
    },
    DELIVERED: {
      label: 'Delivered to Site',
      bg: 'rgba(88, 185, 125, 0.08)',
      text: '#16a34a',
      border: 'rgba(88, 185, 125, 0.25)',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} className="text-emerald-600" />,
    },
  };

  const current = configs[status] || configs.RECEIVED;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide transition-all ${sizeClasses[size]}`}
      style={{
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
      }}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
}
