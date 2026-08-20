'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Store,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, DEMO_USERS, ROLE_DETAILS } from '../../types/auth';
import { TicketITLogo } from '../../components/ui/TicketITLogo';

// 1. Admin Shield & Crown Icon (Full Operations HQ)
function AdminRoleIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer shield container */}
      <path
        d="M16 3L6 7.5V14.5C6 21.2 10.3 27.4 16 29C21.7 27.4 26 21.2 26 14.5V7.5L16 3Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* Inner red/crimson shield badge */}
      <path
        d="M16 6L8.5 9.5V14.5C8.5 19.8 11.7 24.7 16 26C20.3 24.7 23.5 19.8 23.5 14.5V9.5L16 6Z"
        fill="#e11d48"
      />
      {/* Shield emblem reflection */}
      <path
        d="M16 6V26C19.8 24.7 22.8 20.3 23.3 15.5H16V6Z"
        fill="#be123c"
      />
      {/* Center checkmark */}
      <path
        d="M12.5 14.5L15 17L19.5 12"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 2. Head Office Building & Billing Icon (Consolidated Billing)
function HeadOfficeRoleIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle badge */}
      <rect x="4" y="5" width="24" height="22" rx="5" fill="#f0fdf4" stroke="#cbd5e1" strokeWidth="1.2" />
      {/* Main Corporate Building */}
      <rect x="7" y="9" width="11" height="16" rx="2" fill="#2563eb" />
      {/* Windows in building */}
      <rect x="9.5" y="12" width="2" height="2" rx="0.5" fill="#ffffff" />
      <rect x="13.5" y="12" width="2" height="2" rx="0.5" fill="#ffffff" />
      <rect x="9.5" y="16" width="2" height="2" rx="0.5" fill="#ffffff" />
      <rect x="13.5" y="16" width="2" height="2" rx="0.5" fill="#ffffff" />
      <rect x="9.5" y="20" width="2" height="2" rx="0.5" fill="#ffffff" />
      <rect x="13.5" y="20" width="2" height="2" rx="0.5" fill="#ffffff" />
      {/* Side tower / billing stack */}
      <rect x="19" y="14" width="6" height="11" rx="1.5" fill="#60a5fa" />
      <rect x="20.5" y="17" width="3" height="1.5" rx="0.5" fill="#ffffff" />
      <rect x="20.5" y="20" width="3" height="1.5" rx="0.5" fill="#ffffff" />
      {/* Roof antenna */}
      <line x1="12.5" y1="6" x2="12.5" y2="9" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.5" cy="5.5" r="1.5" fill="#ef4444" />
    </svg>
  );
}

