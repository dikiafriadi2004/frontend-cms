import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogPost, fetchLatestPosts } from '@/lib/api';
import { generateBlogPostMetadata } from '@/lib/metadata';
import { ApiBlogPost } from '@/types/global';

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

// Helper function to sanitize HTML content
const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '');
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

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Filter out current post from related posts
    const filteredRelatedPosts = relatedPosts.filter(p => p.id !== post.id);

    return (
      <div className="min-h-screen bg-gray-50">
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
                <li className="text-gray-900 font-medium truncate">{post.title}</li>
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
                            {post.category}
                            <div className="ml-2 w-1 h-1 bg-white/60 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title with Better Typography */}
                    <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
                      <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        {post.title}
                      </span>
                    </h1>
                    
                    {/* Enhanced Meta Information */}
                    <div className="relative z-10 flex flex-wrap items-center gap-6 text-gray-600">
                      {/* Author */}
                      <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-sm border border-white/40">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            {post.author.avatar ? (
                              <img 
                                src={post.author.avatar} 
                                alt={post.author.name}
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
                          <div className="text-sm font-bold text-gray-900">{post.author.name}</div>
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
                          <div className="text-sm font-semibold text-gray-900">{formatDate(post.publishedAt)}</div>
                          <div className="text-xs text-gray-500">Published</div>
                        </div>
                      </div>
                      
                      {/* Read Time */}
                      {post.readTime && (
                        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-sm border border-white/40">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{post.readTime}</div>
                            <div className="text-xs text-gray-500">Read time</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Featured Image */}
                  <div className="relative mx-8 mb-8">
                    <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500 group">
                      {post.featuredImage ? (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 transform hover:shadow-xl transition-all duration-300">
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-3xl prose-h2:mb-4 prose-h3:text-2xl prose-h3:mb-3 prose-h4:text-xl prose-h4:mb-2">
                    {/* Render content as HTML if it contains HTML tags, otherwise as plain text */}
                    {post.content.includes('<') ? (
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} />
                    ) : (
                      <div className="whitespace-pre-wrap">{post.content}</div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: any, index: number) => {
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
                      <div className="flex items-center space-x-3">
                        <button className="group w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1">
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </button>
                        
                        <button className="group w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1">
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                          </svg>
                        </button>
                      </div>
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
                                      src={relatedPost.featuredImage} 
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