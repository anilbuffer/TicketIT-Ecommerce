'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../types/auth';
import LoginPage from './login/page';

export default function RootHomePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && role && ROLE_DETAILS[role]) {
      router.replace(ROLE_DETAILS[role].defaultRedirect);
    }
  }, [isAuthenticated, role, isLoading, router]);

  if (isLoading) {
    return (
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
        Initializing TicketIT Portal...
      </div>
    );
  }

  if (isAuthenticated && role && ROLE_DETAILS[role]) {
    return (
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
        Entering {ROLE_DETAILS[role].title} Portal...
      </div>
    );
  }

  return <LoginPage />;
}
