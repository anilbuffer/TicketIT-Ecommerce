'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Flame, ArrowUpRight, Eye } from 'lucide-react';
import { EventItem } from '../../types/event';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EventCardProps {
  event: EventItem;
  onQuickView?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onQuickView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--color-surface-translucent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      className="event-card"
    >
      {/* Top Media Banner */}
      <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          className="event-card-img"
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(43, 37, 62, 0.2) 0%, rgba(43, 37, 62, 0.75) 100%)',
          }}
        />

        {/* Badges Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <Badge variant="glass" size="sm">
            {event.category}
          </Badge>

          {event.isSellingFast && (
            <Badge variant="primary" size="sm" icon={<Flame size={12} />}>
              Selling Fast
            </Badge>
          )}
        </div>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(event);
            }}
            title="Quick View"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
              e.currentTarget.style.color = 'var(--color-secondary)';
            }}
          >
            <Eye size={16} />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Date & Rating Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)' }}>
              <Calendar size={14} />
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                {event.displayDate}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={13} fill="#ffb400" color="#ffb400" />
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-secondary)' }}>
                {event.rating}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                ({event.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/events/${event.id}`}>
            <h3
              style={{
                fontSize: '1.15rem',
                color: 'var(--color-secondary)',
                lineHeight: 1.35,
                marginBottom: '0.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {event.title}
            </h3>
          </Link>

          {/* Venue & Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-text-sub)',
              fontSize: 'var(--font-size-xs)',
              marginBottom: '1rem',
            }}
          >
            <MapPin size={13} color="var(--color-text-muted)" />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {event.location.venue}, {event.location.city}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div
          style={{
            paddingTop: '0.9rem',
            borderTop: '1px solid rgba(43, 37, 62, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              From
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-secondary)',
                }}
              >
                ${event.priceStartingFrom}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/ticket</span>
            </div>
          </div>

          <Link href={`/events/${event.id}`}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowUpRight size={15} />}
            >
              Get Tickets
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .event-card:hover .event-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </motion.div>
  );
};
