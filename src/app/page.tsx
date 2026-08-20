'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '../components/layout/Container';
import { HeroBanner } from '../components/features/HeroBanner';
import { FilterBar } from '../components/features/FilterBar';
import { EventGrid } from '../components/features/EventGrid';
import { QuickViewModal } from '../components/features/QuickViewModal';
import { MOCK_EVENTS } from '../data/mockEvents';
import { EventItem } from '../types/event';
import { Sparkles, Shield, Zap, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewEvent, setQuickViewEvent] = useState<EventItem | null>(null);

  // Filter & Sort events
  const filteredEvents = useMemo(() => {
    let list = [...MOCK_EVENTS];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.city.toLowerCase().includes(q) ||
          e.location.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceStartingFrom - b.priceStartingFrom);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceStartingFrom - a.priceStartingFrom);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div>
      {/* Hero Section */}
      <Container>
        <HeroBanner
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCategory={setSelectedCategory}
        />
      </Container>

      {/* Trust Metrics Bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.65)',
          borderTop: '1px solid rgba(43, 37, 62, 0.08)',
          borderBottom: '1px solid rgba(43, 37, 62, 0.08)',
          padding: '1.25rem 0',
          marginBottom: '3rem',
        }}
      >
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                250k+
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', fontWeight: 600 }}>
                Tickets Sold in 2026
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-secondary)' }}>
                99.9%
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', fontWeight: 600 }}>
                Entry Guarantee Rate
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-green)' }}>
                4.9 ★
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', fontWeight: 600 }}>
                Verified Buyer Rating
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-anime-blush)' }}>
                Instant
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', fontWeight: 600 }}>
                Mobile Wallet Delivery
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Events Marketplace */}
      <Container>
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredEvents.length}
        />

        <EventGrid
          events={filteredEvents}
          onQuickView={(event) => setQuickViewEvent(event)}
        />
      </Container>

      {/* Promotional Callout Banner */}
      <Container style={{ marginTop: '5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, #1a1528 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: ' clamp(2rem, 5vw, 3.5rem)',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(247, 53, 130, 0.4) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(247, 53, 130, 0.2)',
                color: 'var(--color-anime-blush)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                marginBottom: '1rem',
                border: '1px solid rgba(247, 53, 130, 0.4)',
              }}
            >
              <Sparkles size={14} />
              <span>Limited Time Offer</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
              Get 20% Off Your First Booking with Code <span style={{ color: 'var(--color-primary)' }}>TICKETIT20</span>
            </h2>

            <p style={{ color: '#c3bfd4', fontSize: 'var(--font-size-md)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Experience high-energy stadium beats, championship matches, and keynote tech moments with zero hassle and verified authentic tickets.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  const element = document.getElementById('events');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 'var(--font-size-md)',
                  padding: '0.85rem 1.8rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-primary)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
              >
                Browse All Tickets
              </button>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Quick View Modal */}
      <QuickViewModal
        event={quickViewEvent}
        isOpen={Boolean(quickViewEvent)}
        onClose={() => setQuickViewEvent(null)}
      />
    </div>
  );
}
