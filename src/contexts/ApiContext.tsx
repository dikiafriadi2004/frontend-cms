'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  MenuItem, 
  SiteSettings, 
  PageContent,
  ApiBlogPost 
} from '@/types/global';
import { 
  fetchMenuCached, 
  fetchSiteSettingsCached, 
  fetchPageContent,
  fetchBlogPosts,
  clearAllCaches
} from '@/lib/api';
import { SettingsAPI } from '@/lib/cms-adapter';

interface ApiContextType {
  // Menu
  menu: MenuItem[];
  menuLoading: boolean;
  
  // Settings
  settings: SiteSettings | null;
  settingsLoading: boolean;
  seoSettings: any;
  socialSettings: any;
  companySettings: any;
  adsSettings: any;
  analyticsSettings: any;
  
  // Pages
  pages: Record<string, PageContent>;
  pageLoading: Record<string, boolean>;
  
  // Blog
  blogPosts: ApiBlogPost[];
  blogLoading: boolean;
  
  // Functions
  loadPage: (slug: string) => Promise<PageContent | null>;
  loadBlogPosts: (page?: number, limit?: number) => Promise<void>;
  refreshMenu: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  clearCaches: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  // Menu state
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  
  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<any>(null);
  const [socialSettings, setSocialSettings] = useState<any>(null);
  const [companySettings, setCompanySettings] = useState<any>(null);
  const [adsSettings, setAdsSettings] = useState<any>(null);
  const [analyticsSettings, setAnalyticsSettings] = useState<any>(null);
  
  // Pages state
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  const [pageLoading, setPageLoading] = useState<Record<string, boolean>>({});
  
  // Blog state
  const [blogPosts, setBlogPosts] = useState<ApiBlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);

  // Load menu
  const loadMenu = async () => {
    try {
      setMenuLoading(true);
      const response = await fetchMenuCached();
      
      if (response.success && response.data.length > 0) {
        // Sort menu by order
        const sortedMenu = response.data.sort((a, b) => a.order - b.order);
        setMenu(sortedMenu.filter(item => item.isActive));
        console.log('✅ Menu loaded successfully:', sortedMenu.length, 'items');
      } else {
        console.warn('⚠️ Menu API returned empty or failed, using fallback');
        // Use fallback menu even if API call was "successful" but returned no data
        setMenu(response.data || []);
      }
    } catch (error) {
      console.error('❌ Failed to load menu:', error);
      // Set empty menu, let the fallback data from API handle it
      setMenu([]);
    } finally {
      setMenuLoading(false);
    }
  };

  // Load settings
  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      
      // Load all settings in parallel with error handling
      const [
        generalResponse,
        seoResponse,
        socialResponse,
        companyResponse,
        adsResponse,
        analyticsResponse
      ] = await Promise.allSettled([
        fetchSiteSettingsCached(),
        SettingsAPI.getSeo(),
        SettingsAPI.getSocial(),
        SettingsAPI.getCompany(),
        SettingsAPI.getAds(),
        SettingsAPI.getAnalytics()
      ]);

      // Handle general settings
      if (generalResponse.status === 'fulfilled' && generalResponse.value.success) {
        const companyData = companyResponse.status === 'fulfilled' ? companyResponse.value : {};
        
        // Merge company settings into general settings for CTA fields
        const mergedSettings = {
          ...generalResponse.value.data,
          // Override with company settings for CTA fields if they exist
          ...(companyData && {
            cta_title: companyData.cta_title || generalResponse.value.data.cta_title,
            cta_subtitle: companyData.cta_subtitle || generalResponse.value.data.cta_subtitle,
            cta_description: companyData.cta_description || generalResponse.value.data.cta_description,
            cta_button_text: companyData.cta_button_text || generalResponse.value.data.cta_button_text,
            cta_button_url: companyData.cta_button_url || generalResponse.value.data.cta_button_url
          })
        };
        
        setSettings(mergedSettings);
        
        // Apply dynamic colors to CSS variables
        if (generalResponse.value.data.colors) {
          const root = document.documentElement;
          root.style.setProperty('--color-primary', generalResponse.value.data.colors.primary);
          root.style.setProperty('--color-secondary', generalResponse.value.data.colors.secondary);
          root.style.setProperty('--color-accent', generalResponse.value.data.colors.accent);
        }
      }

      // Set other settings with error handling
      setSeoSettings(seoResponse.status === 'fulfilled' ? seoResponse.value : {});
      setSocialSettings(socialResponse.status === 'fulfilled' ? socialResponse.value : {});
      setCompanySettings(companyResponse.status === 'fulfilled' ? companyResponse.value : {});
      setAdsSettings(adsResponse.status === 'fulfilled' ? adsResponse.value : {});
      setAnalyticsSettings(analyticsResponse.status === 'fulfilled' ? analyticsResponse.value : {});

    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Load page content
  const loadPage = async (slug: string): Promise<PageContent | null> => {
    if (pages[slug]) {
      return pages[slug];
    }

    try {
      setPageLoading(prev => ({ ...prev, [slug]: true }));
      const pageContent = await fetchPageContent(slug);
      
      if (pageContent) {
        setPages(prev => ({ ...prev, [slug]: pageContent }));
        return pageContent;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to load page ${slug}:`, error);
      return null;
    } finally {
      setPageLoading(prev => ({ ...prev, [slug]: false }));
    }
  };

  // Load blog posts
  const loadBlogPosts = async (page: number = 1, limit: number = 10) => {
    try {
      setBlogLoading(true);
      const response = await fetchBlogPosts(page, limit);
      if (response.success) {
        setBlogPosts(response.data);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setBlogLoading(false);
    }
  };

  // Refresh functions
  const refreshMenu = async () => {
    await loadMenu();
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  const clearCaches = () => {
    clearAllCaches();
    // Force reload data after clearing cache
    loadMenu();
    loadSettings();
  };

  // Initial load
  useEffect(() => {
    loadMenu();
    loadSettings();
  }, []);

  const value: ApiContextType = {
    menu,
    menuLoading,
    settings,
    settingsLoading,
    seoSettings,
    socialSettings,
    companySettings,
    adsSettings,
    analyticsSettings,
    pages,
    pageLoading,
    blogPosts,
    blogLoading,
    loadPage,
    loadBlogPosts,
    refreshMenu,
    refreshSettings,
    clearCaches,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}

// Custom hooks for specific data
export function useMenu() {
  const { menu, menuLoading, refreshMenu } = useApi();
  return { menu, menuLoading, refreshMenu };
}

export function useSettings() {
  const { 
    settings, 
    settingsLoading, 
    refreshSettings, 
    seoSettings, 
    socialSettings, 
    companySettings, 
    adsSettings, 
    analyticsSettings 
  } = useApi();
  return { 
    settings, 
    settingsLoading, 
    refreshSettings, 
    seoSettings, 
    socialSettings, 
    companySettings, 
    adsSettings, 
    analyticsSettings 
  };
}

export function usePage(slug: string) {
  const { pageLoading, loadPage } = useApi();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const pageData = await loadPage(slug);
        setPage(pageData);
      } catch (error) {
        console.error(`Error loading page ${slug}:`, error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [slug]); // Removed loadPage from dependencies to prevent infinite loops

  return { 
    page, 
    loading: loading || pageLoading[slug] || false 
  };
}

export function useBlog() {
  const { blogPosts, blogLoading, loadBlogPosts } = useApi();
  return { blogPosts, blogLoading, loadBlogPosts };
}