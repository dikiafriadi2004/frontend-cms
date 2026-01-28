// Simplified API Adapter with better error handling
import { MenuItem, MenuCreateRequest, MenuUpdateRequest, MenuReorderRequest } from '@/types/global';

// Constants
const DEFAULT_POSTS_PER_PAGE = 10;

// Configuration untuk API
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000',
  apiPrefix: '/api/v1',
  token: process.env.NEXT_PUBLIC_API_TOKEN || process.env.NEXT_PUBLIC_CMS_TOKEN || '',
  timeout: 10000,
  retries: 2,
  retryDelay: 1000,
};

// Safe API request function with better error handling
async function safeApiRequest<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const baseUrl = API_CONFIG.baseUrl;
    const url = `${baseUrl}${API_CONFIG.apiPrefix}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (API_CONFIG.token) {
      defaultHeaders['Authorization'] = `Bearer ${API_CONFIG.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`API request failed: ${response.status} ${response.statusText} for ${endpoint}`);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`API returned non-JSON response for ${endpoint}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn(`API request timeout for ${endpoint}`);
      } else if (error.message.includes('JSON')) {
        console.warn(`API returned invalid JSON for ${endpoint}`);
      } else {
        console.warn(`API request failed for ${endpoint}:`, error.message);
      }
    }
    return null;
  }
}

// Transform functions
export function transformMenuData(item: any): MenuItem {
  // Fix href to use relative paths instead of absolute URLs
  let href = item.href || item.url || item.link || '/';
  
  // If href contains localhost:8000, convert to relative path
  if (href.includes('localhost:8000')) {
    const url = new URL(href);
    href = url.pathname;
  }
  
  // Ensure href starts with /
  if (!href.startsWith('/')) {
    href = '/' + href;
  }

  return {
    id: item.id?.toString() || Math.random().toString(),
    name: item.name || item.title || item.label || 'Menu Item',
    href: href,
    order: item.order || item.position || 0,
    position: item.position || item.order || 0,
    isActive: item.isActive !== false && item.is_active !== false,
    isVisible: item.isVisible !== false && item.is_visible !== false,
    target: item.target || '_self',
    icon: item.icon,
    description: item.description,
    children: item.children ? item.children.map(transformMenuData) : undefined,
    parentId: item.parentId || item.parent_id || null,
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
  };
}

export function transformMenuItemData(item: any): MenuItem {
  return transformMenuData(item);
}

export function transformBlogPostData(post: any): any {
  // Transform tags to handle both string and object formats
  let tags = post.tags || [];
  if (Array.isArray(tags)) {
    tags = tags.map(tag => {
      if (typeof tag === 'string') {
        return tag;
      } else if (typeof tag === 'object' && tag !== null) {
        // Extract name from tag object
        return tag.name || tag.slug || tag.title || 'Tag';
      }
      return 'Tag';
    });
  }

  return {
    id: post.id?.toString() || Math.random().toString(),
    title: post.title || 'Untitled',
    slug: post.slug || 'untitled',
    content: post.content || post.body || '',
    author: {
      name: post.author?.name || post.author_name || 'Anonymous',
      avatar: post.author?.avatar || post.author_avatar,
    },
    category: post.category?.name || post.category_name || 'Uncategorized',
    tags: tags,
    publishedAt: post.publishedAt || post.published_at || post.created_at || new Date().toISOString(),
    updatedAt: post.updatedAt || post.updated_at || new Date().toISOString(),
    readTime: post.readTime || post.read_time || '5 min read',
    isPublished: post.isPublished !== false && post.is_published !== false,
    featuredImage: post.featuredImage || post.featured_image || post.image,
  };
}

// Menu API with better fallback
export class MenuAPI {
  static async getNavigation(): Promise<MenuItem[]> {
    const response = await safeApiRequest<any>('/menus/navigation');
    
    if (response && response.data) {
      const items = response.data.items || response.data;
      return Array.isArray(items) ? items.map(transformMenuData) : [];
    }
    
    // Return fallback menu
    return [
      { id: '1', name: 'Home', href: '/', order: 1, position: 1, isActive: true, isVisible: true },
      { id: '2', name: 'Blog', href: '/blog', order: 2, position: 2, isActive: true, isVisible: true },
      { id: '3', name: 'Contact', href: '/contact', order: 3, position: 3, isActive: true, isVisible: true },
      { id: '4', name: 'Privacy', href: '/privacy', order: 4, position: 4, isActive: true, isVisible: true },
    ];
  }

  static async getAll(): Promise<MenuItem[]> {
    const response = await safeApiRequest<any>('/menus');
    
    if (response && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      return items.map(transformMenuData);
    }
    
    // Fallback to navigation
    return await MenuAPI.getNavigation();
  }

  static async create(menuData: MenuCreateRequest): Promise<MenuItem> {
    const response = await safeApiRequest<any>('/menus', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
    return transformMenuData(response?.data || response || {});
  }

  static async update(id: string, menuData: Partial<MenuUpdateRequest>): Promise<MenuItem> {
    const response = await safeApiRequest<any>(`/menus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
    return transformMenuData(response?.data || response || {});
  }

  static async delete(id: string): Promise<boolean> {
    const response = await safeApiRequest<any>(`/menus/${id}`, {
      method: 'DELETE',
    });
    return response !== null;
  }

  static async reorder(items: MenuReorderRequest['items']): Promise<boolean> {
    const response = await safeApiRequest<any>('/menus/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return response !== null;
  }
}

