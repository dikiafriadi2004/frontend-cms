'use client';

import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { AdsAPI, isAdActive } from '@/lib/ads-api';

interface HeaderAdProps {
  className?: string;
}

const HeaderAd = ({ className = '' }: HeaderAdProps) => {
  const [mounted, setMounted] = useState(false);
  const [hasAds, setHasAds] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAds = async () => {
      try {
        const headerAds = await AdsAPI.getAdsByPosition('header');
        const activeAds = headerAds.filter(isAdActive);
        setHasAds(activeAds.length > 0);
      } catch (error) {
        console.error('Failed to check header ads:', error);
        setHasAds(false);
      } finally {
        setLoading(false);
      }
    };

    checkAds();
  }, [mounted]);

  if (!mounted || loading) {
    return null;
  }

  // Only render if ads exist
  if (!hasAds) {
    return null;
  }

  return (
    <div className={`header-ad ${className}`}>
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
          <div className="flex justify-center">
            <AdBanner 
              position="header" 
              className="w-full max-w-4xl"
              maxAds={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAd;