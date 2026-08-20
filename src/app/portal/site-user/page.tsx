'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacySiteUserPortalRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/site-user');
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
      Redirecting to Site User Portal...
    </div>
  );
}
