'use client';

import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { AdsAPI, isAdActive } from '@/lib/ads-api';

interface InArticleAdProps {
  className?: string;
}

const InArticleAd = ({ className = '' }: InArticleAdProps) => {
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
        const inArticleAds = await AdsAPI.getAdsByPosition('content_middle');
        const activeAds = inArticleAds.filter(isAdActive);
        setHasAds(activeAds.length > 0);
      } catch (error) {
        console.error('Failed to check in-article ads:', error);
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
    <div className={`in-article-ad ${className}`}>
      <div className="text-center mb-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Advertisement</span>
      </div>
      <div className="flex justify-center">
        <AdBanner 
          position="content_middle" 
          className="max-w-full"
          maxAds={1}
        />
      </div>
    </div>
  );
};

export default InArticleAd;