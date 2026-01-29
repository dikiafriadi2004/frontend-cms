// Simplified API Adapter with better error handling and caching
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

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Request queue to prevent duplicate simultaneous requests
const requestQueue = new Map<string, Promise<any>>();

// Cache TTL (Time To Live) in milliseconds
const CACHE_TTL = {
  settings: 5 * 60 * 1000, // 5 minutes for settings
  menu: 2 * 60 * 1000,     // 2 minutes for menu
  posts: 1 * 60 * 1000,    // 1 minute for posts
  default: 30 * 1000       // 30 seconds default
};

// Get data from cache
function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    console.log(`🎯 Cache hit for: ${key} (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
    return cached.data;
  }
  if (cached) {
    cache.delete(key); // Remove expired cache
    console.log(`⏰ Cache expired for: ${key}`);
  }
  return null;
}

// Set data to cache
function setToCache<T>(key: string, data: T, ttl: number = CACHE_TTL.default): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
  console.log(`💾 Cached data for: ${key} (TTL: ${Math.round(ttl / 1000)}s, total cached items: ${cache.size})`);
}

// Clear cache for specific key or all
function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
    console.log(`🗑️ Cleared cache for: ${key}`);
  } else {
    cache.clear();
    console.log(`🗑️ Cleared all cache`);
  }
}

// Get cache statistics
function getCacheStats(): { size: number; keys: string[]; totalSize: number } {
  const keys = Array.from(cache.keys());
  const totalSize = keys.reduce((size, key) => {
    const cached = cache.get(key);
    if (cached) {
      return size + JSON.stringify(cached.data).length;
    }
    return size;
  }, 0);
  
  return {
    size: cache.size,
    keys,
    totalSize
  };
}

// Safe API request function with caching and better error handling
async function safeApiRequest<T>(endpoint: string, options?: RequestInit, useCache: boolean = true, cacheTTL: number = CACHE_TTL.default): Promise<T | null> {
  // Only use cache for GET requests
  const isGetRequest = !options?.method || options.method.toUpperCase() === 'GET';
  const cacheKey = `${endpoint}_${JSON.stringify(options || {})}`;
  
  // Try to get from cache first (only for GET requests)
  if (useCache && isGetRequest) {
    const cached = getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Check if there's already a pending request for this endpoint
  if (isGetRequest && requestQueue.has(cacheKey)) {
    console.log(`⏳ Request already in progress for: ${endpoint}, waiting...`);
    try {
      return await requestQueue.get(cacheKey);
    } catch (error) {
      console.warn(`⚠️ Queued request failed for ${endpoint}:`, error);
      requestQueue.delete(cacheKey);
    }
  }

  // Create the request promise
  const requestPromise = makeApiRequest<T>(endpoint, options, cacheKey, cacheTTL, useCache && isGetRequest);
  
  // Add to queue for GET requests
  if (isGetRequest) {
    requestQueue.set(cacheKey, requestPromise);
  }

  try {
    const result = await requestPromise;
    return result;
  } finally {
    // Remove from queue when done
    if (isGetRequest) {
      requestQueue.delete(cacheKey);
    }
  }
}

// Actual API request implementation
async function makeApiRequest<T>(endpoint: string, options: RequestInit | undefined, cacheKey: string, cacheTTL: number, shouldCache: boolean): Promise<T | null> {
  try {
    const baseUrl = API_CONFIG.baseUrl;
    const url = `${baseUrl}${API_CONFIG.apiPrefix}${endpoint}`;
    
    console.log(`📡 API Request: ${options?.method || 'GET'} ${url}`);
    
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

    console.log(`📊 API Response: ${response.status} ${response.statusText} for ${endpoint}`);

    if (!response.ok) {
      console.warn(`❌ API request failed: ${response.status} ${response.statusText} for ${endpoint}`);
      
      // Try to get error details from response
      try {
        const errorText = await response.text();
        console.warn(`Error details: ${errorText}`);
      } catch (e) {
        console.warn('Could not read error response body');
      }
      
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`⚠️ API returned non-JSON response for ${endpoint}, content-type: ${contentType}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ API Success for ${endpoint}:`, data);
    
    // Cache the result (only for GET requests)
    if (shouldCache) {
      setToCache(cacheKey, data, cacheTTL);
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn(`⏱️ API request timeout for ${endpoint}`);
      } else if (error.message.includes('JSON')) {
        console.warn(`📄 API returned invalid JSON for ${endpoint}`);
      } else if (error.message.includes('fetch')) {
        console.warn(`🌐 Network error for ${endpoint}: ${error.message}`);
      } else {
        console.warn(`❌ API request failed for ${endpoint}:`, error.message);
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

// Menu API with better fallback and caching
export class MenuAPI {
  static async getNavigation(): Promise<MenuItem[]> {
    const response = await safeApiRequest<any>('/menus/navigation', undefined, true, CACHE_TTL.menu);
    
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
    const response = await safeApiRequest<any>('/menus', undefined, true, CACHE_TTL.menu);
    
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
    const response = await safeApiRequest<any>('/pages', undefined, true, CACHE_TTL.default);
    if (!response) return [];
    
    const items = response.data || response.pages || response;
    return Array.isArray(items) ? items : [];
  }

  static async getBySlug(slug: string): Promise<any | null> {
    const response = await safeApiRequest<any>(`/pages/${slug}`, undefined, true, CACHE_TTL.default);
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

// Posts API with better error handling and caching
export class PostsAPI {
  static async getAll(params: { page?: number; limit?: number } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('per_page', params.limit.toString()); // Use per_page instead of limit
    
    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await safeApiRequest<any>(endpoint, undefined, true, CACHE_TTL.posts);
    
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
    console.log(`🔍 PostsAPI.getBySlug called with slug: ${slug}`);
    
    const response = await safeApiRequest<any>(`/posts/${slug}`, undefined, true, CACHE_TTL.posts);
    
    if (!response) {
      console.warn(`⚠️ No response from API for post slug: ${slug}`);
      return null;
    }
    
    console.log(`📄 Raw API response for post ${slug}:`, response);
    
    const post = response.data || response;
    
    if (!post) {
      console.warn(`⚠️ No post data found in response for slug: ${slug}`);
      return null;
    }
    
    const transformedPost = transformBlogPostData(post);
    console.log(`✅ Transformed post data for ${slug}:`, transformedPost);
    
    return transformedPost;
  }

  static async getFeatured(limit: number = 3): Promise<any[]> {
    const response = await safeApiRequest<any>(`/posts/featured?limit=${limit}`, undefined, true, CACHE_TTL.posts);
    if (!response) return [];
    
    const posts = response.data || response;
    return Array.isArray(posts) ? posts.map(transformBlogPostData) : [];
  }

  static async getLatest(limit: number = 3): Promise<any[]> {
    const response = await safeApiRequest<any>(`/posts/latest?limit=${limit}`, undefined, true, CACHE_TTL.posts);
    if (!response) {
      // Fallback: try to get from general posts endpoint
      const fallbackResponse = await safeApiRequest<any>(`/posts?limit=${limit}`, undefined, true, CACHE_TTL.posts);
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
    
    const response = await safeApiRequest<any>(`/posts/search?${queryParams.toString()}`, undefined, true, CACHE_TTL.posts);
    
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

// Categories API with caching
export class CategoriesAPI {
  static async getAll(): Promise<any[]> {
    const response = await safeApiRequest<any>('/categories', undefined, true, CACHE_TTL.default);
    if (!response) return [];
    
    const items = response.data || response;
    return Array.isArray(items) ? items : [];
  }
}

// Settings API with better fallback and caching
export class SettingsAPI {
  static async getGeneral(): Promise<any> {
    console.log('📡 Fetching settings from /settings/general...');
    const response = await safeApiRequest<any>('/settings/general', undefined, true, CACHE_TTL.settings);
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
    const response = await safeApiRequest<any>('/settings/seo', undefined, true, CACHE_TTL.settings);
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
    const response = await safeApiRequest<any>('/settings/social', undefined, true, CACHE_TTL.settings);
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
    const response = await safeApiRequest<any>('/settings/company', undefined, true, CACHE_TTL.settings);
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
    // This method is for AdSense settings, not the ads data itself
    // Since your API doesn't have AdSense settings endpoint, return defaults
    // The actual ads data should be fetched using AdsAPI.getAllAds() or AdsAPI.getAdsByPosition()
    console.warn('SettingsAPI.getAds() called - this is for AdSense settings, not ads data. Use AdsAPI instead.');
    
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
      enableAds: true, // Enable ads since you have ads API
      enable_ads: true,
    };
  }

  static async getAnalytics(): Promise<any> {
    try {
      const response = await safeApiRequest<any>('/settings/analytics', undefined, true, CACHE_TTL.settings);
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
    const response = await safeApiRequest<any>('/settings/company', undefined, true, CACHE_TTL.settings);
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
    }, false); // Don't cache POST requests
    return response !== null;
  }
}

// Export cache management functions
export { clearCache, setToCache, getFromCache, getCacheStats };