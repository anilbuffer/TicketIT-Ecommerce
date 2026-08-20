'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'green' | 'anime-blush' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  fullWidth = false,
  disabled,
  ...props
}) => {
  // Styles based on variant
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--color-primary)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-primary)',
          border: '1px solid transparent',
        };
      case 'secondary':
        return {
          background: 'var(--color-secondary)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid transparent',
        };
      case 'green':
        return {
          background: 'var(--color-green)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-green)',
          border: '1px solid transparent',
        };
      case 'anime-blush':
        return {
          background: 'var(--color-anime-blush)',
          color: '#ffffff',
          boxShadow: '0 8px 25px rgba(255, 123, 131, 0.3)',
          border: '1px solid transparent',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--color-secondary)',
          border: '2px solid var(--color-border)',
        };
      case 'ghost':
        return {
          background: 'rgba(255, 255, 255, 0.4)',
          color: 'var(--color-secondary)',
          border: '1px solid var(--color-border-light)',
          backdropFilter: 'blur(8px)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.45rem 0.9rem',
          fontSize: 'var(--font-size-xs)',
          borderRadius: 'var(--radius-sm)',
        };
      case 'lg':
        return {
          padding: '0.95rem 2rem',
          fontSize: 'var(--font-size-lg)',
          borderRadius: 'var(--radius-lg)',
        };
      case 'md':
      default:
        return {
          padding: '0.7rem 1.4rem',
          fontSize: 'var(--font-size-sm)',
          borderRadius: 'var(--radius-md)',
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)',
    ...getSizeStyles(),
    ...getVariantStyles(),
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.025, y: -1 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.975 }}
      style={baseStyles}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </motion.button>
  );
};
