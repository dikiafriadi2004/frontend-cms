import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPageContent, fetchSiteSettings } from '@/lib/api';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';
import FallbackPageRenderer from '@/components/FallbackPageRenderer';

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate metadata dynamically from API
export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug.join('/');
  
  // Skip if it's a known static route
  const staticRoutes = ['contact', 'privacy', 'blog', 'api-status'];
  if (staticRoutes.includes(pageSlug) || staticRoutes.some(route => pageSlug.startsWith(route + '/'))) {
    return {};
  }
  
  try {
    // Get site settings for site_name
    const [pageContent, settingsResponse] = await Promise.all([
      fetchPageContent(pageSlug),
      fetchSiteSettings()
    ]);
    
    const siteName = settingsResponse.data?.siteName || settingsResponse.data?.site_name || 'Website';

    if (!pageContent) {
      const fallbackTitle = pageSlug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Halaman';
      return {
        title: `${siteName} - ${fallbackTitle}`,
        description: 'Halaman ini sedang dalam pengembangan dan akan segera tersedia.',
      };
    }

    const pageTitle = pageContent.content?.meta?.title || pageContent.title || 'Halaman';
    const pageDescription = pageContent.content?.meta?.description || pageContent.description || `Halaman ${pageTitle} di ${siteName}`;

    return {
      title: `${siteName} - ${pageTitle}`,
      description: pageDescription,
      keywords: pageContent.content?.meta?.keywords || [],
      authors: [{ name: `${siteName} Team` }],
      openGraph: {
        title: `${siteName} - ${pageTitle}`,
        description: pageDescription,
        siteName,
        images: pageContent.content?.meta?.ogImage ? [pageContent.content.meta.ogImage] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${siteName} - ${pageTitle}`,
        description: pageDescription,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for ${pageSlug}:`, error);
    const fallbackTitle = pageSlug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Halaman';
    return {
      title: fallbackTitle,
      description: 'Halaman ini sedang dalam pengembangan dan akan segera tersedia.',
    };
  }
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const pageSlug = slug.join('/');
  
  // Skip if it's a known static route - let Next.js handle them
  const staticRoutes = ['contact', 'privacy', 'blog', 'api-status'];
  if (staticRoutes.includes(pageSlug) || staticRoutes.some(route => pageSlug.startsWith(route + '/'))) {
    notFound();
  }
  
  try {
    const pageContent = await fetchPageContent(pageSlug);

    // If no content from API, show fallback page instead of 404
    if (!pageContent) {
      console.log(`Page content not found for slug: ${pageSlug}, showing fallback page`);
      return <FallbackPageRenderer slug={pageSlug} />;
    }

    // Check if page is active (default to true if property doesn't exist)
    const isActive = pageContent.hasOwnProperty('isActive') ? pageContent.isActive : true;
    if (!isActive) {
      console.log(`Page is not active for slug: ${pageSlug}, showing fallback page`);
      return <FallbackPageRenderer slug={pageSlug} title={pageContent.title} />;
    }

    // Ensure pageContent has required properties
    const validatedPageContent = {
      id: pageContent.id || Math.random().toString(),
      slug: pageContent.slug || pageSlug,
      title: pageContent.title || 'Untitled Page',
      description: pageContent.description || '',
      template: pageContent.template || 'custom',
      content: pageContent.content || { sections: [] },
      isActive: isActive,
      createdAt: pageContent.createdAt || new Date().toISOString(),
      updatedAt: pageContent.updatedAt || new Date().toISOString(),
    };

    return <DynamicPageRenderer pageContent={validatedPageContent} />;
  } catch (error) {
    console.error(`Error loading page ${pageSlug}:`, error);
    // Show fallback page instead of 404 for better UX
    return <FallbackPageRenderer slug={pageSlug} />;
  }
}

// Optional: Generate static params for known pages
export async function generateStaticParams() {
  try {
    // You can fetch all pages from API here
    // const pages = await fetchAllPages();
    // return pages.map((page) => ({ slug: page.slug.split('/') }));
    
    // For now, return empty array to enable ISR
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}