// Site configuration - will be overridden by API data
export const SITE_CONFIG = {
  name: '',
  description: '',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: '',
    facebook: '',
    instagram: '',
    github: '',
  },
};

// Contact information
export const CONTACT_INFO = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+62 123 456 789',
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '+62 123 456 789',
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '',
};

// Navigation items
export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy' },
];

// Footer links
export const FOOTER_LINKS = {
  quickLinks: [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  products: [
    { name: 'Layanan Digital', href: '#' },
    { name: 'Platform Bisnis', href: '#' },
    { name: 'Solusi Teknologi', href: '#' },
    { name: 'Aplikasi Mobile', href: '#' },
  ],
  support: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Status Page', href: '#' },
    { name: 'Help Center', href: '#' },
  ],
};

// Business hours - will be overridden by API data
export const BUSINESS_HOURS = [
  { day: '', hours: '' },
];

// Features data - will be overridden by API data
export const FEATURES = [];

// Statistics - will be overridden by API data
export const STATS = [];

// Blog categories - will be overridden by API data
export const BLOG_CATEGORIES = [
  'Semua',
];