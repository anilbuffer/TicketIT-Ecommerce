'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Truck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, DEMO_USERS, ROLE_DETAILS } from '../../types/auth';

// Custom Pill / Capsule SVG Icon for Pharmacy
function PillIcon({ size = 24, color = '#d97706' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect
        x="3"
        y="10.5"
        width="18"
        height="9"
        rx="4.5"
        transform="rotate(-45 3 10.5)"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 8.5L15.5 15.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 11L13 18"
        fill={color}
        fillOpacity="0.25"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When role card is clicked, auto-fill demo credentials
  const handleSelectRole = (roleKey: UserRole) => {
    setSelectedRole(roleKey);
    const demo = DEMO_USERS[roleKey];
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.defaultPassword);
    }
    setErrorMessage(null);
  };

  // Direct 1-Click Fast Login directly into portal
  const handleDirectAccess = async (roleKey: UserRole) => {
    setSelectedRole(roleKey);
    const demo = DEMO_USERS[roleKey];
    if (!demo) return;
    
    setEmail(demo.email);
    setPassword(demo.defaultPassword);
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await login(demo.email, demo.defaultPassword, roleKey);
      if (res.success) {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(ROLE_DETAILS[roleKey].defaultRedirect);
        }
      } else {
        setErrorMessage(res.error || 'Authentication error.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('Failed to authenticate. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole && !email.trim()) {
      setErrorMessage('Please select a portal role above.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const effectiveRole = selectedRole || 'admin';
      const res = await login(email, password, effectiveRole);
      if (res.success) {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (selectedRole) {
          router.push(ROLE_DETAILS[selectedRole].defaultRedirect);
        } else {
          router.push('/portal/admin');
        }
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
        setIsSubmitting(false);
      }
    } catch {
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
    iconBg: string;
  }[] = [
    {
      key: 'admin',
      icon: <Shield size={24} color="#e11d48" />,
      title: 'Super Admin',
      sub: 'Platform HQ',
      color: '#e11d48',
      iconBg: '#ffe4e6',
    },
    {
      key: 'site_user',
      icon: <PillIcon size={24} color="#d97706" />,
      title: 'Pharmacy',
      sub: 'Dispensing Hub',
      color: '#d97706',
      iconBg: '#fef3c7',
    },
    {
      key: 'head_office',
      icon: <Truck size={24} color="#e11d48" />,
      title: 'Driver',
      sub: 'Courier Portal',
      color: '#059669',
      iconBg: '#fee2e2',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        backgroundColor: '#edf3f8',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(186, 230, 253, 0.45) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(204, 251, 241, 0.45) 0px, transparent 50%),
          radial-gradient(at 50% 100%, rgba(224, 231, 255, 0.4) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(254, 240, 138, 0.25) 0px, transparent 50%)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Subtle Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(255,255,255,0) 70%)',
          top: '-10%',
          left: '-5%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(255,255,255,0) 70%)',
          bottom: '-10%',
          right: '-5%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Centered Mockup Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '510px',
          background: '#ffffff',
          borderRadius: '26px',
          boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#059669',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.45rem',
              letterSpacing: '-0.02em',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              flexShrink: 0,
            }}
          >
            R
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Rahhawan
            </h2>
            <div
              style={{
                fontSize: '0.78rem',
                color: '#64748b',
                fontWeight: 500,
                marginTop: '3px',
              }}
            >
              Pharmaceutical Logistics Platform
            </div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div style={{ marginBottom: '1.6rem' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '0.45rem',
              lineHeight: 1.2,
            }}
          >
            Select Your Portal
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Choose your role to access your portal. Demo credentials will auto-fill.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section: PORTAL ACCESS */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.7rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
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
                  onClick={() => {
                    setSelectedRole(null);
                    setEmail('');
                    setPassword('');
                  }}
                  style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* 3 Role Selection Cards */}
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
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectRole(item.key)}
                    onDoubleClick={() => handleDirectAccess(item.key)}
                    title="Click to select & auto-fill, or double click for instant 1-click access"
                    style={{
                      background: isSelected ? '#ffffff' : '#f8fafc',
                      borderRadius: '16px',
                      padding: '1.1rem 0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: isSelected ? '2px solid #0f172a' : '1.5px solid #e2e8f0',
                      boxShadow: isSelected
                        ? '0 6px 16px -2px rgba(15, 23, 42, 0.12)'
                        : 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Icon container */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: item.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.65rem',
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Role Title */}
                    <div
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.2,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {item.title}
                    </div>

                    {/* Role Subtitle */}
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: '#64748b',
                        fontWeight: 500,
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
                color: '#1e293b',
                marginBottom: '0.4rem',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Select a portal role above..."
              required
              style={{
                width: '100%',
                padding: '0.82rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                background: selectedRole ? '#ffffff' : '#f8fafc',
                color: '#0f172a',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1e293b',
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
                placeholder="Select a portal role above..."
                required
                style={{
                  width: '100%',
                  padding: '0.82rem 2.75rem 0.82rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: selectedRole ? '#ffffff' : '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
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
                  display: 'flex',
                  alignItems: 'center',
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

          {/* Big Action Button */}
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
                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: !selectedRole ? '#64748b' : '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: !selectedRole || isSubmitting ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: selectedRole ? '0 8px 20px rgba(5, 150, 105, 0.25)' : 'none',
              transition: 'all 0.2s ease',
              marginTop: '0.2rem',
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
                <span>Entering Portal...</span>
              </>
            ) : !selectedRole ? (
              <>
                <Lock size={16} />
                <span>Select a Portal First</span>
              </>
            ) : (
              <>
                <span>Sign In to {ROLE_DETAILS[selectedRole].title} Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>

          {/* Fast 1-Click Direct Entry Shortcut Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.2rem',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Direct Demo Access:</span>
            {rolesConfig.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => handleDirectAccess(r.key)}
                style={{
                  fontSize: '0.72rem',
                  color: '#059669',
                  fontWeight: 700,
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  padding: '0.15rem 0.45rem',
                  cursor: 'pointer',
                }}
              >
                {r.title}
              </button>
            ))}
          </div>
        </form>

        {/* Footer info & HIPAA badge */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.73rem', color: '#94a3b8', fontWeight: 500 }}>
            © 2024 Rahhawan LLC. All rights reserved.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '0.3rem 0.65rem',
              borderRadius: '9999px',
              color: '#16a34a',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={14} color="#16a34a" />
            <span>HIPAA Compliant</span>
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
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#edf3f8',
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          Loading Portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
