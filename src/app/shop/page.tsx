// src/app/shop/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/shop/catalogue');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-pink-200 border-t-[#F73582] rounded-full animate-spin"></div>
    </div>
  );
}
