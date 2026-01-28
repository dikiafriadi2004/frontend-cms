import { 
  ApiConfig, 
  MenuResponse, 
  MenuCreateRequest,
  MenuUpdateRequest,
  MenuReorderRequest,
  PageContent, 
  BlogResponse, 
  ApiBlogPost,
  ApiResponse,
  MenuItem,
  SiteSettings
} from '@/types/global';

// Constants
const DEFAULT_POSTS_PER_PAGE = 10;

// Import API Adapter
import { 
  MenuAPI, 
  PagesAPI,
  PostsAPI, 
  CategoriesAPI, 
  SettingsAPI, 
  ContactAPI,
  transformMenuData,
  transformMenuItemData,
  transformBlogPostData
} from '@/lib/cms-adapter';

// API Configuration - sekarang menggunakan API adapter
const API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000',
  endpoints: {
    menu: process.env.API_ENDPOINT_MENU || '/api/menus',
    pages: process.env.API_ENDPOINT_PAGES || '/api/pages',
    blog: process.env.API_ENDPOINT_POSTS || '/api/posts',
    settings: process.env.API_ENDPOINT_SETTINGS || '/api/settings'
  }
};

// Menu API - Updated untuk menggunakan API Adapter dengan fallback
export async function fetchMenu(): Promise<MenuResponse> {
  try {
    // Try multiple strategies to get menu data
    let menuItems: MenuItem[] = [];
    
    // Strategy 1: Try navigation menu
    try {
      menuItems = await MenuAPI.getNavigation();
      if (menuItems.length > 0) {
        console.log('✅ Menu loaded from navigation endpoint');
      }
    } catch (navError) {
      console.warn('Navigation menu failed, trying general menu:', navError);
      
      // Strategy 2: Try general menu endpoint
      try {
        menuItems = await MenuAPI.getAll();
        if (menuItems.length > 0) {
          console.log('✅ Menu loaded from general endpoint');
        }
      } catch (generalError) {
        console.warn('General menu failed:', generalError);
      }
    }
    
    // Filter and sort menu items
    const activeMenus = menuItems
      .filter(item => item.isActive && item.isVisible)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    if (activeMenus.length > 0) {
      return {
        success: true,
        data: activeMenus
      };
    }
    
    // If no menu items found, return fallback
    console.warn('No menu items found, using fallback data');
    return {
      success: false,
      data: [
        { 
          id: '1', 
          name: 'Home', 
          href: '/', 
          order: 1, 
          position: 1,
          isActive: true, 
          isVisible: true 
        },
        { 
          id: '2', 
          name: 'Blog', 
          href: '/blog', 
          order: 2, 
          position: 2,
          isActive: true, 
          isVisible: true 
        },
        { 
          id: '3', 
          name: 'Contact', 
          href: '/contact', 
          order: 3, 
          position: 3,
          isActive: true, 
          isVisible: true 
        },
        { 
          id: '4', 
          name: 'Privacy', 
          href: '/privacy', 
          order: 4, 
          position: 4,
          isActive: true, 
          isVisible: true 
        },
      ]
    };
  } catch (error) {
    console.error('All menu fetch strategies failed:', error);
    
    // Final fallback data
    return {
      success: false,
      data: [
        { 
          id: '1', 
          name: 'Home', 
          href: '/', 
          order: 1, 
          position: 1,
          isActive: true, 
          isVisible: true 
        },
        { 
          id: '2', 
          name: 'Blog', 
          href: '/blog', 
          order: 2, 
          position: 2,
          isActive: true, 
          isVisible: true 
        },
        { 
          id: '3', 
          name: 'Contact', 
          href: '/contact', 
          order: 3, 
          position: 3,
          isActive: true, 
          isVisible: true 
        },
        { 
          id: '4', 
          name: 'Privacy', 
          href: '/privacy', 
          order: 4, 
          position: 4,
          isActive: true, 
          isVisible: true 
        },
      ]
    };
  }
}

// Create menu item
export async function createMenuItem(menuData: MenuCreateRequest): Promise<ApiResponse<MenuItem>> {
  try {
    const createdMenu = await MenuAPI.create(menuData);
    return {
      success: true,
      data: createdMenu
    };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      error: error instanceof Error ? error.message : 'Failed to create menu item'
    };
  }
}

// Update menu item
export async function updateMenuItem(menuData: MenuUpdateRequest): Promise<ApiResponse<MenuItem>> {
  try {
    const updatedMenu = await MenuAPI.update(menuData.id, menuData);
    return {
      success: true,
      data: updatedMenu
    };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      error: error instanceof Error ? error.message : 'Failed to update menu item'
    };
  }
}

// Delete menu item
export async function deleteMenuItem(id: string): Promise<ApiResponse<any>> {
  try {
    const success = await MenuAPI.delete(id);
    return {
      success,
      data: { deleted: success }
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete menu item'
    };
  }
}

