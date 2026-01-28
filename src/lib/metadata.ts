import { Metadata } from 'next';
import { fetchSiteSettings } from '@/lib/api';
import { getSiteFavicon, getSiteName, getSiteDescription, getMetaKeywords } from '@/lib/settings-helper';

// Generate dynamic metadata for pages
export async function generateMetadata(
  pageTitle?: string,
  pageDescription?: string,
  pageType: 'home' | 'blog' | 'page' | 'post' = 'page'
): Promise<Metadata> {
  try {
    const settingsResponse = await fetchSiteSettings();
    const settings = settingsResponse.data;
    
    const siteName = getSiteName(settings);
    const siteDescription = getSiteDescription(settings);
    
    // Generate favicon URL from API
    const faviconUrl = getSiteFavicon(settings);
    const fullFaviconUrl = faviconUrl.startsWith('http') 
      ? faviconUrl 
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${faviconUrl.replace(/^\//, '')}`;
    
    // Generate Open Graph image from API (use logo)
    const ogImage = settings.logo;
    const fullOgImageUrl = ogImage 
      ? (ogImage.startsWith('http') 
          ? ogImage 
          : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${ogImage.replace(/^\//, '')}`)
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.jpg`;
    
    // Generate title based on page type
    let title: string;
    if (pageType === 'home') {
      title = `${siteName} - ${siteDescription}`;
    } else if (pageTitle) {
      title = `${siteName} - ${pageTitle}`;
    } else {
      title = `${siteName} - ${siteDescription}`;
    }
    
    // Generate description
    const description = pageDescription || siteDescription;
    
    // Generate keywords
    const keywords = getMetaKeywords(settings?.seo, settings);
    
    return {
      title,
      description,
      keywords: Array.isArray(keywords) && keywords.length > 0 ? keywords.join(', ') : '',
      authors: [{ name: `${siteName} Team` }],
      icons: {
        icon: fullFaviconUrl,
        shortcut: fullFaviconUrl,
        apple: fullFaviconUrl,
      },
      openGraph: {
        title,
        description,
        siteName,
        type: 'website',
        locale: 'id_ID',
        images: [fullOgImageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [fullOgImageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    
    // Fallback metadata - still use API if possible
    const siteName = 'Website';
    const siteDescription = 'Website Description';
    
    let title: string;
    if (pageType === 'home') {
      title = `${siteName} - ${siteDescription}`;
    } else if (pageTitle) {
      title = `${siteName} - ${pageTitle}`;
    } else {
      title = `${siteName} - ${siteDescription}`;
    }
    
    return {
      title,
      description: pageDescription || siteDescription,
      keywords: '',
      authors: [{ name: `${siteName} Team` }],
      openGraph: {
        title,
        description: pageDescription || siteDescription,
        siteName,
        type: 'website',
        locale: 'id_ID',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: pageDescription || siteDescription,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

// Generate metadata for blog posts
export async function generateBlogPostMetadata(
  postTitle: string,
  postDescription?: string
): Promise<Metadata> {
  try {
    const settingsResponse = await fetchSiteSettings();
    const settings = settingsResponse.data;
    
    const siteName = getSiteName(settings);
    const title = `${siteName} - ${postTitle}`;
    const description = postDescription || `Baca artikel ${postTitle} di ${siteName}`;
    
    // Generate favicon URL from API
    const faviconUrl = getSiteFavicon(settings);
    const fullFaviconUrl = faviconUrl.startsWith('http') 
      ? faviconUrl 
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${faviconUrl.replace(/^\//, '')}`;
    
    // Generate Open Graph image from API (use logo)
    const ogImage = settings.logo;
    const fullOgImageUrl = ogImage 
      ? (ogImage.startsWith('http') 
          ? ogImage 
          : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${ogImage.replace(/^\//, '')}`)
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.jpg`;
    
    return {
      title,
      description,
      keywords: getMetaKeywords(settings?.seo, settings).join(', ') || '',
      authors: [{ name: `${siteName} Team` }],
      icons: {
        icon: fullFaviconUrl,
        shortcut: fullFaviconUrl,
        apple: fullFaviconUrl,
      },
      openGraph: {
        title,
        description,
        siteName,
        type: 'article',
        locale: 'id_ID',
        images: [fullOgImageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [fullOgImageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Failed to generate blog post metadata:', error);
    
    // Fallback without hardcoded values - minimal metadata
    const title = postTitle;
    const description = postDescription || 'Artikel blog';
    
    return {
      title,
      description,
      keywords: '',
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

// Generate metadata for blog listing page
export async function generateBlogListingMetadata(): Promise<Metadata> {
  return generateMetadata('Blog', 'Artikel dan tutorial terbaru', 'blog');
}

// Generate metadata for contact page
export async function generateContactMetadata(): Promise<Metadata> {
  try {
    const settingsResponse = await fetchSiteSettings();
    const settings = settingsResponse.data;
    const siteName = getSiteName(settings);
    return generateMetadata('Hubungi Kami', `Hubungi tim ${siteName} untuk konsultasi dan dukungan teknis`, 'page');
  } catch (error) {
    return generateMetadata('Hubungi Kami', 'Hubungi kami untuk konsultasi dan dukungan teknis', 'page');
  }
}

// Generate metadata for privacy page
export async function generatePrivacyMetadata(): Promise<Metadata> {
  try {
    const settingsResponse = await fetchSiteSettings();
    const settings = settingsResponse.data;
    const siteName = getSiteName(settings);
    return generateMetadata('Kebijakan Privasi', `Kebijakan privasi ${siteName} mengenai pengumpulan, penggunaan, dan perlindungan data pribadi pengguna`, 'page');
  } catch (error) {
    return generateMetadata('Kebijakan Privasi', 'Kebijakan privasi mengenai pengumpulan, penggunaan, dan perlindungan data pribadi pengguna', 'page');
  }
}

// Generate metadata for home page
export async function generateHomeMetadata(): Promise<Metadata> {
  return generateMetadata(undefined, undefined, 'home');
}