// Pages API with better error handling and data transformation
export class PagesAPI {
  static async getAll(): Promise<any[]> {
    const response = await safeApiRequest<any>('/pages');
    if (!response) return [];
    
    const items = response.data || response.pages || response;
    return Array.isArray(items) ? items : [];
  }

  static async getBySlug(slug: string): Promise<any | null> {
    const response = await safeApiRequest<any>(`/pages/${slug}`);
    const pageData = response?.data || response;
    
    if (!pageData) return null;
    
    // Transform and ensure required properties
    return {
      id: pageData.id?.toString() || Math.random().toString(),
      slug: pageData.slug || slug,
      title: pageData.title || 'Untitled Page',
      description: pageData.description || '',
      template: pageData.template || 'custom',
      content: {
        hero: pageData.content?.hero || pageData.hero,
        sections: pageData.content?.sections || pageData.sections || [],
        meta: pageData.content?.meta || pageData.meta || {},
        // Add full content from API - prioritize content field only
        html: pageData.content || pageData.body || '',
        text: pageData.text || ''
      },
      isActive: pageData.isActive !== false && pageData.is_active !== false,
      createdAt: pageData.createdAt || pageData.created_at || new Date().toISOString(),
      updatedAt: pageData.updatedAt || pageData.updated_at || new Date().toISOString(),
    };
  }
}

// Posts API with better error handling
export class PostsAPI {
  static async getAll(params: { page?: number; limit?: number } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('per_page', params.limit.toString()); // Use per_page instead of limit
    
    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await safeApiRequest<any>(endpoint);
    
    if (response && response.data) {
      const posts = Array.isArray(response.data) ? response.data : [response.data];
      const transformedPosts = posts.map(transformBlogPostData);
      
      // Extract pagination from response
      const paginationData = response.pagination || response.meta || {};
      const defaultLimit = params.limit || DEFAULT_POSTS_PER_PAGE;
      
      return {
        data: transformedPosts,
        pagination: {
          page: paginationData.current_page || params.page || 1,
          limit: paginationData.per_page || defaultLimit,
          total: paginationData.total || transformedPosts.length,
          totalPages: paginationData.last_page || Math.ceil((paginationData.total || transformedPosts.length) / (paginationData.per_page || defaultLimit)),
          hasMore: paginationData.has_more_pages || (paginationData.current_page < paginationData.last_page),
          current_page: paginationData.current_page || params.page || 1,
          last_page: paginationData.last_page || Math.ceil((paginationData.total || transformedPosts.length) / (paginationData.per_page || defaultLimit)),
          per_page: paginationData.per_page || defaultLimit,
        }
      };
    }
    
    // Return empty result
    const defaultLimit = params.limit || DEFAULT_POSTS_PER_PAGE;
    return {
      data: [],
      pagination: {
        page: params.page || 1,
        limit: defaultLimit,
        total: 0,
        totalPages: 0,
        hasMore: false,
        current_page: params.page || 1,
        last_page: 0,
        per_page: defaultLimit,
      }
    };
  }