// Reorder menu items (drag and drop)
export async function reorderMenuItems(reorderData: MenuReorderRequest): Promise<ApiResponse<any>> {
  try {
    const success = await MenuAPI.reorder(reorderData.items);
    return {
      success,
      data: { reordered: success }
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to reorder menu items'
    };
  }
}

// Pages API - Updated untuk menggunakan API Adapter
export async function fetchPageContent(slug: string): Promise<PageContent | null> {
  try {
    const pageData = await PagesAPI.getBySlug(slug);
    return pageData;
  } catch (error) {
    console.error(`Failed to fetch page ${slug}:`, error);
    return null;
  }
}

export async function fetchAllPages(): Promise<PageContent[]> {
  try {
    const pages = await PagesAPI.getAll();
    return pages;
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
}

// Blog API - Updated untuk menggunakan API Adapter dengan format yang benar
export async function fetchBlogPosts(page: number = 1, limit: number = DEFAULT_POSTS_PER_PAGE): Promise<BlogResponse> {
  try {
    const result = await PostsAPI.getAll({ page, limit });
    
    const paginationData = {
      current_page: result.pagination.current_page || result.pagination.page || page,
      last_page: result.pagination.last_page || result.pagination.totalPages || Math.ceil(result.pagination.total / (result.pagination.per_page || result.pagination.limit || limit)),
      per_page: result.pagination.per_page || result.pagination.limit || limit,
      total: result.pagination.total || 0,
      has_more: result.pagination.hasMore || result.pagination.has_more_pages || false,
      next_page_url: result.pagination.nextPageUrl || null,
      // Legacy support
      page: result.pagination.current_page || result.pagination.page || page,
      limit: result.pagination.per_page || result.pagination.limit || limit,
      totalPages: result.pagination.last_page || result.pagination.totalPages || 0
    };
    
    return {
      success: true,
      data: result.data,
      pagination: paginationData
    };
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    
    // Fallback data dengan format yang benar
    return {
      success: false,
      data: [],
      pagination: {
        current_page: 1,
        last_page: 0,
        per_page: limit,
        total: 0,
        has_more: false,
        next_page_url: null,
        // Legacy support
        page: 1,
        limit: limit,
        totalPages: 0
      }
    };
  }
}

export async function fetchBlogPost(slug: string): Promise<ApiBlogPost | null> {
  try {
    const post = await PostsAPI.getBySlug(slug);
    return post;
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error);
    return null;
  }
}

export async function fetchBlogCategories(): Promise<string[]> {
  try {
    const categories = await CategoriesAPI.getAll();
    return categories.map((cat: any) => cat.name || cat.title || cat.slug);
  } catch (error) {
    console.error('Failed to fetch blog categories:', error);
    return ['Tutorial', 'Bisnis', 'Update', 'Keamanan', 'Technical', 'Analisis'];
  }
}

// New functions untuk API features
export async function fetchFeaturedPosts(limit: number = 3): Promise<ApiBlogPost[]> {
  try {
    const posts = await PostsAPI.getFeatured(limit);
    return posts;
  } catch (error) {
    console.error('Failed to fetch featured posts:', error);
    return [];
  }
}

export async function fetchLatestPosts(limit: number = 3): Promise<ApiBlogPost[]> {
  try {
    const posts = await PostsAPI.getLatest(limit);
    return posts;
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    return [];
  }
}

export async function searchBlogPosts(query: string, page: number = 1, limit: number = 10): Promise<BlogResponse> {
  try {
    const result = await PostsAPI.search(query, { page, limit });
    
    return {
      success: true,
      data: result.data,
      pagination: {
        current_page: result.pagination.page || page,
        last_page: result.pagination.totalPages || Math.ceil(result.pagination.total / result.pagination.limit),
        per_page: result.pagination.limit || limit,
        total: result.pagination.total || 0,
        has_more: result.pagination.hasMore || false,
        next_page_url: null,
        // Legacy support
        page: result.pagination.page || page,
        limit: result.pagination.limit || limit,
        totalPages: result.pagination.totalPages || 0
      }
    };
  } catch (error) {
    console.error('Failed to search blog posts:', error);
    return {
      success: false,
      data: [],
      pagination: {
        current_page: 1,
        last_page: 0,
        per_page: limit,
        total: 0,
        has_more: false,
        next_page_url: null,
        // Legacy support
        page: 1,
        limit: limit,
        totalPages: 0
      }
    };
  }
}

