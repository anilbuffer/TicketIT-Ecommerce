'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Building2,
  Store,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, DEMO_USERS, ROLE_DETAILS } from '../../types/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login, user, isAuthenticated } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>('site_user');
  const [email, setEmail] = useState<string>(DEMO_USERS.site_user.email);
  const [password, setPassword] = useState<string>(DEMO_USERS.site_user.defaultPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When role card is clicked, auto-fill demo credentials
  const handleSelectRole = (roleKey: UserRole) => {
    setSelectedRole(roleKey);
    setEmail(DEMO_USERS[roleKey].email);
    setPassword(DEMO_USERS[roleKey].defaultPassword);
    setErrorMessage(null);
  };

  const handleClearSelection = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole && !email.trim()) {
      setErrorMessage('Please select a portal role or enter your enterprise email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await login(email, password, selectedRole || undefined);
      if (res.success) {
        // Determine redirect destination
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (selectedRole) {
          router.push(ROLE_DETAILS[selectedRole].defaultRedirect);
        } else {
          router.push('/portal/site-user');
        }
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your credentials.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage('Authentication error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const rolesConfig: {
    key: UserRole;
    icon: React.ReactNode;
    title: string;
    sub: string;
    color: string;
    bgHover: string;
  }[] = [
    {
      key: 'site_user',
      icon: <Store size={26} color="#58b97d" />,
      title: 'Customer / Site',
      sub: 'Store Ordering Hub',
      color: '#58b97d',
      bgHover: 'rgba(88, 185, 125, 0.08)',
    },
    {
      key: 'head_office',
      icon: <Building2 size={26} color="#7c5cdb" />,
      title: 'Head Office',
      sub: 'Consolidated Billing',
      color: '#7c5cdb',
      bgHover: 'rgba(124, 92, 219, 0.08)',
    },
    {
      key: 'admin',
      icon: <Shield size={26} color="#f73582" />,
      title: 'Portal Admin',
      sub: 'Platform DAM HQ',
      color: '#f73582',
      bgHover: 'rgba(247, 53, 130, 0.08)',
    },
  ];

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem 4rem 1rem',
        background: 'linear-gradient(180deg, #E7EAEF 0%, #dce2eb 100%)',
      }}
    >
      {/* Centered Mockup-Matched Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(43, 37, 62, 0.12), 0 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.4rem',
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            Y
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#1e293b',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Yellow Marketing
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
              Marketing Asset Delivery & Ecommerce CMS
            </div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '0.4rem',
            }}
          >
            Select Your Portal
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.45 }}>
            Choose your role to access your portal. Demo credentials will auto-fill.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {/* Section: PORTAL ACCESS */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                PORTAL ACCESS
              </span>
              {selectedRole && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  style={{
                    fontSize: '0.72rem',
                    color: '#f73582',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset Selection
                </button>
              )}
            </div>

            {/* 3 Role Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
              }}
            >
              {rolesConfig.map((item) => {
                const isSelected = selectedRole === item.key;
                return (
                  <motion.button
                    key={item.key}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectRole(item.key)}
                    style={{
                      background: isSelected ? '#ffffff' : '#f8fafc',
                      borderRadius: '16px',
                      padding: '1rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: isSelected ? `2px solid ${item.color}` : '1.5px solid #e2e8f0',
                      boxShadow: isSelected
                        ? `0 8px 20px -4px ${item.color}33, 0 2px 6px rgba(0,0,0,0.05)`
                        : 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Role Icon */}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: isSelected ? `${item.color}18` : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.65rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: isSelected ? item.color : '#1e293b',
                        lineHeight: 1.2,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: '#64748b',
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.sub}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Email Address Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.4rem',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole ? 'Enter your portal email...' : 'Select a portal role above...'}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: selectedRole ? '#ffffff' : '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.4rem',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={selectedRole ? 'Enter password...' : 'Select a portal role above...'}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 2.8rem 0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: selectedRole ? '#ffffff' : '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid #fca5a5',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Selected Role Meta Note */}
          {selectedRole && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: 'rgba(231, 234, 239, 0.65)',
                border: '1px solid rgba(43, 37, 62, 0.08)',
                fontSize: '0.75rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={15} color={ROLE_DETAILS[selectedRole].themeColor} />
              <span>
                Simulating: <strong>{DEMO_USERS[selectedRole].user.name}</strong> •{' '}
                {DEMO_USERS[selectedRole].user.organization}
              </span>
            </div>
          )}

          {/* Primary Action Button */}
          <motion.button
            type="submit"
            whileHover={selectedRole ? { scale: 1.01 } : {}}
            whileTap={selectedRole ? { scale: 0.98 } : {}}
            disabled={!selectedRole || isSubmitting}
            style={{
              width: '100%',
              padding: '0.95rem 1.25rem',
              borderRadius: '12px',
              background: !selectedRole
                ? '#cbd5e1'
                : 'linear-gradient(135deg, var(--color-secondary) 0%, #362f4e 100%)',
              color: !selectedRole ? '#64748b' : '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: !selectedRole || isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: selectedRole ? '0 10px 25px rgba(43, 37, 62, 0.25)' : 'none',
              border: 'none',
              transition: 'all 0.2s ease',
              marginTop: '0.25rem',
            }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#ffffff',
                  }}
                />
                <span>Authenticating & Entering Portal...</span>
              </>
            ) : !selectedRole ? (
              <>
                <Lock size={16} />
                <span>Select a Portal First</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Enter {ROLE_DETAILS[selectedRole].title}</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info & compliance */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
            © 2026 Yellow Marketing Delivery LLC.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.3rem 0.65rem',
              borderRadius: '9999px',
              color: '#059669',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={14} />
            <span>SOC-2 & Audit Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading Login Portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
