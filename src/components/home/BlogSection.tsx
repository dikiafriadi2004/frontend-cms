'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchLatestPosts } from '@/lib/api';
import { ApiBlogPost } from '@/types/global';

// Constants
const HOME_BLOG_POSTS_LIMIT = 3;

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

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await fetchLatestPosts(HOME_BLOG_POSTS_LIMIT); // Get latest posts
        
        if (posts && posts.length > 0) {
          setBlogPosts(posts);
        } else {
          // If no posts from API, keep empty array
          setBlogPosts([]);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        // Keep empty array if API fails
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
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
              Memuat artikel terbaru untuk Anda...
            </p>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: HOME_BLOG_POSTS_LIMIT }, (_, i) => (
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
    );
  }

  // If no posts from API, show message
  if (blogPosts.length === 0) {
    return (
      <section className="py-24 relative">
        <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
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
              Dapatkan insight dan tips terbaru untuk mengembangkan bisnis digital Anda
            </p>
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Artikel</h3>
            <p className="text-gray-600 mb-6">Artikel blog sedang dalam proses. Silakan kembali lagi nanti.</p>
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Lihat Halaman Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative">
      <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
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
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
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

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Lihat Semua Artikel
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;