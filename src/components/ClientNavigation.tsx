'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientNavigation() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch important routes for better performance
    const prefetchRoutes = async () => {
      try {
        await Promise.all([
          router.prefetch('/'),
          router.prefetch('/blog'),
          router.prefetch('/contact'),
          router.prefetch('/privacy')
        ]);
      } catch (error) {
        // Ignore prefetch errors
      }
    };

    prefetchRoutes();
  }, [router]);

  return null;
}