  static async getBySlug(slug: string): Promise<any | null> {
    const response = await safeApiRequest<any>(`/posts/${slug}`);
    if (!response) return null;
    
    const post = response.data || response;
    return transformBlogPostData(post);
  }

  static async getFeatured(limit: number = 3): Promise<any[]> {
    const response = await safeApiRequest<any>(`/posts/featured?limit=${limit}`);
    if (!response) return [];
    
    const posts = response.data || response;
    return Array.isArray(posts) ? posts.map(transformBlogPostData) : [];
  }

  static async getLatest(limit: number = 3): Promise<any[]> {
    const response = await safeApiRequest<any>(`/posts/latest?limit=${limit}`);
    if (!response) {
      // Fallback: try to get from general posts endpoint
      const fallbackResponse = await safeApiRequest<any>(`/posts?limit=${limit}`);
      if (fallbackResponse && fallbackResponse.data) {
        const posts = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [fallbackResponse.data];
        return posts.slice(0, limit).map(transformBlogPostData);
      }
      return [];
    }
    
    const posts = response.data || response;
    return Array.isArray(posts) ? posts.map(transformBlogPostData) : [];
  }

  static async search(query: string, params: { page?: number; limit?: number } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await safeApiRequest<any>(`/posts/search?${queryParams.toString()}`);
    
    if (response && response.data) {
      const posts = Array.isArray(response.data) ? response.data : [response.data];
      const transformedPosts = posts.map(transformBlogPostData);
      
      return {
        data: transformedPosts,
        pagination: response.pagination || {
          page: params.page || 1,
          limit: params.limit || 10,
          total: transformedPosts.length,
          totalPages: 1,
          hasMore: false,
        }
      };
    }
    
    return {
      data: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
      }
    };
  }
}

// Categories API
export class CategoriesAPI {
  static async getAll(): Promise<any[]> {
    const response = await safeApiRequest<any>('/categories');
    if (!response) return [];
    
    const items = response.data || response;
    return Array.isArray(items) ? items : [];
  }
}

// Settings API with better fallback
export class SettingsAPI {
  static async getGeneral(): Promise<any> {
    console.log('📡 Fetching settings from /settings/general...');
    const response = await safeApiRequest<any>('/settings/general');
    const data = response?.data || response || {};
    
    // Debug log to see what we're getting from API
    console.log('🔍 Raw API response from /settings/general:', response);
    console.log('🔍 Processed data:', data);
    console.log('🔍 site_name from API:', data.site_name);
    console.log('🔍 site_description from API:', data.site_description);
    
    const processedData = {
      siteName: data.site_name || data.siteName || '',
      site_name: data.site_name || data.siteName || '',
      companyName: data.company_name || data.companyName || data.site_name || data.siteName || '',
      company_name: data.company_name || data.companyName || data.site_name || data.siteName || '',
      siteDescription: data.site_description || data.siteDescription || '',
      site_description: data.site_description || data.siteDescription || '',
      logo: data.site_logo || data.logo || '/logo.svg',
      site_logo: data.site_logo || data.logo || '/logo.svg',
      favicon: data.site_favicon || data.favicon || '/favicon.ico',
      siteFavicon: data.site_favicon || data.favicon || '/favicon.ico',
      site_favicon: data.site_favicon || data.favicon || '/favicon.ico',
      // CTA Content Fields - fallback values
      cta_title: data.cta_title,
      cta_subtitle: data.cta_subtitle,
      cta_description: data.cta_description,
      cta_button_text: data.cta_button_text,
      cta_button_url: data.cta_button_url,
      // Add all other fields from API
      ...data
    };
    
    console.log('✅ Processed general settings:', processedData);
    return processedData;
  }

