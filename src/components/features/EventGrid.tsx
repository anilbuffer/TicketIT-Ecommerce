'use client';

import React from 'react';
import { EventItem } from '../../types/event';
import { EventCard } from './EventCard';
import { Sparkles } from 'lucide-react';

interface EventGridProps {
  events: EventItem[];
  onQuickView?: (event: EventItem) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({ events, onQuickView }) => {
  if (events.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed rgba(43, 37, 62, 0.2)',
          margin: '2rem 0',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}
        >
          <Sparkles size={28} />
        </div>
        <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>
          No Events Found
        </h3>
        <p style={{ color: 'var(--color-text-sub)', maxWidth: '400px', margin: '0 auto' }}>
          We couldn&apos;t find any events matching your selected category or search filters. Try resetting your search.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.75rem',
      }}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} onQuickView={onQuickView} />
      ))}
    </div>
  );
};
