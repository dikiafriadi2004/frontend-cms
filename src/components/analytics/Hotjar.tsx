'use client';

import Script from 'next/script';
import { useSettings } from '@/contexts/ApiContext';

declare global {
  interface Window {
    hj: (...args: any[]) => void;
    _hjSettings: any;
  }
}

const Hotjar = () => {
  const { analyticsSettings, settingsLoading } = useSettings();

  // Get Hotjar ID from API (support multiple naming conventions)
  const hotjarId = analyticsSettings?.hotjar_id || 
                   analyticsSettings?.hotjarId ||
                   analyticsSettings?.hj_id;

  // Check if analytics is enabled (default to true if not explicitly disabled)
  const isEnabled = analyticsSettings?.enable_analytics !== false && 
                   analyticsSettings?.enableAnalytics !== false;

  // Don't render anything if loading, disabled, or no Hotjar ID
  if (settingsLoading || !isEnabled || !hotjarId) {
    return null;
  }

  return (
    <Script 
      id="hotjar" 
      strategy="afterInteractive"
    >
      {`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${hotjarId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
  );
};

export default Hotjar;