'use client';

import { useEffect } from 'react';
import { trackBlogPostView } from '@/lib/analytics';

interface BlogPostTrackerProps {
  postTitle: string;
  postCategory: string;
  postSlug: string;
}

const BlogPostTracker = ({ postTitle, postCategory, postSlug }: BlogPostTrackerProps) => {
  useEffect(() => {
    // Track blog post view after component mounts
    const timer = setTimeout(() => {
      trackBlogPostView(postTitle, postCategory);
    }, 1000); // Small delay to ensure analytics scripts are loaded

    return () => clearTimeout(timer);
  }, [postTitle, postCategory, postSlug]);

  // This component doesn't render anything
  return null;
};

export default BlogPostTracker;