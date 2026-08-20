'use client';

import React from 'react';

interface TicketITLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

export const TicketITLogo: React.FC<TicketITLogoProps> = ({
  size = 'md',
  showTagline = true,
  theme = 'light',
  className = '',
}) => {
  // Dimensions scaling
  const dimensions = {
    sm: { width: 140, height: 42, fontSizeText: 26, fontSizeIT: 24, taglineSize: 8 },
    md: { width: 190, height: 56, fontSizeText: 34, fontSizeIT: 30, taglineSize: 9.5 },
    lg: { width: 240, height: 72, fontSizeText: 44, fontSizeIT: 38, taglineSize: 12 },
    xl: { width: 300, height: 90, fontSizeText: 56, fontSizeIT: 48, taglineSize: 14 },
  }[size];

  const textColor = theme === 'dark' ? '#FFFFFF' : '#2B253E';
  const taglineColor = theme === 'dark' ? '#A6A0B8' : '#5C566E';
  const bubbleColor = '#F73582'; // TicketIT brand pink

  return (
    <div
      className={`ticketit-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        userSelect: 'none',
      }}
    >
      {/* Main Logo Row: Ticket + [IT Bubble] */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: size === 'sm' ? '4px' : size === 'lg' ? '8px' : '6px',
        }}
      >
        {/* "Ticket" Text */}
        <span
          style={{
            fontFamily: '"Acumin Pro", "Acumin", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: `${dimensions.fontSizeText}px`,
            fontWeight: 900,
            color: textColor,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          Ticket
        </span>

        {/* Hot Pink Speech Bubble with "IT" */}
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bubbleColor,
            color: '#FFFFFF',
            borderRadius: `${dimensions.fontSizeIT * 0.55}px ${dimensions.fontSizeIT * 0.55}px ${dimensions.fontSizeIT * 0.55}px 4px`,
            padding: `${dimensions.fontSizeIT * 0.15}px ${dimensions.fontSizeIT * 0.32}px`,
            minWidth: `${dimensions.fontSizeIT * 1.25}px`,
            boxShadow: '0 4px 14px rgba(247, 53, 130, 0.32)',
          }}
        >
          <span
            style={{
              fontFamily: '"Acumin Pro", "Acumin", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: `${dimensions.fontSizeIT}px`,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
              lineHeight: 1,
              transform: 'translateY(-0.5px)',
            }}
          >
            IT
          </span>

          {/* Little speech tail at bottom-left */}
          <div
            style={{
              position: 'absolute',
              bottom: '-3px',
              left: '4px',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `5px solid ${bubbleColor}`,
              transform: 'rotate(25deg)',
            }}
          />
        </div>
      </div>

      {/* Tagline: Content—Automation—Display */}
      {showTagline && (
        <div
          style={{
            fontFamily: '"Acumin Pro", "Acumin", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: `${dimensions.taglineSize}px`,
            fontWeight: 700,
            color: taglineColor,
            letterSpacing: '0.04em',
            marginTop: size === 'sm' ? '2px' : '4px',
            paddingLeft: '1px',
          }}
        >
          Content—Automation—Display
        </div>
      )}
    </div>
  );
};
