'use client';

import { PageContent, PageSection } from '@/types/global';
import Link from 'next/link';

// Safe HTML renderer to prevent XSS
const SafeHTMLRenderer = ({ html }: { html: string }) => {
  const sanitizeHTML = (htmlString: string) => {
    if (!htmlString) return '';
    
    // Remove dangerous scripts and attributes but keep basic HTML formatting
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

// Hero Section Component
const HeroSection = ({ title, subtitle, description, backgroundImage }: {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
}) => (
  <section className="relative pt-32 pb-24 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 overflow-hidden">
      {backgroundImage ? (
        <img 
          src={backgroundImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        </>
      )}
      {backgroundImage && <div className="absolute inset-0 bg-black/40"></div>}
    </div>
    
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4 ${
            backgroundImage ? 'text-white' : ''
          }`}>
            <span className={`inline-block ${
              backgroundImage 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent'
            }`}>
              {title}
            </span>
          </h1>
          
          {subtitle && (
            <h2 className={`text-2xl md:text-3xl font-semibold mb-6 ${
              backgroundImage ? 'text-blue-100' : 'text-gray-700'
            }`}>
              {subtitle}
            </h2>
          )}
          
          <div className="flex items-center justify-center mt-6 mb-8">
            <div className={`h-px bg-gradient-to-r from-transparent ${
              backgroundImage ? 'via-blue-300' : 'via-blue-300'
            } to-transparent w-32`}></div>
            <div className={`mx-4 w-2 h-2 ${
              backgroundImage ? 'bg-blue-300' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            } rounded-full`}></div>
            <div className={`h-px bg-gradient-to-r from-transparent ${
              backgroundImage ? 'via-indigo-300' : 'via-indigo-300'
            } to-transparent w-32`}></div>
          </div>
        </div>

        {description && (
          <div className="relative">
            <p className={`text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto font-light ${
              backgroundImage ? 'text-gray-100' : 'text-gray-600'
            }`}>
              {description}
            </p>
            
            <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 ${
              backgroundImage ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            } rounded-full opacity-30`}></div>
          </div>
        )}
      </div>
    </div>
  </section>
);

