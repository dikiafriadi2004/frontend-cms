'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useSettings } from '@/contexts/ApiContext';

// Proper Facebook Pixel type definitions
declare global {
  interface Window {
    fbq: {
      (...args: any[]): void;
      callMethod?: (...args: any[]) => void;
      queue?: any[];
      push?: any;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: any;
  }
}

const FacebookPixel = () => {
  const { analyticsSettings, settingsLoading } = useSettings();

  // Get Facebook Pixel ID from API (support multiple naming conventions)
  const pixelId = analyticsSettings?.facebook_pixel_id || 
                  analyticsSettings?.facebookPixelId ||
                  analyticsSettings?.fb_pixel_id;

  // Check if analytics is enabled (default to true if not explicitly disabled)
  const isEnabled = analyticsSettings?.enable_analytics !== false && 
                   analyticsSettings?.enableAnalytics !== false;

  useEffect(() => {
    if (pixelId && isEnabled && typeof window !== 'undefined') {
      // Initialize Facebook Pixel function if not already present
      if (!window.fbq) {
        window.fbq = function(...args: any[]) {
          if (window.fbq.callMethod) {
            window.fbq.callMethod.apply(window.fbq, args);
          } else {
            window.fbq.queue = window.fbq.queue || [];
            window.fbq.queue.push(args);
          }
        };
        
        // Set up fbq properties
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = window.fbq.queue || [];
      }
    }
  }, [pixelId, isEnabled]);

  // Don't render anything if loading, disabled, or no pixel ID
  if (settingsLoading || !isEnabled || !pixelId) {
    return null;
  }

  return (
    <>
      <Script 
        id="facebook-pixel" 
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default FacebookPixel;