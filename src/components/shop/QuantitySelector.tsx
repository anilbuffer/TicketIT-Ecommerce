// src/components/shop/QuantitySelector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, AlertCircle, Check } from 'lucide-react';
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
        next = moq; // don't step below MOQ with buttons
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

  const sizeClasses = {
    sm: {
      btn: 'w-7 h-7 text-xs',
      input: 'w-12 h-7 text-xs',
      container: 'text-xs',
    },
    md: {
      btn: 'w-9 h-9 text-sm',
      input: 'w-16 h-9 text-sm',
      container: 'text-sm',
    },
    lg: {
      btn: 'w-11 h-11 text-base',
      input: 'w-20 h-11 text-base',
      container: 'text-base',
    },
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="inline-flex items-center">
        <div
          className={`flex items-center rounded-lg border bg-white shadow-sm overflow-hidden transition-colors ${
            error
              ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-100'
              : 'border-slate-200 hover:border-slate-300 focus-within:ring-2 focus-within:ring-pink-100 focus-within:border-[#F73582]'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
        >
          <button
            type="button"
            onClick={() => handleStep('down')}
            disabled={disabled || value <= moq}
            aria-label="Decrease quantity"
            className={`${sizeClasses[size].btn} flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
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
            className={`${sizeClasses[size].input} font-semibold text-center text-slate-900 bg-transparent border-x border-slate-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />

          <button
            type="button"
            onClick={() => handleStep('up')}
            disabled={disabled}
            aria-label="Increase quantity"
            className={`${sizeClasses[size].btn} flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
          >
            <Plus size={size === 'sm' ? 12 : 14} />
          </button>
        </div>

        {/* UOM / Pack note badge */}
        <span className="ml-2.5 text-xs text-slate-500 font-medium whitespace-nowrap">
          {product.uom || 'units'}
          {product.packSize ? ` (${product.packSize})` : ''}
        </span>
      </div>

      {/* Rules & Errors display */}
      {showInlineHelp && (
        <div className="min-h-[18px]">
          {error ? (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          ) : (moq > 1 || multiple > 1) ? (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span>
                {moq > 1 && `MOQ: ${moq}`}
                {moq > 1 && multiple > 1 && ' • '}
                {multiple > 1 && `Must order in multiples of ${multiple}`}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
