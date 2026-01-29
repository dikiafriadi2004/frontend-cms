import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogPost, fetchLatestPosts } from '@/lib/api';
import { generateBlogPostMetadata } from '@/lib/metadata';
import HeaderAd from '@/components/ads/HeaderAd';
import InArticleAd from '@/components/ads/InArticleAd';
import SidebarAd from '@/components/ads/SidebarAd';
import BlogImage from '@/components/BlogImage';
import BlogContent from '@/components/BlogContent';
import BlogPostTracker from '@/components/analytics/BlogPostTracker';
import SocialShareButtons from '@/components/blog/SocialShareButtons';
import { trackBlogPostView } from '@/lib/analytics';

// Helper function to extract plain text from HTML
const extractTextFromHTML = (html: string, maxLength: number = 150): string => {
  if (!html) return '';
  
  // Remove HTML tags and decode HTML entities
  const textContent = html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
};

// Helper function to sanitize HTML content and fix image URLs
const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  let processedHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '');
  
  // CRITICAL FIX: Fix broken image tags like <imgsrc= to <img src=
  processedHtml = processedHtml.replace(/<imgsrc=/gi, '<img src=');
  processedHtml = processedHtml.replace(/<img([^>]*?)src=/gi, '<img $1 src=');
  
  // Fix image URLs - replace localhost:8000 with the API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000';
  processedHtml = processedHtml.replace(/http:\/\/localhost:8000/gi, apiBaseUrl);
  
  // Clean up and standardize image tags
  processedHtml = processedHtml.replace(/<img([^>]*)>/gi, (match, attrs) => {
    let cleanAttrs = attrs.trim();
    
    // Ensure there's a space before src if missing
    cleanAttrs = cleanAttrs.replace(/([^"\s])src=/gi, '$1 src=');
    
    // Extract important style attributes
    const styleMatch = cleanAttrs.match(/style=["']([^"']*)["']/i);
    let preservedStyles = '';
    
    if (styleMatch) {
      const styles = styleMatch[1];
      
      // Preserve float and display styles, remove others
      const floatMatch = styles.match(/float:\s*([^;]+)/i);
      const displayMatch = styles.match(/display:\s*([^;]+)/i);
      
      const preservedStylesArray = [];
      if (floatMatch) preservedStylesArray.push(`float: ${floatMatch[1].trim()}`);
      if (displayMatch) preservedStylesArray.push(`display: ${displayMatch[1].trim()}`);
      
      if (preservedStylesArray.length > 0) {
        preservedStyles = ` style="${preservedStylesArray.join('; ')}"`;
      }
      
      // Remove the original style attribute
      cleanAttrs = cleanAttrs.replace(/\s*style=["'][^"']*["']/gi, '');
    }
    
    // Check if alt attribute exists
    const hasAlt = /alt\s*=/.test(cleanAttrs);
    const altAttr = hasAlt ? '' : ' alt=""';
    
    // Check if src exists
    const hasSrc = /src\s*=/.test(cleanAttrs);
    if (!hasSrc) {
      return match;
    }
    
    const result = `<img${cleanAttrs}${altAttr}${preservedStyles} loading="lazy" class="blog-content-image">`;
    return result;
  });
  
  return processedHtml;
};

// Helper function to insert ads at natural break points in HTML content
const insertInArticleAd = (content: string): string => {
  if (!content || !content.includes('<')) return content;
  
  // Find a good place to insert the ad (after 2nd or 3rd paragraph)
  const paragraphs = content.split('</p>');
  if (paragraphs.length >= 3) {
    // Insert ad after 2nd paragraph
    const beforeAd = paragraphs.slice(0, 2).join('</p>') + '</p>';
    const afterAd = paragraphs.slice(2).join('</p>');
    return beforeAd + '<!-- IN_ARTICLE_AD_PLACEHOLDER -->' + afterAd;
  }
  
  // If not enough paragraphs, insert at 40% of content
  const insertPoint = Math.floor(content.length * 0.4);
  return content.substring(0, insertPoint) + '<!-- IN_ARTICLE_AD_PLACEHOLDER -->' + content.substring(insertPoint);
};

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    // For now, we'll return empty array to let Next.js handle dynamic generation
    // In production, you might want to fetch actual post slugs from API
    // const posts = await fetchBlogPosts(1, 100); // Get first 100 posts
    // return posts.data.map(post => ({ slug: post.slug }));
    
    return [];
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  try {
    const post = await fetchBlogPost(slug);
    
    if (!post) {
      return await generateBlogPostMetadata('Artikel Tidak Ditemukan', 'Artikel yang Anda cari tidak ditemukan atau telah dihapus.');
    }

    return await generateBlogPostMetadata(
      post.title, 
      extractTextFromHTML(post.content, 160)
    );
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return await generateBlogPostMetadata('Artikel Tidak Ditemukan', 'Artikel yang Anda cari tidak ditemukan atau telah dihapus.');
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  try {
    const [post, relatedPosts] = await Promise.all([
      fetchBlogPost(slug),
      fetchLatestPosts(3)
    ]);

    if (!post) {
      notFound();
    }

    // Validate post data and provide fallbacks
    const validatedPost = {
      ...post,
      title: post.title || 'Untitled Article',
      content: post.content || 'Content not available.',
      author: {
        name: post.author?.name || 'Anonymous',
        avatar: post.author?.avatar || null
      },
      category: post.category || 'Uncategorized',
      tags: Array.isArray(post.tags) ? post.tags : [],
      publishedAt: post.publishedAt || new Date().toISOString(),
      readTime: post.readTime || '5 min read',
      featuredImage: post.featuredImage || null
    };

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'Invalid Date';
      }
    };

    // Filter out current post from related posts
    const filteredRelatedPosts = relatedPosts.filter(p => p.id !== validatedPost.id);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Analytics Tracking */}
        <BlogPostTracker 
          postTitle={validatedPost.title}
          postCategory={validatedPost.category}
          postSlug={slug}
        />

        {/* Header Ad */}
        <HeaderAd />

        {/* Breadcrumb */}
        <section className="bg-white py-6 border-b border-gray-200 mt-20">
          <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <nav>
              <ol className="flex items-center space-x-3 text-sm">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href="/blog" className="text-gray-500 hover:text-blue-600 transition-colors">Blog</Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium truncate">{validatedPost.title}</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Main Article Content */}
              <div className="lg:col-span-3">
                
                {/* Article Header Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden mb-8 transform hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
                  {/* Header Background with Gradient Overlay */}
                  <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 px-8 pt-8 pb-6">
                    {/* Category Badge with Enhanced Design */}
                    <div className="relative z-10 mb-6">
                      <div className="inline-flex items-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-md opacity-50"></div>
                          <div className="relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg border border-white/20">
                            <div className="w-2 h-2 bg-white/80 rounded-full mr-2 animate-pulse"></div>
                            {validatedPost.category}
                            <div className="ml-2 w-1 h-1 bg-white/60 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title with Better Typography */}
                    <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
                      <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        {validatedPost.title}
                      </span>
                    </h1>
                    
                    {/* Enhanced Meta Information */}
                    <div className="relative z-10 flex flex-wrap items-center gap-6 text-gray-600">
                      {/* Author */}
                      <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-sm border border-white/40">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            {validatedPost.author.avatar ? (
                              <img 
                                src={validatedPost.author.avatar.replace(/http:\/\/localhost:8000/gi, process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000')} 
                                alt={validatedPost.author.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{validatedPost.author.name}</div>
                          <div className="text-xs text-gray-500">Author</div>
                        </div>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-sm border border-white/40">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{formatDate(validatedPost.publishedAt)}</div>
                          <div className="text-xs text-gray-500">Published</div>
                        </div>
                      </div>
                      
                      {/* Read Time */}
                      {validatedPost.readTime && (
                        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-sm border border-white/40">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{validatedPost.readTime}</div>
                            <div className="text-xs text-gray-500">Read time</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Featured Image */}
                  <div className="relative mx-8 mb-8">
                    <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500 group">
                      {validatedPost.featuredImage ? (
                        <img 
                          src={validatedPost.featuredImage.replace(/http:\/\/localhost:8000/gi, process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000')} 
                          alt={validatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          {/* Content Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-center justify-center">
                            <div className="text-center text-white transform group-hover:scale-105 transition-transform duration-300">
                              {/* Main Icon with Glow Effect */}
                              <div className="relative mb-4">
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                                <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Article Content Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                  <div className="prose prose-lg max-w-none">
                    {/* Render content with images in original positions */}
                    {validatedPost.content && validatedPost.content.includes('<') ? (
                      <div className="blog-content">
                        {(() => {
                          // Sanitize HTML and fix image URLs, but keep images in place
                          let sanitizedContent = sanitizeHTML(validatedPost.content);
                          
                          // Additional fixes for common HTML issues
                          sanitizedContent = sanitizedContent
                            // Fix missing spaces in attributes
                            .replace(/([^"\s])src=/gi, '$1 src=')
                            .replace(/([^"\s])alt=/gi, '$1 alt=')
                            .replace(/([^"\s])class=/gi, '$1 class=')
                            // Fix broken image tags more aggressively
                            .replace(/<img([^>]*?)([^"\s])src=/gi, '<img$1$2 src=')
                            // Ensure proper spacing around attributes
                            .replace(/\s+/g, ' ')
                            .replace(/\s>/g, '>');
                          
                          const contentWithAdPlaceholder = insertInArticleAd(sanitizedContent);
                          const parts = contentWithAdPlaceholder.split('<!-- IN_ARTICLE_AD_PLACEHOLDER -->');
                          
                          return (
                            <>
                              {/* First part of content */}
                              {parts[0] && (
                                <BlogContent 
                                  content={parts[0]}
                                  className="blog-content-section"
                                />
                              )}
                              
                              {/* In-Article Ad */}
                              {parts.length > 1 && (
                                <div className="my-8">
                                  <InArticleAd />
                                </div>
                              )}
                              
                              {/* Remaining content */}
                              {parts[1] && (
                                <BlogContent 
                                  content={parts[1]}
                                  className="blog-content-section"
                                />
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="blog-content">
                        {/* Handle plain text content */}
                        {validatedPost.content ? (
                          <>
                            {/* First part of content */}
                            <div className="whitespace-pre-wrap blog-paragraph">
                              {validatedPost.content.substring(0, Math.floor(validatedPost.content.length * 0.4))}
                            </div>
                            
                            {/* In-Article Ad */}
                            <div className="my-8">
                              <InArticleAd />
                            </div>
                            
                            {/* Remaining content */}
                            <div className="whitespace-pre-wrap blog-paragraph">
                              {validatedPost.content.substring(Math.floor(validatedPost.content.length * 0.4))}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-500 italic">
                            Konten artikel tidak tersedia.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {validatedPost.tags && validatedPost.tags.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {validatedPost.tags.map((tag: any, index: number) => {
                          // Handle both string tags and object tags
                          const tagName = typeof tag === 'string' ? tag : (tag?.name || tag?.slug || 'Tag');
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              #{tagName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Social Share */}
                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Bagikan Artikel</h3>
                      <SocialShareButtons title={validatedPost.title} />
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke Blog
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  
                  {/* Sidebar Ad */}
                  <SidebarAd />
                  
                  {/* Related Posts */}
                  {filteredRelatedPosts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:shadow-xl transition-all duration-300">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        Artikel Terkait
                      </h3>
                      
                      <div className="space-y-4">
                        {filteredRelatedPosts.slice(0, 3).map((relatedPost, index) => (
                          <article key={relatedPost.id} className="group p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] border border-transparent hover:border-gray-200 hover:shadow-md">
                            <Link href={`/blog/${relatedPost.slug}`} className="block">
                              <div className="flex space-x-4">
                                {/* Enhanced Thumbnail */}
                                <div className="relative w-20 h-20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                  {relatedPost.featuredImage ? (
                                    <img 
                                      src={relatedPost.featuredImage.replace(/http:\/\/localhost:8000/gi, process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000')} 
                                      alt={relatedPost.title}
                                      className="w-full h-full object-cover rounded-xl shadow-lg"
                                    />
                                  ) : (
                                    <div className={`absolute inset-0 rounded-xl overflow-hidden shadow-lg ${
                                      index === 0 ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700' :
                                      index === 1 ? 'bg-gradient-to-br from-green-500 via-teal-600 to-blue-700' :
                                      'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700'
                                    }`}>
                                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                        <div className="text-center text-white">
                                          <div className="relative z-10 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="inline-flex items-center px-3 py-1 text-white text-xs font-semibold rounded-full mb-2 shadow-sm bg-gradient-to-r from-blue-500 to-blue-600">
                                    {relatedPost.category}
                                  </div>
                                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                                    {relatedPost.title}
                                  </h4>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span className="font-medium">{formatDate(relatedPost.publishedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </article>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link
                          href="/blog"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group w-full justify-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
                        >
                          Lihat Semua Artikel
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Failed to load blog post:', error);
    notFound();
  }
}