// 3. Site User Storefront / Shopping Cart Icon (Branch Asset Orders)
function SiteUserRoleIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Storefront Awning */}
      <path
        d="M6 12L7.5 7H24.5L26 12C26 13.5 24.5 14.5 23 14.5C21.5 14.5 20.5 13.5 20.5 13.5C20.5 13.5 19.5 14.5 18 14.5C16.5 14.5 15.5 13.5 15.5 13.5C15.5 13.5 14.5 14.5 13 14.5C11.5 14.5 10.5 13.5 10.5 13.5C10.5 13.5 9.5 14.5 8 14.5C6.5 14.5 6 13.5 6 12Z"
        fill="#f73582"
        stroke="#2b253e"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Store Walls & Window */}
      <rect x="7" y="14" width="18" height="12" rx="1.5" fill="#ffffff" stroke="#2b253e" strokeWidth="1.2" />
      {/* Store Door */}
      <rect x="13" y="18" width="6" height="8" rx="1" fill="#f73582" />
      {/* Store Display Window */}
      <rect x="9" y="17" width="3" height="4" rx="0.5" fill="#93c5fd" />
      <rect x="20" y="17" width="3" height="4" rx="0.5" fill="#93c5fd" />
      {/* Floating Shopping Bag / Star */}
      <circle cx="24" cy="8" r="4.5" fill="#58b97d" stroke="#ffffff" strokeWidth="1.2" />
      <path d="M22.5 8L23.5 9L25.5 7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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
          router.push('/admin/dashboard');
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

  const portalCards: {
    key: UserRole;
    icon: React.ReactNode;
    title: string;
    sub: string;
    badgeColor: string;
    selectedBg: string;
    borderColor: string;
  }[] = [
    {
      key: 'admin',
      icon: <AdminRoleIcon size={32} />,
      title: 'Admin',
      sub: 'Full Operations HQ',
      badgeColor: '#059669',
      selectedBg: '#f0fdf9',
      borderColor: '#059669',
    },
    {
      key: 'head_office',
      icon: <HeadOfficeRoleIcon size={32} />,
      title: 'Head Office',
      sub: 'Consolidated Billing',
      badgeColor: '#2563eb',
      selectedBg: '#eff6ff',
      borderColor: '#2563eb',
    },
    {
      key: 'site_user',
      icon: <SiteUserRoleIcon size={32} />,
      title: 'Site User',
      sub: 'Branch Asset Orders',
      badgeColor: '#f73582',
      selectedBg: '#fdf2f8',
      borderColor: '#f73582',
    },
  ];

  // Dynamic Button Properties
  const getButtonProps = () => {
    if (!selectedRole) {
      return {
        text: 'Select a Portal First',
        bgColor: '#cbd5e1',
        textColor: '#94a3b8',
        shadow: 'none',
        disabled: true,
      };
    }
    if (selectedRole === 'admin') {
      return {
        text: 'Enter Admin Portal',
        bgColor: '#059669',
        textColor: '#ffffff',
        shadow: '0 8px 20px rgba(5, 150, 105, 0.28)',
        disabled: false,
      };
    }
    if (selectedRole === 'head_office') {
      return {
        text: 'Enter Head Office Portal',
        bgColor: '#2563eb',
        textColor: '#ffffff',
        shadow: '0 8px 20px rgba(37, 99, 235, 0.28)',
        disabled: false,
      };
    }
    // Site User
    return {
      text: 'Enter Site User Portal',
      bgColor: '#f73582',
      textColor: '#ffffff',
      shadow: '0 8px 20px rgba(247, 53, 130, 0.28)',
      disabled: false,
    };
  };

  const btnProps = getButtonProps();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
        backgroundColor: '#eef2f6',
        backgroundImage: `
          radial-gradient(at 10% 15%, rgba(253, 232, 242, 0.6) 0px, transparent 50%),
          radial-gradient(at 90% 15%, rgba(224, 231, 255, 0.6) 0px, transparent 50%),
          radial-gradient(at 50% 90%, rgba(204, 251, 241, 0.45) 0px, transparent 50%)
        `,
        fontFamily: '"Acumin Pro", "Acumin", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Central Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '490px',
          background: '#ffffff',
          borderRadius: '26px',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          padding: '2.25rem 2rem',
          position: 'relative',
        }}
      >
        {/* Brand Header: Exact TicketIT Logo */}
        <div style={{ marginBottom: '1.6rem' }}>
          <TicketITLogo size="md" showTagline={true} />
        </div>

        {/* Heading & Subtitle */}
        <div style={{ marginBottom: '1.5rem' }}>
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
              fontSize: '0.86rem',
              color: '#64748b',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Choose your role to access your portal. Demo credentials will auto-fill.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Section: PORTAL ACCESS */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.65rem',
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
                gap: '0.7rem',
              }}
            >
              {portalCards.map((item) => {
                const isSelected = selectedRole === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectRole(item.key)}
                    style={{
                      background: isSelected ? item.selectedBg : '#f8fafc',
                      borderRadius: '16px',
                      padding: '1.15rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: isSelected
                        ? `2px solid ${item.borderColor}`
                        : '1.5px solid #e2e8f0',
                      boxShadow: isSelected
                        ? '0 6px 16px -2px rgba(15, 23, 42, 0.1)'
                        : 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Selected Checkmark Badge in Top Right */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: item.badgeColor,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Check size={11} strokeWidth={3.5} />
                      </div>
                    )}

                    {/* Icon container */}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.65rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
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
                  </button>
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
                border: selectedRole
                  ? selectedRole === 'site_user'
                    ? '1.5px solid #f73582'
                    : selectedRole === 'head_office'
                    ? '1.5px solid #2563eb'
                    : '1.5px solid #059669'
                  : '1.5px solid #e2e8f0',
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
                  border: selectedRole
                    ? selectedRole === 'site_user'
                      ? '1.5px solid #f73582'
                      : selectedRole === 'head_office'
                      ? '1.5px solid #2563eb'
                      : '1.5px solid #059669'
                    : '1.5px solid #e2e8f0',
                  background: selectedRole ? '#ffffff' : '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  letterSpacing: password ? '0.15em' : 'normal',
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

          {/* Auto-filled Demo Credentials Green/Pink Callout */}
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#065f46',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={15} color="#059669" />
                <span>
                  Demo credentials auto-filled for {ROLE_DETAILS[selectedRole].title} portal
                </span>
              </motion.div>
            )}
          </AnimatePresence>

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
            disabled={btnProps.disabled || isSubmitting}
            style={{
              width: '100%',
              padding: '0.95rem 1.25rem',
              borderRadius: '12px',
              background: btnProps.bgColor,
              color: btnProps.textColor,
              fontSize: '0.92rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: btnProps.disabled || isSubmitting ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: btnProps.shadow,
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>{btnProps.text}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info & Security badge */}
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
          <div style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 500 }}>
            © 2026 TicketIT. All rights reserved.
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
            <span>SOC 2 Type II Certified</span>
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
            backgroundColor: '#eef2f6',
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          Loading TicketIT Portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
