'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Star, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { EventItem } from '../../types/event';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface QuickViewModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Quick Preview" maxWidth="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner image */}
        <div style={{ position: 'relative', height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <Image
            src={event.bannerImage || event.image}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(43, 37, 62, 0.8) 100%)',
            }}
          />
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <Badge variant="glass" size="sm">
              {event.category}
            </Badge>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
            <div style={{ color: '#ffffff', fontSize: 'var(--font-size-xs)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={13} color="var(--color-anime-blush)" />
              <span>{event.displayDate}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
            {event.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-sub)', fontSize: 'var(--font-size-xs)', marginBottom: '0.85rem' }}>
            <MapPin size={14} color="var(--color-primary)" />
            <span>{event.location.venue}, {event.location.city}</span>
          </div>

          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {event.description}
          </p>

          {/* Highlights */}
          <div
            style={{
              background: 'rgba(231, 234, 239, 0.6)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-secondary)' }}>
              EVENT HIGHLIGHTS
            </div>
            {event.highlights.slice(0, 3).map((hl, i) => (
              <div key={i} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                <span>{hl}</span>
              </div>
            ))}
          </div>

          {/* Pricing & Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Tickets Starting At
              </div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-secondary)' }}>
                ${event.priceStartingFrom}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Button variant="outline" size="md" onClick={onClose}>
                Close
              </Button>
              <Link href={`/events/${event.id}`} onClick={onClose}>
                <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
                  View & Book Tickets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
