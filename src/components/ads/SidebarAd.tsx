'use client';

import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { AdsAPI, isAdActive } from '@/lib/ads-api';

interface SidebarAdProps {
  className?: string;
  maxAds?: number;
}

const SidebarAd = ({ className = '', maxAds = 2 }: SidebarAdProps) => {
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
        const sidebarAds = await AdsAPI.getAdsByPosition('sidebar_top');
        const activeAds = sidebarAds.filter(isAdActive);
        setHasAds(activeAds.length > 0);
      } catch (error) {
        console.error('Failed to check sidebar ads:', error);
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
    <div className={`sidebar-ad ${className}`}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Sponsored
          </h3>
        </div>
        <AdBanner 
          position="sidebar_top" 
          className="space-y-4"
          maxAds={maxAds}
        />
      </div>
    </div>
  );
};

export default SidebarAd;