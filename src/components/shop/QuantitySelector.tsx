// src/components/shop/QuantitySelector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import type { Product, EffectiveProduct } from '@/lib/services/types';
import { validateProductQty } from '@/context/CartContext';

interface QuantitySelectorProps {
  product: Product | EffectiveProduct;
  value: number;
  onChange: (qty: number, isValid: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showInlineHelp?: boolean;
}

export function QuantitySelector({
  product,
  value,
  onChange,
  size = 'md',
  disabled = false,
  showInlineHelp = true,
}: QuantitySelectorProps) {
  const moq = product.moq || 1;
  const multiple = product.orderMultiple || 1;
  const [inputValue, setInputValue] = useState<string>(String(value));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(String(value));
    const err = validateProductQty(product, value);
    setError(err);
  }, [value, product]);

  const handleStep = (direction: 'up' | 'down') => {
    if (disabled) return;
    const current = parseInt(inputValue, 10) || moq;
    let next: number;

    if (direction === 'up') {
      if (current < moq) {
        next = moq;
      } else {
        next = current + multiple;
      }
    } else {
      next = current - multiple;
      if (next < moq) {
        next = moq;
      }
    }

    const err = validateProductQty(product, next);
    setError(err);
    setInputValue(String(next));
    onChange(next, err === null);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseInt(raw, 10);

    if (isNaN(parsed) || raw.trim() === '') {
      setError('Please enter a valid quantity');
      onChange(0, false);
      return;
    }

    const err = validateProductQty(product, parsed);
    setError(err);
    onChange(parsed, err === null);
  };

  const dims = {
    sm: { btn: 28, inputWidth: 44, fontSize: '12px' },
    md: { btn: 34, inputWidth: 56, fontSize: '13px' },
    lg: { btn: 42, inputWidth: 68, fontSize: '15px' },
  }[size];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            border: error ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
            backgroundColor: disabled ? '#f8fafc' : '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <button
            type="button"
            onClick={() => handleStep('down')}
            disabled={disabled || value <= moq}
            aria-label="Decrease quantity"
            style={{
              width: `${dims.btn}px`,
              height: `${dims.btn}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: disabled || value <= moq ? 'not-allowed' : 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              opacity: disabled || value <= moq ? 0.35 : 1,
              transition: 'background-color 0.15s ease',
            }}
          >
            <Minus size={size === 'sm' ? 12 : 14} />
          </button>

          <input
            type="number"
            value={inputValue}
            onChange={handleManualInput}
            disabled={disabled}
            min={moq}
            step={multiple}
            style={{
              width: `${dims.inputWidth}px`,
              height: `${dims.btn}px`,
              fontWeight: 700,
              fontSize: dims.fontSize,
              textAlign: 'center',
              color: '#0f172a',
              backgroundColor: 'transparent',
              border: 'none',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              outline: 'none',
              padding: 0,
            }}
          />

          <button
            type="button"
            onClick={() => handleStep('up')}
            disabled={disabled}
            aria-label="Increase quantity"
            style={{
              width: `${dims.btn}px`,
              height: `${dims.btn}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Plus size={size === 'sm' ? 12 : 14} />
          </button>
        </div>

        {/* UOM / Pack size */}
        <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
          {product.uom || 'units'}
          {product.packSize ? ` (${product.packSize})` : ''}
        </span>
      </div>

      {/* Rules & error text */}
      {showInlineHelp && (
        <div style={{ minHeight: '16px' }}>
          {error ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
              <AlertCircle size={12} color="#dc2626" />
              <span>{error}</span>
            </div>
          ) : (moq > 1 || multiple > 1) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'inline-block' }}></span>
              <span>
                {moq > 1 && `MOQ: ${moq}`}
                {moq > 1 && multiple > 1 && ' • '}
                {multiple > 1 && `Multiple of ${multiple}`}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
