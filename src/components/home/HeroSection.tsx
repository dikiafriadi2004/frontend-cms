'use client';

import Link from 'next/link';
import { useSettings } from '@/contexts/ApiContext';

const HeroSection = () => {
  const { settings, settingsLoading } = useSettings();
  
  // Get CTA content from API settings - only show if available from API
  const ctaTitle = settings?.cta_title;
  const ctaSubtitle = settings?.cta_subtitle;
  const ctaDescription = settings?.cta_description;
  const ctaButtonText = settings?.cta_button_text;
  const ctaButtonUrl = settings?.cta_button_url;

  return (
    <section className="relative min-h-[50vh] bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 pt-20 pb-6 lg:pt-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-4">
            <div className="space-y-3">
              {ctaSubtitle && (
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full text-blue-700 text-sm font-medium border border-blue-200">
                  {settingsLoading ? (
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    ctaSubtitle
                  )}
                </div>
              )}
              {ctaTitle && (
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {settingsLoading ? (
                    <div className="space-y-2">
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: ctaTitle }} />
                  )}
                </h1>
              )}
              {ctaDescription && (
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {settingsLoading ? (
                    <span className="inline-block">
                      <span className="inline-block h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></span>
                      <span className="inline-block h-4 w-3/4 bg-gray-200 rounded animate-pulse"></span>
                    </span>
                  ) : (
                    ctaDescription
                  )}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Profit 30-50%</div>
                  <div className="text-xs text-gray-500">Margin tinggi</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Transaksi 2 Detik</div>
                  <div className="text-xs text-gray-500">Super cepat</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Modal Minim</div>
                  <div className="text-xs text-gray-500">Mulai 100rb</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Support 24/7</div>
                  <div className="text-xs text-gray-500">Selalu siap</div>
                </div>
              </div>
            </div>

            {/* CTA Button - Only show if data exists from API */}
            {ctaButtonText && ctaButtonUrl && (
              <div className="flex">
                <Link
                  href={ctaButtonUrl}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md text-sm"
                >
                  {settingsLoading ? (
                    <div className="h-4 w-28 bg-blue-500 rounded animate-pulse"></div>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      {ctaButtonText}
                    </>
                  )}
                </Link>
              </div>
            )}

            {/* Social Proof */}
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 mb-1">15K+</div>
                <div className="text-xs">Mitra Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 mb-1">99.9%</div>
                <div className="text-xs">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 mb-1">2M+</div>
                <div className="text-xs">Transaksi/Bulan</div>
              </div>
            </div>
          </div>

          {/* Mobile App Mockup */}
          <div className="relative">
            <div className="relative max-w-xs mx-auto">
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-900 h-8 flex items-center justify-between px-6 text-white text-xs">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-5 h-2.5 border border-white rounded-sm">
                        <div className="w-3 h-1.5 bg-white rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="bg-white h-[500px] relative">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-6 pb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Dashboard</h2>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="text-blue-100 text-sm">Selamat datang, Budi</div>
                    </div>
                    
                    {/* Balance Card */}
                    <div className="px-6 -mt-5">
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="text-gray-600 text-sm mb-1">Saldo Hari Ini</div>
                        <div className="text-2xl font-bold text-gray-900 mb-4">Rp 2.500.000</div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="text-gray-600 mb-1">Transaksi</div>
                            <div className="font-semibold text-blue-600">1,234</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Success Rate</div>
                            <div className="font-semibold text-green-600">99.8%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Grid */}
                    <div className="px-6 mt-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <div className="w-6 h-6 bg-blue-600 rounded"></div>
                          </div>
                          <div className="text-xs text-gray-600">Digital</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <div className="w-6 h-6 bg-green-600 rounded"></div>
                          </div>
                          <div className="text-xs text-gray-600">Data</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <div className="w-6 h-6 bg-purple-600 rounded"></div>
                          </div>
                          <div className="text-xs text-gray-600">Platform</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Transactions */}
                    <div className="px-6 mt-6">
                      <div className="text-gray-900 font-semibold mb-3 text-sm">Transaksi Terbaru</div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg"></div>
                            <div>
                              <div className="text-sm font-medium">Layanan Digital</div>
                              <div className="text-xs text-gray-500 mt-0.5">081234567890</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-600">+Rp 2.500</div>
                            <div className="text-xs text-gray-500 mt-0.5">Berhasil</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg"></div>
                            <div>
                              <div className="text-sm font-medium">Paket Data XL</div>
                              <div className="text-xs text-gray-500 mt-0.5">081987654321</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-600">+Rp 1.800</div>
                            <div className="text-xs text-gray-500 mt-0.5">Berhasil</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-xl p-3 shadow-xl animate-bounce">
                <div className="text-center">
                  <div className="text-sm font-bold">+Rp 150K</div>
                  <div className="text-xs mt-0.5">Profit Hari Ini</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-xl p-3 shadow-xl">
                <div className="text-center">
                  <div className="text-sm font-bold">⚡ 1.2s</div>
                  <div className="text-xs mt-0.5">Avg Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;