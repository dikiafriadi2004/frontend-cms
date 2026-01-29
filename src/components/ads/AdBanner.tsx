'use client';

import { useEffect, useState, useRef } from 'react';
import { AdsAPI, Ad, isAdActive } from '@/lib/ads-api';

interface AdBannerProps {
  position: string;
  className?: string;
  maxAds?: number;
}

// AdSense Renderer Component
const AdSenseRenderer = ({ code, adId }: { code: string; adId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || loaded) return;

    try {
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = code;
      
      // Extract script elements and ins elements
      const scripts = tempDiv.querySelectorAll('script');
      const insElements = tempDiv.querySelectorAll('ins');
      
      // Clear the container and add the ins elements
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        
        // Add ins elements
        insElements.forEach(ins => {
          containerRef.current?.appendChild(ins.cloneNode(true));
        });
        
        // Load AdSense script if not already loaded
        if (!(window as any).adsbygoogle) {
          const adSenseScript = document.createElement('script');
          adSenseScript.async = true;
          adSenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          adSenseScript.crossOrigin = 'anonymous';
          document.head.appendChild(adSenseScript);
        }
        
        // Execute inline scripts
        scripts.forEach(script => {
          if (script.src) {
            // External script
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.async = true;
            if (script.crossOrigin) newScript.crossOrigin = script.crossOrigin;
            document.head.appendChild(newScript);
          } else if (script.textContent) {
            // Inline script
            try {
              eval(script.textContent);
            } catch (error) {
              console.warn('Failed to execute AdSense script:', error);
            }
          }
        });
        
        setLoaded(true);
      }
    } catch (error) {
      console.error('Failed to render AdSense ad:', error);
    }
  }, [code, adId, loaded]);

  return <div ref={containerRef} className="adsense-ad-container" />;
};

// Adsera Renderer Component
const AdseraRenderer = ({ code, adId }: { code: string; adId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || loaded) return;

    try {
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = code;
      
      // Extract script elements and div elements
      const scripts = tempDiv.querySelectorAll('script');
      const divElements = tempDiv.querySelectorAll('div');
      
      // Clear the container and add the div elements
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        
        // Add div elements
        divElements.forEach(div => {
          containerRef.current?.appendChild(div.cloneNode(true));
        });
        
        // Execute scripts
        scripts.forEach(script => {
          if (script.src) {
            // External script
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.async = true;
            newScript.type = 'text/javascript';
            document.head.appendChild(newScript);
          } else if (script.textContent) {
            // Inline script
            try {
              eval(script.textContent);
            } catch (error) {
              console.warn('Failed to execute Adsera script:', error);
            }
          }
        });
        
        setLoaded(true);
      }
    } catch (error) {
      console.error('Failed to render Adsera ad:', error);
    }
  }, [code, adId, loaded]);

  return <div ref={containerRef} className="adsera-ad-container" />;
};

interface AdBannerProps {
  position: string;
  className?: string;
  maxAds?: number;
}

const AdBanner = ({ position, className = '', maxAds = 1 }: AdBannerProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const viewTrackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        
        // Get ads for specific position
        const positionAds = await AdsAPI.getAdsByPosition(position);
        
        // Filter active ads and limit to maxAds
        const activeAds = positionAds.filter(isAdActive).slice(0, maxAds);
        
        setAds(activeAds);
      } catch (error) {
        console.error(`Failed to load ads for position ${position}:`, error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [position, maxAds]);

  // Track ad views when component becomes visible
  useEffect(() => {
    if (ads.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const adId = entry.target.getAttribute('data-ad-id');
            if (adId && !viewTrackedRef.current.has(adId)) {
              viewTrackedRef.current.add(adId);
              AdsAPI.trackView(adId).then((success) => {
                if (success) {
                  console.log(`📊 Tracked view for ad ${adId}`);
                } else {
                  console.warn(`Failed to track view for ad ${adId}`);
                }
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all ad elements
    const adElements = document.querySelectorAll(`[data-ad-id]`);
    adElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ads]);

  const handleAdClick = async (ad: Ad) => {
    try {
      // Track click (if tracking endpoints are available)
      const success = await AdsAPI.trackClick(ad.id.toString());
      if (success) {
        console.log(`🖱️ Tracked click for ad ${ad.id}`);
      } else {
        console.warn(`Failed to track click for ad ${ad.id}`);
      }

      // Open ad URL
      if (ad.link_url) {
        if (ad.open_new_tab) {
          window.open(ad.link_url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = ad.link_url;
        }
      }
    } catch (error) {
      console.error(`Error handling ad click for ${ad.id}:`, error);
    }
  };

  if (loading) {
    return (
      <div className={`ads-loading ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded-lg h-20 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    // Don't render anything if no ads are available
    return null;
  }

  return (
    <div className={`ads-container ${className}`}>
      {ads.map((ad) => (
        <div
          key={ad.id}
          data-ad-id={ad.id}
          className="ad-banner mb-4 last:mb-0"
        >
          {/* Manual Banner Ads */}
          {ad.type === 'manual_banner' && (
            <div
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => handleAdClick(ad)}
            >
              {ad.image_url ? (
                <img
                  src={ad.image_url}
                  alt={ad.alt_text || ad.title || ad.name}
                  className="w-full h-auto object-contain max-w-full"
                  style={{
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              ) : (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                  <h3 className="font-bold text-base mb-2">{ad.title || ad.name}</h3>
                  {ad.description && (
                    <p className="text-sm opacity-90">{ad.description}</p>
                  )}
                </div>
              )}
              
              {/* Ad label */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Ad
              </div>
            </div>
          )}

          {/* Manual Text Ads */}
          {ad.type === 'manual_text' && (
            <div
              className="ad-text bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-300"
              onClick={() => handleAdClick(ad)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{ad.title || ad.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Ad</span>
              </div>
              {ad.description && (
                <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
              )}
              <div className="text-xs text-blue-600 hover:text-blue-800">
                Learn more →
              </div>
            </div>
          )}

          {/* AdSense Ads */}
          {ad.type === 'adsense' && ad.code && (
            <div className="ad-adsense">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-500">Advertisement</span>
              </div>
              <div className="adsense-container">
                <AdSenseRenderer code={ad.code} adId={ad.id.toString()} />
              </div>
            </div>
          )}

          {/* Adsera Ads */}
          {ad.type === 'adsera' && ad.code && (
            <div className="ad-adsera">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-500">Advertisement</span>
              </div>
              <div className="adsera-container">
                <AdseraRenderer code={ad.code} adId={ad.id.toString()} />
              </div>
            </div>
          )}

          {/* Fallback for unknown types */}
          {!['manual_banner', 'manual_text', 'adsense', 'adsera'].includes(ad.type) && (
            <div className="ad-generic bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{ad.title || ad.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Ad</span>
              </div>
              {ad.description && (
                <p className="text-sm text-gray-600">{ad.description}</p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Type: {ad.type}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdBanner;