'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/ApiContext';
import { 
  getSiteFavicon,
  getGoogleAnalyticsId,
  getGoogleTagManagerId,
  getFacebookPixelId,
  getHotjarId,
  getGoogleSiteVerification,
  getBingVerification,
  getYandexVerification
} from '@/lib/settings-helper';

const DynamicMetadata = () => {
  const { settings, seoSettings, analyticsSettings, adsSettings } = useSettings();

  useEffect(() => {
    if (settings || seoSettings) {
      // Update favicon using helper function
      const faviconUrl = getSiteFavicon(settings);
      const fullFaviconUrl = faviconUrl.startsWith('http') 
        ? faviconUrl 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${faviconUrl.replace(/^\//, '')}`;

      // Update existing favicon or create new one
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = fullFaviconUrl;
      } else {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = fullFaviconUrl;
        document.head.appendChild(favicon);
      }

      // Update shortcut icon
      let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
      if (shortcutIcon) {
        shortcutIcon.href = fullFaviconUrl;
      } else {
        shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = fullFaviconUrl;
        document.head.appendChild(shortcutIcon);
      }

      // Update apple touch icon
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (appleTouchIcon) {
        appleTouchIcon.href = fullFaviconUrl;
      } else {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = fullFaviconUrl;
        document.head.appendChild(appleTouchIcon);
      }

      // Add Search Engine Verification Meta Tags
      const googleVerification = getGoogleSiteVerification(seoSettings);
      if (googleVerification && !document.querySelector('meta[name="google-site-verification"]')) {
        const googleMeta = document.createElement('meta');
        googleMeta.name = 'google-site-verification';
        googleMeta.content = googleVerification;
        document.head.appendChild(googleMeta);
      }

      const bingVerification = getBingVerification(seoSettings);
      if (bingVerification && !document.querySelector('meta[name="msvalidate.01"]')) {
        const bingMeta = document.createElement('meta');
        bingMeta.name = 'msvalidate.01';
        bingMeta.content = bingVerification;
        document.head.appendChild(bingMeta);
      }

      const yandexVerification = getYandexVerification(seoSettings);
      if (yandexVerification && !document.querySelector('meta[name="yandex-verification"]')) {
        const yandexMeta = document.createElement('meta');
        yandexMeta.name = 'yandex-verification';
        yandexMeta.content = yandexVerification;
        document.head.appendChild(yandexMeta);
      }

      // Add Google Analytics if enabled using helper function
      const googleAnalyticsId = getGoogleAnalyticsId(seoSettings, analyticsSettings);
      if (googleAnalyticsId && !document.querySelector(`script[src*="${googleAnalyticsId}"]`)) {
        // Add Google Analytics script
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
        document.head.appendChild(gaScript);

        // Add Google Analytics config
        const gaConfig = document.createElement('script');
        gaConfig.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `;
        document.head.appendChild(gaConfig);
      }

      // Add Google Tag Manager if enabled using helper function
      const googleTagManagerId = getGoogleTagManagerId(seoSettings, analyticsSettings);
      if (googleTagManagerId && !document.querySelector(`script[src*="${googleTagManagerId}"]`)) {
        const gtmScript = document.createElement('script');
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${googleTagManagerId}');
        `;
        document.head.appendChild(gtmScript);
      }

      // Add Facebook Pixel if enabled
      const facebookPixelId = getFacebookPixelId(analyticsSettings);
      if (facebookPixelId && !document.querySelector(`script[src*="fbevents.js"]`)) {
        const fbScript = document.createElement('script');
        fbScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${facebookPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
      }

      // Add Hotjar if enabled
      const hotjarId = getHotjarId(analyticsSettings);
      if (hotjarId && !document.querySelector(`script[src*="hotjar"]`)) {
        const hotjarScript = document.createElement('script');
        hotjarScript.innerHTML = `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjarId},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `;
        document.head.appendChild(hotjarScript);
      }

      // Add JSON-LD Structured Data
      if (!document.querySelector('script[type="application/ld+json"]')) {
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settings?.siteName || settings?.site_name || settings?.companyName || settings?.company_name || 'Website',
          "description": settings?.siteDescription || settings?.site_description || settings?.seo?.meta_description || 'Website Description',
          "url": window.location.origin,
          "logo": settings?.logo ? `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${settings.logo}` : `${window.location.origin}/logo.svg`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": settings?.contact?.phone || '+62 123 456 789',
            "contactType": "customer service",
            "email": settings?.contact?.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com'
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": settings?.contact?.address || 'Jakarta, Indonesia'
          },
          "sameAs": [
            settings?.social?.facebook,
            settings?.social?.instagram,
            settings?.social?.twitter,
            settings?.social?.linkedin
          ].filter(Boolean)
        };

        const ldScript = document.createElement('script');
        ldScript.type = 'application/ld+json';
        ldScript.innerHTML = JSON.stringify(structuredData);
        document.head.appendChild(ldScript);
      }
    }
  }, [settings, seoSettings, analyticsSettings, adsSettings]);

  return null; // This component doesn't render anything
};

export default DynamicMetadata;