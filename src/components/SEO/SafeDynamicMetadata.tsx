'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';
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

const SafeDynamicMetadata = () => {
  const { settings, seoSettings, analyticsSettings } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Get favicon URL
  const faviconUrl = settings?.site_favicon ? (() => {
    const favicon = getSiteFavicon(settings);
    if (favicon && favicon !== '/favicon.ico' && favicon !== '/favicon.svg') {
      return favicon.startsWith('http') 
        ? favicon 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${favicon.replace(/^\//, '')}`;
    }
    return null;
  })() : null;

  // Get analytics IDs
  const googleAnalyticsId = getGoogleAnalyticsId(seoSettings, analyticsSettings);
  const googleTagManagerId = getGoogleTagManagerId(seoSettings, analyticsSettings);
  const facebookPixelId = getFacebookPixelId(analyticsSettings);
  const hotjarId = getHotjarId(analyticsSettings);

  // Get verification codes
  const googleVerification = getGoogleSiteVerification(seoSettings);
  const bingVerification = getBingVerification(seoSettings);
  const yandexVerification = getYandexVerification(seoSettings);

  return (
    <>
      {/* Favicon using Next.js Head */}
      {faviconUrl && (
        <Head>
          <link rel="icon" href={faviconUrl} />
          <link rel="shortcut icon" href={faviconUrl} />
          <link rel="apple-touch-icon" href={faviconUrl} />
        </Head>
      )}

      {/* Meta tags using Next.js Head */}
      {(googleVerification || bingVerification || yandexVerification) && (
        <Head>
          {googleVerification && (
            <meta name="google-site-verification" content={googleVerification} />
          )}
          {bingVerification && (
            <meta name="msvalidate.01" content={bingVerification} />
          )}
          {yandexVerification && (
            <meta name="yandex-verification" content={yandexVerification} />
          )}
        </Head>
      )}

      {/* Google Analytics using Next.js Script component */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager using Next.js Script component */}
      {googleTagManagerId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
        </Script>
      )}

      {/* Facebook Pixel using Next.js Script component */}
      {facebookPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
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
          `}
        </Script>
      )}

      {/* Hotjar using Next.js Script component */}
      {hotjarId && (
        <Script id="hotjar" strategy="afterInteractive">
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
      )}

      {/* Structured Data using Next.js Script component */}
      {settings && (
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": settings?.siteName || settings?.site_name || settings?.companyName || settings?.company_name || 'Website',
            "description": settings?.siteDescription || settings?.site_description || settings?.seo?.meta_description || 'Website Description',
            "url": typeof window !== 'undefined' ? window.location.origin : '',
            "logo": settings?.logo ? `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${settings.logo}` : '',
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
          })}
        </Script>
      )}
    </>
  );
};

export default SafeDynamicMetadata;