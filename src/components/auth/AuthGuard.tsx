'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Permission, ROLE_DETAILS, DEMO_USERS } from '../../types/auth';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback,
}) => {
  const { user, role, isAuthenticated, isLoading, switchRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Loading State
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '3px solid rgba(247, 53, 130, 0.2)',
            borderTopColor: 'var(--color-primary)',
          }}
        />
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', fontWeight: 600 }}>
          Verifying security credentials and role permissions...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!isAuthenticated || !user) {
    if (fallback) return <>{fallback}</>;

    return (
      <Container style={{ padding: '4rem 1.5rem', maxWidth: '640px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(247, 53, 130, 0.12)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>
            Portal Authentication Required
          </h2>
          <p style={{ color: 'var(--color-text-sub)', marginBottom: '2rem', lineHeight: 1.6 }}>
            You must be authenticated with an approved marketing delivery account to access this workspace.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
              <Button variant="primary" size="lg" fullWidth leftIcon={<KeyRound size={18} />}>
                Go to Portal Login
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="md" fullWidth leftIcon={<ArrowLeft size={16} />}>
                Go to Portal Selection
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    );
  }

  // 3. Check Role Eligibility
  const hasRoleAccess = !allowedRoles || allowedRoles.length === 0 || (role && allowedRoles.includes(role));
  const hasPermAccess = !requiredPermission || user.permissions.includes(requiredPermission);

  if (!hasRoleAccess || !hasPermAccess) {
    if (fallback) return <>{fallback}</>;

    const primarySuggestedRole = allowedRoles && allowedRoles.length > 0 ? allowedRoles[0] : 'admin';
    const suggestedRoleDetails = ROLE_DETAILS[primarySuggestedRole];
    const currentRoleDetails = role ? ROLE_DETAILS[role] : null;

    return (
      <Container style={{ padding: '3.5rem 1.5rem', maxWidth: '720px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(247, 53, 130, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top warning ribbon */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #ff7b83 0%, var(--color-primary) 100%)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 123, 131, 0.15)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldAlert size={30} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-primary)',
                }}
              >
                Access Guard Alert • Role Boundary Protected
              </div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)' }}>
                Elevated Privileges Required
              </h2>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-sub)', fontSize: 'var(--font-size-md)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your current logged-in identity{' '}
            <strong style={{ color: 'var(--color-secondary)' }}>{user.name}</strong> ({currentRoleDetails?.title || user.role}){' '}
            does not have clearance to view this secure partition.
          </p>

          {/* Current vs Required Roles Breakdown */}
          <div
            style={{
              background: 'rgba(231, 234, 239, 0.55)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                YOUR CURRENT ACTIVE ROLE
              </span>
              <span
                style={{
                  background: 'var(--color-surface)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 800,
                  color: 'var(--color-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {currentRoleDetails?.title}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                PERMITTED ACCESS ROLES
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {allowedRoles?.map((r) => (
                  <span
                    key={r}
                    style={{
                      background: ROLE_DETAILS[r].themeColor,
                      color: '#ffffff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 800,
                    }}
                  >
                    {ROLE_DETAILS[r].title}
                  </span>
                ))}
              </div>
            </div>

            {requiredPermission && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(43,37,62,0.08)', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                  REQUIRED CAPABILITY
                </span>
                <code
                  style={{
                    background: 'rgba(43,37,62,0.08)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-secondary)',
                  }}
                >
                  {requiredPermission}
                </code>
              </div>
            )}
          </div>

          {/* Quick Demo Role Switcher Action */}
          <div
            style={{
              background: 'rgba(88, 185, 125, 0.08)',
              border: '1px solid rgba(88, 185, 125, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green)', fontWeight: 700, fontSize: 'var(--font-size-sm)', marginBottom: '0.4rem' }}>
              <CheckCircle2 size={18} />
              <span>Instant Test & Evaluation Switch</span>
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', marginBottom: '1rem', lineHeight: 1.5 }}>
              For rapid verification of this protected portal view, click below to seamlessly authenticate as{' '}
              <strong>{suggestedRoleDetails.title} ({suggestedRoleDetails.subtitle})</strong>.
            </p>
            <Button
              variant="green"
              size="md"
              fullWidth
              onClick={() => switchRole(primarySuggestedRole)}
              leftIcon={<RefreshCw size={16} />}
            >
              Switch Role to &quot;{suggestedRoleDetails.title}&quot; & Unlock
            </Button>
          </div>

          {/* Navigation fallbacks */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="md"
              style={{ flex: 1 }}
              onClick={() => router.back()}
              leftIcon={<ArrowLeft size={16} />}
            >
              Go Back
            </Button>
            <Link href={currentRoleDetails?.defaultRedirect || '/login'} style={{ flex: 1 }}>
              <Button variant="secondary" size="md" fullWidth rightIcon={<ArrowRight size={16} />}>
                Go to My Assigned Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    );
  }

  // 4. Authorized -> Render children
  return <>{children}</>;
};
