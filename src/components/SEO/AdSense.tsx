'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/ApiContext';

interface AdSenseProps {
  slot: 'header' | 'sidebar' | 'footer' | 'inArticle';
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

const AdSense = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}: AdSenseProps) => {
  const { adsSettings } = useSettings();

  useEffect(() => {
    if (adsSettings?.enableAds && adsSettings?.googleAdsenseId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adsSettings]);

  // Don't render if ads are disabled or no AdSense ID
  if (!adsSettings?.enableAds || !adsSettings?.googleAdsenseId) {
    return null;
  }

  // Get slot ID for the specific position
  const slotId = adsSettings?.googleAdsenseSlots?.[slot];
  if (!slotId) {
    return null;
  }

  // Determine ad dimensions based on slot type
  const getAdDimensions = () => {
    switch (slot) {
      case 'header':
        return { width: '728', height: '90' }; // Leaderboard
      case 'sidebar':
        return { width: '300', height: '250' }; // Medium Rectangle
      case 'footer':
        return { width: '728', height: '90' }; // Leaderboard
      case 'inArticle':
        return { width: '336', height: '280' }; // Large Rectangle
      default:
        return { width: '320', height: '100' }; // Mobile Banner
    }
  };

  const dimensions = getAdDimensions();

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: responsive ? '100%' : `${dimensions.width}px`,
          height: responsive ? 'auto' : `${dimensions.height}px`,
        }}
        data-ad-client={adsSettings.googleAdsenseId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSense;