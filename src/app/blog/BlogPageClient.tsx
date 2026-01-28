'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBlogPosts, fetchBlogCategories } from '@/lib/api';
import { ApiBlogPost, BlogResponse } from '@/types/global';

// Constants
const DEFAULT_POSTS_PER_PAGE = 10;

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
  
  // Get posts per page from pagination or use default
  const postsPerPage = pagination?.per_page || DEFAULT_POSTS_PER_PAGE;

  // Load blog posts and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load posts and categories in parallel
        const [postsResponse, categoriesData] = await Promise.all([
          fetchBlogPosts(currentPage, postsPerPage),
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
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              {Array.from({ length: Math.min(6, postsPerPage || DEFAULT_POSTS_PER_PAGE) }, (_, i) => (
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
                  <article
                    key={post.id}
                    className="group relative"
                  >
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700">
                      <div className="relative h-64 overflow-hidden">
                        {post.featuredImage ? (
                          <img 
                            src={post.featuredImage} 
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
                ))}
              </div>

              {/* Pagination - Professional & Elegant Design */}
              {blogPosts.length > 0 && (
                <div className="flex flex-col items-center mt-20 space-y-6">
                  {/* Pagination Navigation */}
                  <nav className="flex items-center justify-center">
                    <div className="flex items-center bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-2">
                      {/* Previous Button */}
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="group flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all duration-300 rounded-xl hover:bg-blue-50/80"
                      >
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium text-sm">Previous</span>
                      </button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center mx-2">
                        {(() => {
                          const maxPages = pagination?.last_page || Math.ceil(blogPosts.length / postsPerPage) || 1;
                          const visiblePages = [];
                          
                          // Logic untuk menampilkan halaman yang relevan
                          let startPage = Math.max(1, currentPage - 2);
                          let endPage = Math.min(maxPages, currentPage + 2);
                          
                          // Adjust jika di awal atau akhir
                          if (currentPage <= 3) {
                            endPage = Math.min(5, maxPages);
                          }
                          if (currentPage > maxPages - 3) {
                            startPage = Math.max(1, maxPages - 4);
                          }
                          
                          // First page + ellipsis
                          if (startPage > 1) {
                            visiblePages.push(
                              <button
                                key={1}
                                onClick={() => handlePageChange(1)}
                                className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-300"
                              >
                                1
                              </button>
                            );
                            if (startPage > 2) {
                              visiblePages.push(
                                <span key="ellipsis1" className="px-2 text-gray-400 text-sm">...</span>
                              );
                            }
                          }
                          
                          // Main page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            visiblePages.push(
                              <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-lg transition-all duration-300 ${
                                  currentPage === i
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80'
                                }`}
                              >
                                {i}
                              </button>
                            );
                          }
                          
                          // Last page + ellipsis
                          if (endPage < maxPages) {
                            if (endPage < maxPages - 1) {
                              visiblePages.push(
                                <span key="ellipsis2" className="px-2 text-gray-400 text-sm">...</span>
                              );
                            }
                            visiblePages.push(
                              <button
                                key={maxPages}
                                onClick={() => handlePageChange(maxPages)}
                                className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-300"
                              >
                                {maxPages}
                              </button>
                            );
                          }
                          
                          return visiblePages;
                        })()}
                      </div>
                      
                      {/* Next Button */}
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={pagination ? currentPage >= pagination.last_page : false}
                        className="group flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all duration-300 rounded-xl hover:bg-blue-50/80"
                      >
                        <span className="font-medium text-sm">Next</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </nav>
                  
                  {/* Pagination Info */}
                  {pagination && (
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>
                          Showing <span className="font-semibold text-gray-700">{((currentPage - 1) * postsPerPage) + 1}</span> to{' '}
                          <span className="font-semibold text-gray-700">
                            {Math.min(currentPage * postsPerPage, blogPosts.length)}
                          </span> of{' '}
                          <span className="font-semibold text-gray-700">{blogPosts.length}</span> articles
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPageClient;