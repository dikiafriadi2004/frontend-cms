// Global type definitions

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  slug: string;
  category: string;
  readTime: string;
  image?: string;
  tags?: string[];
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  company?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

// API Configuration Types
export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    menu: string;
    pages: string;
    blog: string;
    settings: string;
  };
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  href: string;
  order: number;
  position?: number; // For drag-and-drop positioning
  isActive: boolean;
  isVisible: boolean;
  target?: '_blank' | '_self';
  icon?: string;
  description?: string;
  children?: MenuItem[];
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  message?: string;
}

// Menu Management Types
export interface MenuCreateRequest {
  name: string;
  href: string;
  order?: number;
  position?: number;
  isActive?: boolean;
  isVisible?: boolean;
  target?: '_blank' | '_self';
  icon?: string;
  description?: string;
  parentId?: string | null;
}

export interface MenuUpdateRequest extends Partial<MenuCreateRequest> {
  id: string;
}

export interface MenuReorderRequest {
  items: {
    id: string;
    order: number;
    position: number;
    parentId?: string | null;
  }[];
}

// Page Content Types
export interface PageContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  template: 'home' | 'blog' | 'contact' | 'privacy' | 'about' | 'terms' | 'custom';
  content: {
    hero?: HeroContent;
    sections?: PageSection[];
    meta?: PageMeta;
    html?: string; // Raw HTML content from API
    text?: string; // Plain text content from API
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  ctaButtons?: CtaButton[];
}

export interface CtaButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
}

export interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'faq' | 'blog' | 'cta' | 'contact' | 'custom';
  title?: string;
  content: any;
  order: number;
  isVisible: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// Enhanced Blog Types untuk API
export interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  isPublished: boolean;
  featuredImage?: string;
}

export interface BlogResponse {
  success: boolean;
  data: ApiBlogPost[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
    next_page_url?: string | null;
    // Legacy support untuk backward compatibility
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Settings Types
export interface SiteSettings {
  siteName: string;
  site_name?: string;
  companyName?: string;
  company_name?: string;
  siteDescription: string;
  site_description?: string;
  logo: string;
  favicon: string;
  siteFavicon?: string;
  site_favicon?: string;
  // CTA Content Fields
  cta_title?: string;
  cta_subtitle?: string;
  cta_description?: string;
  cta_button_text?: string;
  cta_button_url?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours?: string;
    business_hours?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  seo: {
    defaultTitle: string;
    meta_title?: string;
    defaultDescription: string;
    meta_description?: string;
    defaultKeywords: string[];
    meta_keywords?: string[];
    googleAnalyticsId?: string;
    google_analytics_id?: string;
    googleTagManagerId?: string;
    google_tag_manager_id?: string;
    googleSiteVerification?: string;
    google_site_verification?: string;
    bingVerification?: string;
    bing_verification?: string;
    yandexVerification?: string;
    yandex_verification?: string;
  };
  ads?: {
    googleAdsenseId?: string;
    google_adsense_id?: string;
    googleAdsenseSlots?: {
      header?: string;
      sidebar?: string;
      footer?: string;
      inArticle?: string;
    };
    google_adsense_slots?: {
      header?: string;
      sidebar?: string;
      footer?: string;
      in_article?: string;
    };
    enableAds?: boolean;
    enable_ads?: boolean;
  };
  analytics?: {
    googleAnalyticsId?: string;
    google_analytics_id?: string;
    googleTagManagerId?: string;
    google_tag_manager_id?: string;
    facebookPixelId?: string;
    facebook_pixel_id?: string;
    hotjarId?: string;
    hotjar_id?: string;
    enableAnalytics?: boolean;
    enable_analytics?: boolean;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}