// Settings API - Updated untuk menggunakan API Adapter
export async function fetchSiteSettings(): Promise<ApiResponse<SiteSettings>> {
  try {
    // Combine different settings endpoints
    const [generalSettings, seoSettings, socialSettings, companySettings, ctaSettings] = await Promise.all([
      SettingsAPI.getGeneral().catch(() => ({})),
      SettingsAPI.getSeo().catch(() => ({})),
      SettingsAPI.getSocial().catch(() => ({})),
      SettingsAPI.getCompany().catch(() => ({})),
      SettingsAPI.getCTA().catch(() => ({}))
    ]);

    // Merge all settings
    const combinedSettings = {
      ...generalSettings,
      ...seoSettings,
      ...socialSettings,
      ...companySettings,
      ...ctaSettings,
      // Map API fields to our expected format - prioritize API data
      siteName: generalSettings.site_name || companySettings.site_name || generalSettings.siteName || companySettings.siteName || companySettings.company_name || generalSettings.company_name || 'Website',
      site_name: generalSettings.site_name || companySettings.site_name || generalSettings.siteName || companySettings.siteName || companySettings.company_name || generalSettings.company_name || 'Website',
      siteDescription: generalSettings.site_description || generalSettings.siteDescription || 'Website Description',
      logo: generalSettings.site_logo || generalSettings.logo || '/logo.svg',
      favicon: generalSettings.site_favicon || generalSettings.favicon || '/favicon.ico',
      // CTA Content Fields - only use API data, no fallbacks
      cta_title: ctaSettings.cta_title || generalSettings.cta_title || companySettings.cta_title,
      cta_subtitle: ctaSettings.cta_subtitle || generalSettings.cta_subtitle || companySettings.cta_subtitle,
      cta_description: ctaSettings.cta_description || generalSettings.cta_description || companySettings.cta_description,
      cta_button_text: ctaSettings.cta_button_text || generalSettings.cta_button_text || companySettings.cta_button_text,
      cta_button_url: companySettings.cta_button_url || ctaSettings.cta_button_url || generalSettings.cta_button_url,
      colors: {
        primary: generalSettings.primary_color || generalSettings.colors?.primary || '#3B82F6',
        secondary: generalSettings.secondary_color || generalSettings.colors?.secondary || '#6366F1',
        accent: generalSettings.accent_color || generalSettings.colors?.accent || '#8B5CF6'
      },
      contact: {
        email: companySettings.email || companySettings.contact?.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com',
        phone: companySettings.phone || companySettings.contact?.phone || '+62 123 456 789',
        whatsapp: companySettings.whatsapp || companySettings.contact?.whatsapp || '+62 123 456 789',
        address: companySettings.address || companySettings.contact?.address || 'Jakarta, Indonesia'
      },
      social: {
        facebook: socialSettings.facebook || socialSettings.social?.facebook,
        instagram: socialSettings.instagram || socialSettings.social?.instagram,
        twitter: socialSettings.twitter || socialSettings.social?.twitter,
        linkedin: socialSettings.linkedin || socialSettings.social?.linkedin
      },
      seo: {
        defaultTitle: seoSettings.default_title || seoSettings.seo?.defaultTitle || 'Website',
        defaultDescription: seoSettings.default_description || seoSettings.seo?.defaultDescription || 'Website Description',
        defaultKeywords: seoSettings.default_keywords || seoSettings.seo?.defaultKeywords || ['website', 'aplikasi', 'layanan']
      }
    };
    
    return {
      success: true,
      data: combinedSettings
    };
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    
    // Fallback data jika API gagal
    return {
      success: false,
      data: {
        siteName: 'Website',
        siteDescription: 'Website Description',
        logo: '/logo.svg',
        favicon: '/favicon.ico',
        colors: {
          primary: '#3B82F6',
          secondary: '#6366F1',
          accent: '#8B5CF6'
        },
        contact: {
          email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com',
          phone: '+62 123 456 789',
          whatsapp: '+62 123 456 789',
          address: 'Jl. Teknologi No. 123, Jakarta Selatan, 12345'
        },
        social: {
          facebook: 'https://facebook.com/example',
          instagram: 'https://instagram.com/example',
          twitter: 'https://twitter.com/example'
        },
        seo: {
          defaultTitle: 'Website',
          defaultDescription: 'Website Description',
          defaultKeywords: ['website', 'aplikasi', 'layanan']
        }
      }
    };
  }
}

// Contact Form Submission - Updated untuk menggunakan API Adapter
export async function submitContactForm(formData: any): Promise<ApiResponse<any>> {
  try {
    const success = await ContactAPI.submit(formData);
    return {
      success,
      data: { submitted: success },
      message: success ? 'Pesan berhasil dikirim' : 'Gagal mengirim pesan'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to submit contact form'
    };
  }
}

// Cache management
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 1000; // 30 seconds for development

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function clearAllCaches(): void {
  cache.clear();
}

// Cached API functions
export async function fetchMenuCached(): Promise<MenuResponse> {
  const cacheKey = 'menu';
  const cached = getCachedData<MenuResponse>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const data = await fetchMenu();
  setCachedData(cacheKey, data);
  return data;
}

export async function fetchSiteSettingsCached(): Promise<ApiResponse<SiteSettings>> {
  const cacheKey = 'settings';
  const cached = getCachedData<ApiResponse<SiteSettings>>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const data = await fetchSiteSettings();
  setCachedData(cacheKey, data);
  return data;
}