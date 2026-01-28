import { generateBlogListingMetadata } from '@/lib/metadata';
import BlogPageClient from './BlogPageClient';

export async function generateMetadata() {
  return await generateBlogListingMetadata();
}

const BlogPage = () => {
  return <BlogPageClient />;
};

export default BlogPage;