'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../data/mockEvents';
import { SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  resultCount,
}) => {
  return (
    <div
      id="events"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {/* Category Pills Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              style={{
                position: 'relative',
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                background: isSelected ? 'var(--color-secondary)' : 'rgba(255, 255, 255, 0.8)',
                color: isSelected ? '#ffffff' : 'var(--color-secondary)',
                fontWeight: 700,
                fontSize: 'var(--font-size-sm)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--color-secondary)' : 'rgba(43, 37, 62, 0.1)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat.label}
              {isSelected && (
                <motion.div
                  layoutId="selectedCategoryBorder"
                  style={{
                    position: 'absolute',
                    inset: -2,
                    borderRadius: 'var(--radius-full)',
                    border: '2px solid var(--color-primary)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Results Header & Sort Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(43, 37, 62, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
            {selectedCategory === 'All' ? 'Upcoming Live Events' : selectedCategory}
          </h2>
          <span
            style={{
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 800,
            }}
          >
            {resultCount} {resultCount === 1 ? 'Event' : 'Events'}
          </span>
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SlidersHorizontal size={16} color="var(--color-text-muted)" />
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            SORT BY:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(43, 37, 62, 0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.8rem',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              color: 'var(--color-secondary)',
              cursor: 'pointer',
            }}
          >
            <option value="featured">Featured & Trending</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};
