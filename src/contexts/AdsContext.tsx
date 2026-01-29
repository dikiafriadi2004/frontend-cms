'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AdsAPI, Ad } from '@/lib/ads-api';

interface AdsContextType {
  ads: Record<string, Ad[]>;
  loading: boolean;
  loadAdsByPosition: (position: string) => Promise<Ad[]>;
  trackView: (adId: string) => Promise<boolean>;
  trackClick: (adId: string) => Promise<boolean>;
  refreshAds: () => Promise<void>;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

interface AdsProviderProps {
  children: ReactNode;
}

export function AdsProvider({ children }: AdsProviderProps) {
  const [ads, setAds] = useState<Record<string, Ad[]>>({});
  const [loading, setLoading] = useState(false);

  // Load ads by position
  const loadAdsByPosition = async (position: string): Promise<Ad[]> => {
    try {
      console.log(`🔍 Loading ads for position: ${position}`);
      const positionAds = await AdsAPI.getAdsByPosition(position);
      
      // Update ads state
      setAds(prev => ({
        ...prev,
        [position]: positionAds
      }));
      
      console.log(`✅ Loaded ${positionAds.length} ads for position ${position}`);
      return positionAds;
    } catch (error) {
      console.error(`Failed to load ads for position ${position}:`, error);
      return [];
    }
  };

  // Track ad view
  const trackView = async (adId: string): Promise<boolean> => {
    try {
      const success = await AdsAPI.trackView(adId);
      if (success) {
        console.log(`📊 Tracked view for ad ${adId}`);
      }
      return success;
    } catch (error) {
      console.error(`Failed to track view for ad ${adId}:`, error);
      return false;
    }
  };

  // Track ad click
  const trackClick = async (adId: string): Promise<boolean> => {
    try {
      const success = await AdsAPI.trackClick(adId);
      if (success) {
        console.log(`🖱️ Tracked click for ad ${adId}`);
      }
      return success;
    } catch (error) {
      console.error(`Failed to track click for ad ${adId}:`, error);
      return false;
    }
  };

  // Refresh all ads
  const refreshAds = async () => {
    try {
      setLoading(true);
      console.log('🔄 Refreshing all ads...');
      
      // Get all active ads
      const allAds = await AdsAPI.getActiveAds();
      
      // Group ads by position
      const adsByPosition: Record<string, Ad[]> = {};
      allAds.forEach(ad => {
        if (!adsByPosition[ad.position]) {
          adsByPosition[ad.position] = [];
        }
        adsByPosition[ad.position].push(ad);
      });
      
      setAds(adsByPosition);
      console.log('✅ Refreshed ads:', adsByPosition);
    } catch (error) {
      console.error('Failed to refresh ads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of active ads
  useEffect(() => {
    refreshAds();
  }, []);

  const value: AdsContextType = {
    ads,
    loading,
    loadAdsByPosition,
    trackView,
    trackClick,
    refreshAds,
  };

  return (
    <AdsContext.Provider value={value}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds(): AdsContextType {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
}

// Custom hook for specific position ads
export function useAdsByPosition(position: string) {
  const { ads, loadAdsByPosition } = useAds();
  const [positionAds, setPositionAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        
        // Check if we already have ads for this position
        if (ads[position]) {
          setPositionAds(ads[position]);
        } else {
          // Load ads for this position
          const loadedAds = await loadAdsByPosition(position);
          setPositionAds(loadedAds);
        }
      } catch (error) {
        console.error(`Error loading ads for position ${position}:`, error);
        setPositionAds([]);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [position, ads, loadAdsByPosition]);

  return { ads: positionAds, loading };
}