  static async getSeo(): Promise<any> {
    const response = await safeApiRequest<any>('/settings/seo');
    return response?.data || response || {
      defaultTitle: '',
      meta_title: '',
      defaultDescription: '',
      meta_description: '',
      defaultKeywords: [],
      meta_keywords: [],
      googleAnalyticsId: '',
      google_analytics_id: '',
      googleTagManagerId: '',
      google_tag_manager_id: '',
      googleSiteVerification: '',
      google_site_verification: '',
      bingVerification: '',
      bing_verification: '',
      yandexVerification: '',
      yandex_verification: '',
    };
  }

  static async getSocial(): Promise<any> {
    const response = await safeApiRequest<any>('/settings/social');
    return response?.data || response || {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      tiktok: '',
    };
  }

  static async getCompany(): Promise<any> {
    const response = await safeApiRequest<any>('/settings/company');
    const data = response?.data || response || {};
    
    // Debug log to see what we're getting from API
    console.log('🔍 Company settings from API:', data);
    
    return {
      companyName: data.company_name || data.companyName || data.site_name || data.siteName || 'Website',
      company_name: data.company_name || data.companyName || data.site_name || data.siteName || 'Website',
      siteName: data.site_name || data.siteName || data.company_name || data.companyName || 'Website',
      site_name: data.site_name || data.siteName || data.company_name || data.companyName || 'Website',
      email: data.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com',
      phone: data.phone || '+62 123 456 789',
      whatsapp: data.whatsapp || '+62 123 456 789',
      address: data.address || 'Jakarta, Indonesia',
      businessHours: data.business_hours || data.businessHours || 'Senin - Jumat, 09:00 - 17:00 WIB',
      business_hours: data.business_hours || data.businessHours || 'Senin - Jumat, 09:00 - 17:00 WIB',
      // CTA fields should come from API only
      cta_title: data.cta_title,
      cta_subtitle: data.cta_subtitle,
      cta_description: data.cta_description,
      cta_button_text: data.cta_button_text,
      cta_button_url: data.cta_button_url,
      // Add all other fields from API
      ...data
    };
  }

  static async getAds(): Promise<any> {
    try {
      const response = await safeApiRequest<any>('/settings/ads');
      return response?.data || response || {
        googleAdsenseId: '',
        google_adsense_id: '',
        googleAdsenseSlots: {
          header: '',
          sidebar: '',
          footer: '',
          inArticle: '',
        },
        google_adsense_slots: {
          header: '',
          sidebar: '',
          footer: '',
          in_article: '',
        },
        enableAds: false,
        enable_ads: false,
      };
    } catch (error) {
      console.warn('Ads settings endpoint not available, using defaults');
      return {
        googleAdsenseId: '',
        google_adsense_id: '',
        googleAdsenseSlots: {
          header: '',
          sidebar: '',
          footer: '',
          inArticle: '',
        },
        google_adsense_slots: {
          header: '',
          sidebar: '',
          footer: '',
          in_article: '',
        },
        enableAds: false,
        enable_ads: false,
      };
    }
  }

  static async getAnalytics(): Promise<any> {
    try {
      const response = await safeApiRequest<any>('/settings/analytics');
      return response?.data || response || {
        googleAnalyticsId: '',
        google_analytics_id: '',
        googleTagManagerId: '',
        google_tag_manager_id: '',
        facebookPixelId: '',
        facebook_pixel_id: '',
        hotjarId: '',
        hotjar_id: '',
        enableAnalytics: false,
        enable_analytics: false,
      };
    } catch (error) {
      console.warn('Analytics settings endpoint not available, using defaults');
      return {
        googleAnalyticsId: '',
        google_analytics_id: '',
        googleTagManagerId: '',
        google_tag_manager_id: '',
        facebookPixelId: '',
        facebook_pixel_id: '',
        hotjarId: '',
        hotjar_id: '',
        enableAnalytics: false,
        enable_analytics: false,
      };
    }
  }

  static async getCTA(): Promise<any> {
    const response = await safeApiRequest<any>('/settings/company');
    return response?.data || response || {
      // No fallback values - only use API data from company settings
    };
  }
}

// Contact API
export class ContactAPI {
  static async submit(formData: any): Promise<boolean> {
    const response = await safeApiRequest<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response !== null;
  }
}