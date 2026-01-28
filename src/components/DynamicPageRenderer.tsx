'use client';

import { PageContent, PageSection } from '@/types/global';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import FAQSection from '@/components/home/FAQSection';
import BlogSection from '@/components/home/BlogSection';
import CTASection from '@/components/home/CTASection';
import ApiPageTemplate from '@/components/templates/ApiPageTemplate';

// Safe HTML renderer to prevent XSS
const SafeHTMLRenderer = ({ html }: { html: string }) => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  const sanitizeHTML = (htmlString: string) => {
    if (!htmlString) return '';
    
    return htmlString
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '');
  };

  const sanitizedHTML = sanitizeHTML(html || '');
  
  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-3xl prose-h2:mb-4 prose-h3:text-2xl prose-h3:mb-3 prose-h4:text-xl prose-h4:mb-2"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

interface DynamicPageRendererProps {
  pageContent: PageContent;
}

const DynamicPageRenderer = ({ pageContent }: DynamicPageRendererProps) => {
  // Determine which template to use based on slug or content
  const getTemplateBySlug = (slug: string) => {
    if (slug.includes('about') || slug.includes('tentang')) {
      return 'about';
    }
    if (slug.includes('terms') || slug.includes('syarat') || slug.includes('ketentuan') || 
        slug.includes('privacy') || slug.includes('privasi')) {
      return 'terms';
    }
    return 'default';
  };

  const templateType = pageContent.template === 'custom' 
    ? getTemplateBySlug(pageContent.slug) 
    : pageContent.template;

  const renderSection = (section: PageSection) => {
    if (!section.isVisible) return null;

    switch (section.type) {
      case 'hero':
        return (
          <div key={section.id}>
            <HeroSection />
          </div>
        );
      
      case 'features':
        return (
          <div key={section.id}>
            <FeaturesSection />
          </div>
        );
      
      case 'testimonials':
        return (
          <TestimonialSection key={section.id} />
        );
      
      case 'faq':
        return (
          <FAQSection key={section.id} />
        );
      
      case 'blog':
        return (
          <BlogSection key={section.id} />
        );
      
      case 'cta':
        return (
          <div key={section.id}>
            <CTASection />
          </div>
        );
      
      case 'contact':
        return (
          <div key={section.id} className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {section.title || 'Hubungi Kami'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {section.content.description}
                </p>
              </div>
              {/* Add contact form or content here */}
            </div>
          </div>
        );
      
      case 'custom':
        return (
          <div key={section.id} className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.title && (
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                </div>
              )}
              <SafeHTMLRenderer html={section.content.html || ''} />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Template-based rendering
  switch (templateType) {
    case 'home':
      return (
        <div className="min-h-screen">
          {pageContent.content.sections
            ?.sort((a, b) => a.order - b.order)
            .map(renderSection)}
        </div>
      );
    
    case 'blog':
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <div className="pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                  {pageContent.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {pageContent.description}
                </p>
              </div>
              {/* Blog content will be rendered here */}
            </div>
          </div>
        </div>
      );
    
    case 'contact':
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <div className="pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                  {pageContent.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {pageContent.description}
                </p>
              </div>
              {pageContent.content.sections
                ?.sort((a, b) => a.order - b.order)
                .map(renderSection)}
            </div>
          </div>
        </div>
      );
    
    case 'privacy':
      // Use ApiPageTemplate for privacy policy
      return <ApiPageTemplate pageContent={pageContent} />;
    
    case 'about':
      // Use ApiPageTemplate for about page
      return <ApiPageTemplate pageContent={pageContent} />;
    
    case 'terms':
      // Use ApiPageTemplate for terms page
      return <ApiPageTemplate pageContent={pageContent} />;
    
    case 'default':
    default:
      // Use the general ApiPageTemplate for better rendering
      return <ApiPageTemplate pageContent={pageContent} />;
  }
};

export default DynamicPageRenderer;