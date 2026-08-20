'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Building2,
  Store,
  ChevronUp,
  ExternalLink,
  LogOut,
  Sparkles,
  Check,
  KeyRound,
  FileSpreadsheet,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, DEMO_USERS, ROLE_DETAILS } from '../../types/auth';

export const RoleSwitcherWidget: React.FC = () => {
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList: { role: UserRole; icon: React.ReactNode; path: string }[] = [
    {
      role: 'admin',
      icon: <Shield size={18} />,
      path: '/admin/dashboard',
    },
    {
      role: 'site_user',
      icon: <Store size={18} />,
      path: '/portal/site-user',
    },
    {
      role: 'head_office',
      icon: <Building2 size={18} />,
      path: '/portal/head-office',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 950,
      }}
      className="role-switcher-widget-container"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              left: 0,
              width: '360px',
              maxWidth: '90vw',
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 45px rgba(43, 37, 62, 0.22), 0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(43, 37, 62, 0.12)',
              overflow: 'hidden',
              padding: '1.25rem',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Users size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)', lineHeight: 1.2 }}>
                    Auth Role & Portal Simulator
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    Switch persona to test Auth Guards & Portals
                  </div>
                </div>
              </div>
            </div>

            {/* Role List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {rolesList.map(({ role: r, icon, path }) => {
                const isCurrent = role === r;
                const demoUser = DEMO_USERS[r];
                const meta = ROLE_DETAILS[r];

                return (
                  <div
                    key={r}
                    onClick={() => {
                      switchRole(r);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isCurrent ? 'rgba(247, 53, 130, 0.08)' : 'rgba(231, 234, 239, 0.45)',
                      border: isCurrent ? `1.5px solid ${meta.themeColor}` : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: isCurrent ? meta.themeColor : '#ffffff',
                          color: isCurrent ? '#ffffff' : 'var(--color-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 800, fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)' }}>
                            {demoUser.roleTitle}
                          </span>
                          {isCurrent && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                background: meta.themeColor,
                                color: '#ffffff',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-sub)' }}>
                          {demoUser.user.name} • {demoUser.roleSubtitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Link
                        href={path}
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRole(r);
                          setIsOpen(false);
                        }}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          background: '#ffffff',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--color-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                        title={`Open ${meta.title} Workspace`}
                      >
                        <span>Open</span>
                        <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-secondary)',
                  color: '#ffffff',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                }}
              >
                <KeyRound size={13} />
                <span>Test Login Screen</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(247, 53, 130, 0.1)',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                }}
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(43, 37, 62, 0.92)',
          color: '#ffffff',
          boxShadow: '0 8px 30px rgba(43, 37, 62, 0.35)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: role ? ROLE_DETAILS[role].themeColor : '#ff7b83',
            boxShadow: `0 0 10px ${role ? ROLE_DETAILS[role].themeColor : '#ff7b83'}`,
          }}
        />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>
            Simulate Persona
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>{user ? user.role.replace('_', ' ').toUpperCase() : 'NO AUTH'}</span>
            <ChevronUp size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
        </div>
      </motion.button>
    </div>
  );
};
