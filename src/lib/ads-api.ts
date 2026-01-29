// Ads API Integration
import { getFromCache, setToCache } from './cms-adapter';

// Configuration untuk API
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000',
  apiPrefix: '/api/v1',
  token: process.env.NEXT_PUBLIC_API_TOKEN || process.env.NEXT_PUBLIC_CMS_TOKEN || '',
  timeout: 10000,
};

// Cache TTL for ads (shorter than settings since ads might change more frequently)
const ADS_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

// Safe API request function for ads with caching
async function safeApiRequest<T>(endpoint: string, options?: RequestInit, useCache: boolean = true): Promise<T | null> {
  // Only use cache for GET requests
  const isGetRequest = !options?.method || options.method.toUpperCase() === 'GET';
  const cacheKey = `ads_${endpoint}_${JSON.stringify(options || {})}`;
  
  // Try to get from cache first (only for GET requests)
  if (useCache && isGetRequest) {
    const cached = getFromCache<T>(cacheKey);
    if (cached) {
      console.log(`🎯 Ads cache hit for: ${endpoint}`);
      return cached;
    }
  }

  try {
    const baseUrl = API_CONFIG.baseUrl;
    const url = `${baseUrl}${API_CONFIG.apiPrefix}${endpoint}`;
    
    console.log(`📡 Ads API Request: ${options?.method || 'GET'} ${url}`);
    
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
      console.warn(`❌ Ads API request failed: ${response.status} ${response.statusText} for ${endpoint}`);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`⚠️ Ads API returned non-JSON response for ${endpoint}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Ads API Success for ${endpoint}:`, data);
    
    // Cache the result (only for GET requests)
    if (useCache && isGetRequest) {
      setToCache(cacheKey, data, ADS_CACHE_TTL);
      console.log(`💾 Cached ads data for: ${endpoint} (TTL: ${ADS_CACHE_TTL}ms)`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn(`⏱️ Ads API request timeout for ${endpoint}`);
      } else {
        console.warn(`❌ Ads API request failed for ${endpoint}:`, error.message);
      }
    }
    return null;
  }
}

export interface Ad {
  id: number;
  name: string;
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  type: 'manual_banner' | 'manual_text' | 'adsense' | 'adsera';
  width?: number;
  height?: number;
  alt_text?: string;
  open_new_tab: boolean;
  position: string;
  code?: string;
}

export interface AdsResponse {
  success: boolean;
  data: {
    header?: Ad[];
    sidebar_top?: Ad[];
    content_middle?: Ad[];
    footer?: Ad[];
    mobile_banner?: Ad[];
    between_posts?: Ad[];
  };
  message?: string;
}

export class AdsAPI {
  // Get all ads
  static async getAllAds(): Promise<Ad[]> {
    try {
      const response = await safeApiRequest<any>('/ads');
      
      if (!response || !response.success || !response.data) {
        return [];
      }
      
      // Flatten all ads from different positions
      const allAds: Ad[] = [];
      const data = response.data;
      
      // Iterate through all position keys
      Object.keys(data).forEach(position => {
        const positionAds = data[position];
        
        if (Array.isArray(positionAds)) {
          positionAds.forEach(ad => {
            if (ad && (ad.id || ad.id === 0)) {
              allAds.push(ad);
            }
          });
        }
      });
      
      return allAds;
    } catch (error) {
      console.error('Failed to fetch all ads:', error);
      return [];
    }
  }

  // Get ads by position
  static async getAdsByPosition(position: string): Promise<Ad[]> {
    try {
      // Map our position names to API position names
      const positionMapping: Record<string, string> = {
        'header': 'header',
        'sidebar': 'sidebar_top',
        'in-article': 'content_middle',
        'footer': 'footer',
        'mobile': 'mobile_banner',
        'between-posts': 'between_posts'
      };
      
      const apiPosition = positionMapping[position] || position;
      
      // Get all ads first (since API doesn't have position-specific endpoint)
      const response = await safeApiRequest<any>('/ads');
      
      if (!response || !response.success || !response.data) {
        return [];
      }
      
      // Get ads for specific position
      const positionAds = response.data[apiPosition];
      
      if (!Array.isArray(positionAds)) {
        return [];
      }
      
      return positionAds;
    } catch (error) {
      console.error(`Failed to fetch ads for position ${position}:`, error);
      return [];
    }
  }

  // Get active ads
  static async getActiveAds(): Promise<Ad[]> {
    try {
      // Since your API doesn't have separate active endpoint, get all ads
      const allAds = await this.getAllAds();
      
      // All ads from your API are considered active
      return allAds;
    } catch (error) {
      console.error('Failed to fetch active ads:', error);
      return [];
    }
  }

  // Track ad view
  static async trackView(adId: string): Promise<boolean> {
    try {
      const response = await safeApiRequest<any>(`/ads/${adId}/view`, {
        method: 'POST'
      }, false); // Don't cache POST requests
      return response?.success || false;
    } catch (error) {
      console.warn(`Failed to track view for ad ${adId}:`, error);
      return false;
    }
  }

  // Track ad click
  static async trackClick(adId: string): Promise<boolean> {
    try {
      const response = await safeApiRequest<any>(`/ads/${adId}/click`, {
        method: 'POST'
      }, false); // Don't cache POST requests
      return response?.success || false;
    } catch (error) {
      console.warn(`Failed to track click for ad ${adId}:`, error);
      return false;
    }
  }
}

// Helper function to check if ad is currently active
export function isAdActive(ad: Ad): boolean {
  // Since your API doesn't have is_active field, all ads are considered active
  return true;
}

// Helper function to filter active ads
export function filterActiveAds(ads: Ad[]): Ad[] {
  return ads; // All ads are active in your system
}