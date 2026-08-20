'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../types/auth';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RootHomePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && role && ROLE_DETAILS[role]) {
        router.replace(ROLE_DETAILS[role].defaultRedirect);
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, role, isLoading, router]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #E7EAEF 0%, #dce2eb 100%)',
        padding: '2rem 1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(43, 37, 62, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: 900,
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
          }}
        >
          Y
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
          Yellow Marketing Portal
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Directing to the secure enterprise login portal...
        </p>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: '#10b981',
            margin: '0 auto 1.5rem auto',
          }}
        />

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#059669',
              textDecoration: 'none',
            }}
          >
            <span>Click here if not redirected automatically</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
