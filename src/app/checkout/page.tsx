'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle,
  QrCode,
  Ticket,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function CheckoutPage() {
  const { cart, summary, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderNumber(`TKT-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Container style={{ padding: '4rem 1.5rem', maxWidth: '680px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border-light)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--color-green-light)',
              color: 'var(--color-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <CheckCircle size={40} />
          </div>

          <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h1>
          <p style={{ color: 'var(--color-text-sub)', fontSize: 'var(--font-size-md)', marginBottom: '1.5rem' }}>
            Your digital pass and receipt have been issued and sent to your email.
          </p>

          <div
            style={{
              background: 'rgba(231, 234, 239, 0.6)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                ORDER NUMBER
              </span>
              <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                {orderNumber}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                DELIVERY METHOD
              </span>
              <span style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: 'var(--font-size-xs)' }}>
                Instant Digital Pass + Mobile Wallet
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
              <QrCode size={48} color="var(--color-secondary)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)' }}>
                  Digital Entry QR Code
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-green)', fontWeight: 700 }}>
                  Ready to scan at venue entrance
                </div>
              </div>
            </div>
          </div>

          <Link href="/">
            <Button variant="primary" size="lg" fullWidth>
              Explore More Events
            </Button>
          </Link>
        </motion.div>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <Ticket size={30} />
        </div>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>
          Your basket is empty
        </h2>
        <p style={{ color: 'var(--color-text-sub)', marginBottom: '2rem' }}>
          Select your tickets from our event marketplace before proceeding to checkout.
        </p>
        <Link href="/">
          <Button variant="primary" size="md">
            Browse Events
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <Container>
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 700,
            color: 'var(--color-secondary)',
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Continue browsing tickets</span>
        </Link>

        <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-secondary)', marginBottom: '2rem' }}>
          Secure Checkout
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="checkout-layout"
        >
          {/* Form Column */}
          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Step 1: Contact Details */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--color-secondary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  1
                </span>
                <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-secondary)' }}>
                  Buyer Information
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
                <Input
                  label="Mobile Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            {/* Step 2: Payment Details */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--color-secondary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    2
                  </span>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-secondary)' }}>
                    Payment Details
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-green)', fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  <Lock size={14} />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="4000 1234 5678 9010"
                  leftIcon={<CreditCard size={16} />}
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Expiration Date"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="Security Code (CVC)"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isProcessing}
              leftIcon={<Lock size={18} />}
            >
              Pay ${summary.total.toFixed(2)} & Receive Tickets
            </Button>
          </form>

          {/* Right Column: Order Summary */}
          <div
            style={{
              background: 'var(--color-surface-translucent)',
              backdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
              Order Summary ({summary.totalTickets} {summary.totalTickets === 1 ? 'Item' : 'Items'})
            </h3>

            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={item.eventImage} alt={item.eventTitle} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {item.eventTitle}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {item.quantity}x {item.ticketTier.name}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)' }}>
                    ${(item.ticketTier.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 'var(--font-size-xs)', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-sub)' }}>
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-green)', fontWeight: 700 }}>
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-sub)' }}>
                <span>Service Fee (8%)</span>
                <span>${summary.serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-sub)' }}>
                <span>Tax (5%)</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  fontWeight: 800,
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-secondary)',
                }}
              >
                <span>Total Due</span>
                <span style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)' }}>
                  ${summary.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(88, 185, 125, 0.1)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-green)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={16} />
              <span>Full Buyer Protection with guaranteed entrance</span>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @media (min-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
