import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPageContent } from '@/lib/api';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically from API
export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageContent = await fetchPageContent(slug);

  if (!pageContent) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: pageContent.content.meta?.title || pageContent.title,
    description: pageContent.content.meta?.description || pageContent.description,
    keywords: pageContent.content.meta?.keywords || [],
    openGraph: {
      title: pageContent.content.meta?.title || pageContent.title,
      description: pageContent.content.meta?.description || pageContent.description,
      images: pageContent.content.meta?.ogImage ? [pageContent.content.meta.ogImage] : [],
    },
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const pageContent = await fetchPageContent(slug);

  if (!pageContent || !pageContent.isActive) {
    notFound();
  }

  return <DynamicPageRenderer pageContent={pageContent} />;
}

// Optional: Generate static params for known pages
export async function generateStaticParams() {
  try {
    // You can fetch all pages from API here
    // const pages = await fetchAllPages();
    // return pages.map((page) => ({ slug: page.slug }));
    
    // For now, return empty array to enable ISR
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}