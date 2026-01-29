// Analytics utility functions for tracking events

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: {
      (...args: any[]): void;
      callMethod?: (...args: any[]) => void;
      queue?: any[];
      push?: any;
      loaded?: boolean;
      version?: string;
    };
    hj: (...args: any[]) => void;
  }
}

// Google Analytics tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Facebook Pixel tracking functions
export const trackFacebookEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackFacebookCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

// Common tracking events for blog/website
export const trackBlogPostView = (postTitle: string, postCategory: string) => {
  trackEvent('view_item', 'blog', postTitle);
  trackFacebookEvent('ViewContent', {
    content_name: postTitle,
    content_category: postCategory,
    content_type: 'blog_post',
  });
};

export const trackContactFormSubmit = () => {
  trackEvent('form_submit', 'contact', 'contact_form');
  trackFacebookEvent('Contact');
};

export const trackNewsletterSignup = () => {
  trackEvent('sign_up', 'newsletter', 'newsletter_signup');
  trackFacebookEvent('Subscribe');
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'site_search', searchTerm);
  trackFacebookEvent('Search', {
    search_string: searchTerm,
  });
};

export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', 'downloads', fileName);
  trackFacebookEvent('Download', {
    content_name: fileName,
    content_type: fileType,
  });
};

export const trackOutboundLink = (url: string, linkText: string) => {
  trackEvent('click', 'outbound_link', `${linkText} - ${url}`);
};

export const trackSocialShare = (platform: string, url: string) => {
  trackEvent('share', 'social', `${platform} - ${url}`);
  trackFacebookEvent('Share', {
    content_name: url,
    method: platform,
  });
};