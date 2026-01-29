'use client';

import { useEffect, useRef } from 'react';

interface BlogContentProps {
  content: string;
  className?: string;
}

const BlogContent = ({ content, className = '' }: BlogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Additional client-side fixes for broken HTML
    let htmlContent = contentRef.current.innerHTML;
    let hasChanges = false;

    // Fix any remaining broken image tags
    if (htmlContent.includes('<imgsrc=')) {
      htmlContent = htmlContent.replace(/<imgsrc=/gi, '<img src=');
      hasChanges = true;
    }

    // Fix missing spaces before attributes
    const fixedSpacing = htmlContent
      .replace(/([^"\s])src=/gi, '$1 src=')
      .replace(/([^"\s])alt=/gi, '$1 alt=')
      .replace(/([^"\s])class=/gi, '$1 class=');
    
    if (fixedSpacing !== htmlContent) {
      htmlContent = fixedSpacing;
      hasChanges = true;
    }

    // Apply changes if any were made
    if (hasChanges) {
      contentRef.current.innerHTML = htmlContent;
    }

    // Find all images in the content and add error handling
    const images = contentRef.current.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // Add loading and error event listeners
      img.addEventListener('error', (e) => {
        // Try to fix the src if it looks broken
        const currentSrc = img.src;
        if (currentSrc.includes('undefined') || currentSrc.includes('null') || !currentSrc.trim()) {
          img.style.display = 'none';
          return;
        }

        // Try to replace localhost with API base URL if needed
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000';
        if (currentSrc.includes('localhost:8000') && !currentSrc.includes(apiBaseUrl.replace('http://', '').replace('https://', ''))) {
          const fixedSrc = currentSrc.replace(/http:\/\/localhost:8000/gi, apiBaseUrl);
          img.src = fixedSrc;
        }
      });

      // Ensure images have proper attributes
      if (!img.alt) {
        img.alt = '';
      }
      
      if (!img.className.includes('blog-content-image')) {
        img.className = `${img.className} blog-content-image`.trim();
      }
    });

  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={`blog-content-wrapper ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;