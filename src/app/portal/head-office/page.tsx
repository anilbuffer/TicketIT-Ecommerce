'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyHeadOfficePortalRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/head-office');
  }, [router]);

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
      Redirecting to Head Office Portal...
    </div>
  );
}
