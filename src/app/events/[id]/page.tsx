'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Share2,
  Heart,
  HelpCircle,
  Award,
} from 'lucide-react';
import { MOCK_EVENTS } from '../../../data/mockEvents';
import { Container } from '../../../components/layout/Container';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { TicketSelector } from '../../../components/features/TicketSelector';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const event = MOCK_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    return (
      <Container style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '1rem', color: 'var(--color-secondary)' }}>
          Event Not Found
        </h2>
        <p style={{ color: 'var(--color-text-sub)', marginBottom: '2rem' }}>
          The requested event could not be found or has concluded.
        </p>
        <Link href="/">
          <Button variant="primary" size="md">
            Return to Marketplace
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ background: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid var(--color-border)', padding: '0.8rem 0' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 700,
                color: 'var(--color-secondary)',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to all events</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: event.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Event link copied to clipboard!');
                  }
                }}
                aria-label="Share event"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid var(--color-border)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  color: 'var(--color-secondary)',
                  cursor: 'pointer',
                }}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Event Banner */}
      <div style={{ position: 'relative', height: 'clamp(280px, 40vw, 420px)', width: '100%', overflow: 'hidden' }}>
        <Image
          src={event.bannerImage || event.image}
          alt={event.title}
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(43, 37, 62, 0.3) 0%, rgba(43, 37, 62, 0.85) 100%)',
          }}
        />

        <Container style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '2.5rem', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Badge variant="primary" size="sm">
              {event.category}
            </Badge>
            {event.isSellingFast && (
              <Badge variant="anime-blush" size="sm">
                High Demand
              </Badge>
            )}
          </div>

          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: '900px',
              marginBottom: '0.75rem',
            }}
          >
            {event.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', color: '#e0dded', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--color-anime-blush)" />
              <span>{event.displayDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--color-green)" />
              <span>{event.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="var(--color-primary)" />
              <span>{event.location.venue}, {event.location.city}</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Grid: Left Details & Right Ticket Selector */}
      <Container style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="event-detail-layout"
        >
          {/* Left Column: Overview, Highlights, Venue Info, FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* About Event */}
            <div
              style={{
                background: 'var(--color-surface-translucent)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                About This Experience
              </h2>
              <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-sub)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {event.description}
              </p>

              {/* Highlights Bullet List */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-secondary)', marginBottom: '0.85rem' }}>
                  Event Highlights & Experience
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                  {event.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        background: 'rgba(231, 234, 239, 0.5)',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-main)',
                      }}
                    >
                      <Zap size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div
              style={{
                background: 'var(--color-surface-translucent)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem 2rem',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--color-primary)',
                  }}
                >
                  <Image
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: 'var(--font-size-md)', color: 'var(--color-secondary)' }}>
                      {event.organizer.name}
                    </span>
                    {event.organizer.verified && (
                      <ShieldCheck size={16} color="var(--color-green)" />
                    )}
                  </div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Verified Official Event Producer
                  </span>
                </div>
              </div>

              <Badge variant="green" size="md">
                Verified Seller
              </Badge>
            </div>

            {/* Venue Location & Details */}
            <div
              style={{
                background: 'var(--color-surface-translucent)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                Venue Location
              </h2>
              <p style={{ color: 'var(--color-text-sub)', fontSize: 'var(--font-size-sm)', marginBottom: '1.25rem' }}>
                {event.location.venue} • {event.location.address}, {event.location.city}
              </p>

              {/* Styled interactive map mockup */}
              <div
                style={{
                  height: '220px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #2b253e 0%, #1f1a2e 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.15,
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-primary)',
                    marginBottom: '0.75rem',
                    zIndex: 1,
                  }}
                >
                  <MapPin size={24} color="#ffffff" />
                </div>
                <div style={{ fontWeight: 800, fontSize: 'var(--font-size-md)', zIndex: 1 }}>
                  {event.location.venue}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: '#b2adc4', zIndex: 1 }}>
                  {event.location.address}, {event.location.city}
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div
              style={{
                background: 'var(--color-surface-translucent)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(231, 234, 239, 0.6)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)', marginBottom: '0.3rem' }}>
                    How do I receive my tickets?
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', lineHeight: 1.5 }}>
                    Tickets are issued digitally immediately upon successful checkout. You can add them directly to Apple Wallet or Google Wallet, or present the QR code at the door.
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(231, 234, 239, 0.6)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)', marginBottom: '0.3rem' }}>
                    What is the refund or cancellation policy?
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', lineHeight: 1.5 }}>
                    All purchases are protected by our 100% Buyer Guarantee. If the event is postponed or cancelled, full refunds are automatically processed within 3 business days.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Ticket Selector */}
          <div style={{ position: 'sticky', top: '90px' }} className="sticky-ticket-selector">
            <TicketSelector event={event} />
          </div>
        </div>
      </Container>

      <style jsx>{`
        @media (min-width: 1024px) {
          .event-detail-layout {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
