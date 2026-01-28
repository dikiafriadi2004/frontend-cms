'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMenu, useSettings } from '@/contexts/ApiContext';
import { getSiteName } from '@/lib/settings-helper';

// Modern Logo Component
const LogoImage = ({ src, alt, fallbackText }: { src: string; alt: string; fallbackText: string }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="h-9 w-auto flex items-center justify-center">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={src}
      alt={alt} 
      className="h-9 w-auto object-contain"
      onError={() => setImageError(true)}
    />
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Get dynamic menu and settings from API
  const { menu, menuLoading } = useMenu();
  const { settings, settingsLoading } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/blog') {
      return pathname === '/blog' || pathname.startsWith('/blog/');
    }
    return pathname === href;
  };

  // Show loading state or fallback menu
  const navigation = menu.length > 0 ? menu : [
    { id: '1', name: 'Home', href: '/', order: 1, isActive: true },
    { id: '2', name: 'Blog', href: '/blog', order: 2, isActive: true },
    { id: '3', name: 'Contact', href: '/contact', order: 3, isActive: true },
    { id: '4', name: 'Privacy', href: '/privacy', order: 4, isActive: true },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-lg shadow-gray-900/5' 
        : 'bg-white/95 backdrop-blur-md'
    }`}>
      <nav className="max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              {settingsLoading ? (
                <div className="h-9 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              ) : settings?.logo ? (
                <div className="transition-transform duration-300 group-hover:scale-105">
                  <LogoImage 
                    src={settings.logo.startsWith('http') ? settings.logo : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}/storage/${settings.logo}`}
                    alt={settings.siteName || 'Logo'}
                    fallbackText={settings?.siteName?.charAt(0) || 'P'}
                  />
                </div>
              ) : (
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
                  {getSiteName(settings)}
                </span>
              )}
            </Link>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Desktop Navigation - Back to right side */}
          <div className="hidden md:flex items-center space-x-1">
            {menuLoading ? (
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            ) : (
              navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full"></div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
                </Link>
              ))
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-100 rounded-b-2xl shadow-xl">
              {menuLoading ? (
                <div className="space-y-3 p-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  {navigation.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;