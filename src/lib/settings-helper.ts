// Helper functions to get settings values with proper fallbacks
// Supports both camelCase and snake_case from API

export const getSiteName = (settings: any): string => {
  // Debug log to see what settings we're getting
  console.log('🔍 getSiteName called with settings:', settings);
  
  // Try multiple field variations, prioritizing API fields
  const siteName = settings?.site_name || 
                   settings?.siteName || 
                   settings?.company_name || 
                   settings?.companyName || 
                   'Website';
  
  console.log('🔍 Resolved site name:', siteName);
  return siteName;
};

export const getCompanyName = (settings: any, companySettings?: any): string => {
  return companySettings?.company_name || 
         companySettings?.companyName || 
         settings?.company_name || 
         settings?.companyName || 
         getSiteName(settings);
};

export const getSiteDescription = (settings: any): string => {
  return settings?.site_description || 
         settings?.siteDescription || 
         settings?.seo?.meta_description ||
         settings?.description ||
         '';
};

export const getMetaTitle = (seoSettings: any, settings?: any): string => {
  return seoSettings?.meta_title || 
         seoSettings?.defaultTitle || 
         settings?.seo?.meta_title ||
         settings?.meta_title ||
         `${getSiteName(settings)}`;
};

export const getMetaDescription = (seoSettings: any, settings?: any): string => {
  return seoSettings?.meta_description || 
         seoSettings?.defaultDescription || 
         settings?.seo?.meta_description ||
         settings?.meta_description ||
         getSiteDescription(settings);
};

export const getMetaKeywords = (seoSettings: any, settings?: any): string[] => {
  const keywords = seoSettings?.meta_keywords || 
                   seoSettings?.defaultKeywords || 
                   settings?.seo?.meta_keywords ||
                   settings?.seo?.keywords ||
                   settings?.meta_keywords ||
                   settings?.keywords;
                   
  if (Array.isArray(keywords)) {
    return keywords;
  }
  if (typeof keywords === 'string') {
    return keywords.split(',').map((k: string) => k.trim());
  }
  return [];
};

export const getSiteFavicon = (settings: any): string => {
  return settings?.site_favicon || settings?.siteFavicon || settings?.favicon || '/favicon.ico';
};

export const getGoogleAnalyticsId = (seoSettings: any, analyticsSettings?: any): string => {
  return seoSettings?.google_analytics_id || 
         seoSettings?.googleAnalyticsId || 
         analyticsSettings?.google_analytics_id || 
         analyticsSettings?.googleAnalyticsId || 
         '';
};

export const getGoogleTagManagerId = (seoSettings: any, analyticsSettings?: any): string => {
  return seoSettings?.google_tag_manager_id || 
         seoSettings?.googleTagManagerId || 
         analyticsSettings?.google_tag_manager_id || 
         analyticsSettings?.googleTagManagerId || 
         '';
};

export const getGoogleAdsenseId = (adsSettings: any): string => {
  return adsSettings?.google_adsense_id || adsSettings?.googleAdsenseId || '';
};

export const isAdsEnabled = (adsSettings: any): boolean => {
  return adsSettings?.enable_ads || adsSettings?.enableAds || false;
};

export const isAnalyticsEnabled = (analyticsSettings: any): boolean => {
  return analyticsSettings?.enable_analytics || analyticsSettings?.enableAnalytics || false;
};

export const getFacebookPixelId = (analyticsSettings: any): string => {
  return analyticsSettings?.facebook_pixel_id || analyticsSettings?.facebookPixelId || '';
};

export const getHotjarId = (analyticsSettings: any): string => {
  return analyticsSettings?.hotjar_id || analyticsSettings?.hotjarId || '';
};

export const getGoogleSiteVerification = (seoSettings: any): string => {
  return seoSettings?.google_site_verification || seoSettings?.googleSiteVerification || '';
};

export const getBingVerification = (seoSettings: any): string => {
  return seoSettings?.bing_verification || seoSettings?.bingVerification || '';
};

export const getYandexVerification = (seoSettings: any): string => {
  return seoSettings?.yandex_verification || seoSettings?.yandexVerification || '';
};

export const getBusinessHours = (companySettings: any): string => {
  return companySettings?.business_hours || 
         companySettings?.businessHours || 
         companySettings?.operating_hours ||
         companySettings?.operatingHours ||
         '';
};

export const getAdSlot = (adsSettings: any, slot: 'header' | 'sidebar' | 'footer' | 'inArticle'): string => {
  const slotKey = slot === 'inArticle' ? 'in_article' : slot;
  return adsSettings?.google_adsense_slots?.[slotKey] || 
         adsSettings?.google_adsense_slots?.[slot] ||
         adsSettings?.googleAdsenseSlots?.[slot] || 
         '';
};