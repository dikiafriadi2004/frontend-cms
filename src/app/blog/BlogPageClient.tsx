'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBlogPosts, fetchBlogCategories } from '@/lib/api';
import { ApiBlogPost, BlogResponse } from '@/types/global';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import { AdsAPI, isAdActive } from '@/lib/ads-api';

// Constants
const DEFAULT_POSTS_PER_PAGE = 9;

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

const BlogPageClient = () => {
  const [blogPosts, setBlogPosts] = useState<ApiBlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<BlogResponse['pagination'] | null>(null);
  const [hasSidebarAds, setHasSidebarAds] = useState(false);
  const [isChangingPage, setIsChangingPage] = useState(false);
  
  // Get posts per page from pagination or use default
  const postsPerPage = pagination?.per_page || DEFAULT_POSTS_PER_PAGE;

  // Load blog posts and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Use consistent posts per page value
        const currentPostsPerPage = DEFAULT_POSTS_PER_PAGE;
        
        // Load posts, categories, and check ads in parallel
        const [postsResponse, categoriesData] = await Promise.all([
          fetchBlogPosts(currentPage, currentPostsPerPage),
          fetchBlogCategories()
        ]);

        if (postsResponse.success) {
          setBlogPosts(postsResponse.data);
          setPagination(postsResponse.pagination);
        }
        
        setCategories(['Semua', ...categoriesData]);
      } catch (error) {
        console.error('Failed to load blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage]);

  // Check if sidebar ads exist
  useEffect(() => {
    const checkSidebarAds = async () => {
      try {
        const sidebarAds = await AdsAPI.getAdsByPosition('sidebar');
        const activeAds = sidebarAds.filter(isAdActive);
        setHasSidebarAds(activeAds.length > 0);
      } catch (error) {
        console.error('Failed to check sidebar ads:', error);
        setHasSidebarAds(false);
      }
    };

    checkSidebarAds();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // TODO: Implement category filtering when API supports it
  };

  const handlePageChange = (page: number) => {
    setIsChangingPage(true);
    setCurrentPage(page);
    
    // Smooth scroll to top with a slight delay for better UX
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset loading state after scroll
      setTimeout(() => setIsChangingPage(false), 300);
    }, 100);
  };

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle keyboard navigation when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        event.preventDefault();
        handlePageChange(currentPage - 1);
      } else if (event.key === 'ArrowRight' && pagination?.has_more) {
        event.preventDefault();
        handlePageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, pagination?.has_more]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="text-center max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4">
                  <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Blog
                  </span>
                  <span className="inline-block mx-4 text-gray-300">&</span>
                  <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Insights
                  </span>
                </h1>
                
                <div className="flex items-center justify-center mt-6 mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-32"></div>
                  <div className="mx-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-32"></div>
                </div>
              </div>

              <div className="relative">
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                  Memuat artikel terbaru untuk Anda...
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Content */}
        <section className="py-24 relative">
          <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: DEFAULT_POSTS_PER_PAGE }, (_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-8">
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-6"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header Ad */}
      <HeaderAd />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4">
                <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Blog
                </span>
                <span className="inline-block mx-4 text-gray-300">&</span>
                <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              
              <div className="flex items-center justify-center mt-6 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-32"></div>
                <div className="mx-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-32"></div>
              </div>
            </div>

            <div className="relative">
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                Dapatkan 
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> tips terbaru</span>, 
                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> tutorial mendalam</span>, dan 
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> insight bisnis</span>
                <br className="hidden md:block" />
                untuk mengembangkan bisnis digital Anda menjadi lebih profitable
              </p>
              
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      {categories.length > 1 && (
        <section className="py-16 relative">
          <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Jelajahi Berdasarkan Kategori
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Temukan artikel yang sesuai dengan kebutuhan dan minat Anda
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' 
                      : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:text-white shadow-xl hover:shadow-2xl border border-white/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600'
                  }`}
                >
                  <div className="relative flex items-center space-x-3">
                    <span className="text-base">{category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-24 relative">
        <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
          {blogPosts.length === 0 ? (
            // No posts message
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Artikel</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Artikel blog sedang dalam proses. Silakan kembali lagi nanti untuk membaca konten terbaru.
              </p>
              
              <Link
                href="/"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {blogPosts.length > 0 && (
                <div className="text-center mb-20">
                  <div className="inline-flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-xl opacity-30"></div>
                      <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold rounded-full shadow-2xl border border-white/20">
                        <div className="w-2 h-2 bg-white/80 rounded-full mr-3 animate-pulse"></div>
                        ✨ Artikel Pilihan
                        <div className="ml-3 w-1 h-1 bg-white/60 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Artikel Terbaru & Terpopuler
                    </span>
                  </h2>
                  
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Baca artikel terbaru dan terpopuler dari para ahli bisnis digital dengan insight yang mendalam
                  </p>
                </div>
              )}

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {blogPosts.map((post, index) => (
                  <div key={`post-${post.id}`}>
                    {/* Insert ad after every 6th post, but only if sidebar ads exist */}
                    {hasSidebarAds && index > 0 && index % 6 === 0 && (
                      <div className="col-span-full mb-10">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8">
                          <div className="text-center mb-6">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                              Advertisement
                            </span>
                          </div>
                          <SidebarAd className="max-w-md mx-auto" maxAds={1} />
                        </div>
                      </div>
                    )}
                    
                    <article className="group relative">
                      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700">
                        <div className="relative h-64 overflow-hidden">
                          {post.featuredImage ? (
                            <img 
                              src={post.featuredImage.replace(/http:\/\/localhost:8000/gi, process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000')} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`absolute inset-0 ${
                              index % 3 === 0 ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700' :
                              index % 3 === 1 ? 'bg-gradient-to-br from-green-500 via-teal-600 to-blue-700' :
                              'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700'
                            }`}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <div className="relative w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="absolute top-6 left-6">
                            <div className="px-4 py-2 rounded-full text-xs font-black shadow-xl border border-white/60 bg-white/95 text-blue-600">
                              {post.category}
                            </div>
                          </div>
                        </div>

                      <div className="p-8">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-6">
                          <div className="flex items-center space-x-2 bg-gray-100/90 backdrop-blur-sm rounded-full px-3 py-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-bold text-gray-700">{post.author.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-gray-100/90 backdrop-blur-sm rounded-full px-3 py-2">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold text-gray-600">{formatDate(post.publishedAt)}</span>
                          </div>
                          
                          {post.readTime && (
                            <div className="flex items-center space-x-2 bg-gray-100/90 backdrop-blur-sm rounded-full px-3 py-2">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-semibold text-gray-600">{post.readTime}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                          {extractTextFromHTML(post.content, 150)}
                        </p>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="group/link inline-flex items-center text-blue-600 hover:text-blue-700 font-black text-sm"
                        >
                          <span className="relative">
                            Baca Selengkapnya
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/link:w-full transition-all duration-300"></div>
                          </span>
                          <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Professional Clean Pagination */}
              {blogPosts.length > 0 && (
                <nav className="flex items-center justify-center mt-16 mb-8" aria-label="Pagination">
                  <div className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || isChangingPage}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        currentPage <= 1 || isChangingPage
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      aria-label="Go to previous page"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1 mx-4">
                      <span
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md"
                        aria-current="page"
                      >
                        {currentPage}
                      </span>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination?.has_more || isChangingPage}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        !pagination?.has_more || isChangingPage
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      aria-label="Go to next page"
                    >
                      Next
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPageClient;