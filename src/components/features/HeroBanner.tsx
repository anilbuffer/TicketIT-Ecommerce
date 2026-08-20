'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, MapPin, Calendar, ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: '2.5rem',
        paddingBottom: '3.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(247, 53, 130, 0.18) 0%, rgba(255, 123, 131, 0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(88, 185, 125, 0.15) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top trending pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(247, 53, 130, 0.3)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.25rem',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-anime-blush))',
              color: '#ffffff',
            }}
          >
            <Flame size={13} />
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-secondary)' }}>
            2026 Season Tickets Live Now
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-primary)',
              fontWeight: 800,
              background: 'var(--color-primary-light)',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            NEW
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ maxWidth: '820px' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--color-secondary)',
              marginBottom: '1rem',
            }}
          >
            Discover Unforgettable{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-anime-blush) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Live Experiences
            </span>{' '}
            & Concerts
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              color: 'var(--color-text-sub)',
              maxWidth: '650px',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Book verified tickets for stadium tours, EDM festivals, keynote conferences, and Broadway spectacles with instant mobile delivery.
          </p>
        </motion.div>

        {/* Interactive Search & Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'var(--color-surface-translucent)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-xl)',
            padding: '1rem',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '850px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(231, 234, 239, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(43, 37, 62, 0.08)',
              }}
            >
              <Search size={20} color="var(--color-primary)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search artists, festivals, cities, or stadiums..."
                aria-label="Search events"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-text-main)',
                  fontWeight: 500,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    fontWeight: 700,
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Action Button */}
            <Link href="#events">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight size={18} />}
                style={{ height: '100%', whiteSpace: 'nowrap' }}
              >
                Find Tickets
              </Button>
            </Link>
          </div>

          {/* Quick Filter Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.9rem',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Popular:
            </span>
            {['Music Festivals', 'Tech Conferences', 'Concerts', 'Sports'].map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(43, 37, 62, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.7rem',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  color: 'var(--color-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(43, 37, 62, 0.1)';
                  e.currentTarget.style.color = 'var(--color-secondary)';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