// Content Section Component
const ContentSection = ({ section }: { section: PageSection }) => {
  if (!section.isVisible) return null;

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'about':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'services':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'features':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'team':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {section.title && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-8">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(parseInt(section.id) || 0)} rounded-full blur-xl opacity-30`}></div>
                <div className={`relative inline-flex items-center px-8 py-4 bg-gradient-to-r ${getGradientColor(parseInt(section.id) || 0)} text-white text-sm font-bold rounded-full shadow-2xl border border-white/20`}>
                  <div className="w-2 h-2 bg-white/80 rounded-full mr-4 animate-pulse"></div>
                  {getSectionIcon(section.type)}
                  <span className="ml-3 text-base">{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
                  <div className="ml-4 w-1 h-1 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {section.title}
              </span>
            </h2>
            
            {section.content.description && (
              <div className="relative">
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {section.content.description}
                </p>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30"></div>
              </div>
            )}
          </div>
        )}

        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="p-10 sm:p-12 lg:p-16 xl:p-20">
            {/* Render different content types */}
            {section.content.html && (
              <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-8 prose-ol:my-8 prose-li:my-3 prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mb-6 prose-h3:text-2xl prose-h3:mb-4 prose-h4:text-xl prose-h4:mb-3">
                <SafeHTMLRenderer html={section.content.html} />
              </div>
            )}
            
            {section.content.text && (
              <div className="text-gray-700 leading-relaxed text-xl whitespace-pre-wrap">
                {section.content.text}
              </div>
            )}

            {/* Render lists if available */}
            {section.content.items && Array.isArray(section.content.items) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {section.content.items.map((item: any, index: number) => (
                  <div key={index} className="group flex items-start space-x-6 p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl hover:from-blue-50 hover:to-indigo-50/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-gray-100 hover:border-blue-200">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getGradientColor(index)} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {getSectionIcon(section.type)}
                    </div>
                    <div className="flex-1">
                      {item.title && (
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors duration-300">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
                      )}
                      {item.content && (
                        <div className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none">
                          <SafeHTMLRenderer html={item.content} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render CTA buttons if available */}
            {section.content.buttons && Array.isArray(section.content.buttons) && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                {section.content.buttons.map((button: any, index: number) => (
                  <Link
                    key={index}
                    href={button.href || '#'}
                    className={`group inline-flex items-center justify-center px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                      button.variant === 'primary' || index === 0
                        ? `bg-gradient-to-r ${getGradientColor(index)} text-white hover:opacity-90`
                        : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 bg-white'
                    }`}
                  >
                    <span>{button.text || button.label}</span>
                    {button.icon && (
                      <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Table of Contents Component
const TableOfContents = ({ sections }: { sections: PageSection[] }) => {
  const visibleSections = sections.filter(section => section.isVisible && section.title);
  
  // Don't show table of contents for privacy, terms, or about pages - keep it simple
  if (visibleSections.length === 0) return null;

  return (
    <div className="sticky top-8">
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-8 border border-gray-100 shadow-lg">
        <h4 className="text-xl font-black text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          Daftar Isi
        </h4>
        <nav className="space-y-3">
          {visibleSections.map((section, index) => (
            <a 
              key={section.id}
              href={`#section-${section.id}`}
              className="group block text-sm text-blue-600 hover:text-blue-700 py-3 px-4 border-l-3 border-transparent hover:border-blue-600 hover:bg-blue-50/50 rounded-r-xl transition-all duration-300 font-semibold"
            >
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mr-3 text-xs font-black text-blue-600 transition-colors duration-300">
                  {index + 1}
                </span>
                {section.title}
              </div>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Main Template Component
interface ApiPageTemplateProps {
  pageContent: PageContent;
}

const ApiPageTemplate = ({ pageContent }: ApiPageTemplateProps) => {
  const sections = pageContent.content.sections?.filter(section => section.isVisible) || [];
  const hasMultipleSections = sections.length > 1;
  const hasMainContent = pageContent.content.html || pageContent.content.text;
  
  // Check if this is a simple page (privacy, terms, about)
  const isSimplePage = pageContent.template === 'privacy' || 
                      pageContent.template === 'about' || 
                      pageContent.template === 'terms' ||
                      pageContent.slug.includes('privacy') ||
                      pageContent.slug.includes('terms') ||
                      pageContent.slug.includes('about');

  // Simple layout for privacy, terms, and about pages
  if (isSimplePage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
        </div>

        {/* Enhanced Header */}
        <section className="relative pt-32 pb-20">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
            <div className="text-center mb-16">
              {/* Badge */}
              <div className="inline-flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-30"></div>
                  <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-2xl border border-white/20">
                    <div className="w-2 h-2 bg-white/80 rounded-full mr-3 animate-pulse"></div>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Informasi Resmi</span>
                    <div className="ml-3 w-1 h-1 bg-white/60 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-8">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  {pageContent.title}
                </span>
              </h1>
              
              {/* Decorative Line */}
              <div className="flex items-center justify-center mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-32"></div>
                <div className="mx-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-32"></div>
              </div>

              {/* Description */}
              {pageContent.description && (
                <div className="relative">
                  <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto font-light text-gray-600">
                    {pageContent.description}
                  </p>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30"></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced Content Container */}
        <section className="relative pb-32">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
            {/* Main Content Card */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
              {/* Card Header Decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              {/* Content */}
              <div className="p-10 sm:p-12 lg:p-16 xl:p-20">
                {hasMainContent && (
                  <div className="relative">
                    {pageContent.content.html && (
                      <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-8 prose-ol:my-8 prose-li:my-3 prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h4:text-xl prose-h4:mb-3">
                        <SafeHTMLRenderer html={pageContent.content.html} />
                      </div>
                    )}
                    
                    {!pageContent.content.html && pageContent.content.text && (
                      <div className="text-gray-700 leading-relaxed text-xl whitespace-pre-wrap">
                        {pageContent.content.text}
                      </div>
                    )}
                  </div>
                )}

                {/* Render sections if available */}
                {sections.length > 0 && (
                  <div className="space-y-16 mt-12">
                    {sections.map((section) => (
                      <div key={section.id} className="relative">
                        <ContentSection section={section} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Enhanced Bottom Navigation */}
        <section className="relative py-16 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t border-gray-200/50">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
              <Link
                href="/"
                className="group inline-flex items-center bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
              >
                <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali ke Home</span>
              </Link>
              
              <Link
                href="/contact"
                className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Hubungi Kami</span>
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center text-sm text-gray-500 bg-white/80 px-6 py-3 rounded-full shadow-sm border border-gray-200/50">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Informasi ini selalu diperbarui untuk memberikan transparansi penuh</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Complex layout for other pages
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <HeroSection
        title={pageContent.content.hero?.title || pageContent.title}
        subtitle={pageContent.content.hero?.subtitle}
        description={pageContent.content.hero?.description || pageContent.description}
        backgroundImage={pageContent.content.hero?.backgroundImage}
      />

      {/* Main Content - Show if there's HTML/text content from API */}
      {hasMainContent && (
        <section className="relative py-24">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <div className="p-10 sm:p-12 lg:p-16 xl:p-20">
                {pageContent.content.html && (
                  <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-8 prose-ol:my-8 prose-li:my-3 prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mb-6 prose-h3:text-2xl prose-h3:mb-4 prose-h4:text-xl prose-h4:mb-3">
                    <SafeHTMLRenderer html={pageContent.content.html} />
                  </div>
                )}
                
                {!pageContent.content.html && pageContent.content.text && (
                  <div className="text-gray-700 leading-relaxed text-xl whitespace-pre-wrap">
                    {pageContent.content.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sections Content */}
      {sections.length > 0 && (
        <section className="relative py-24">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
            <div className={`grid grid-cols-1 ${hasMultipleSections ? 'lg:grid-cols-4' : ''} gap-12`}>
              
              {/* Table of Contents - Only show if multiple sections */}
              {hasMultipleSections && (
                <div className="lg:col-span-1">
                  <TableOfContents sections={sections} />
                </div>
              )}

              {/* Content Sections */}
              <div className={hasMultipleSections ? 'lg:col-span-3' : ''}>
                <div className="space-y-16">
                  {sections.map((section, index) => (
                    <div key={section.id} id={`section-${section.id}`}>
                      <ContentSection section={section} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Bottom Navigation */}
      <section className="relative py-16 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t border-gray-200/50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
            <Link
              href="/"
              className="group inline-flex items-center bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
            >
              <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali ke Home</span>
            </Link>
            
            <Link
              href="/contact"
              className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Hubungi Kami</span>
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiPageTemplate;