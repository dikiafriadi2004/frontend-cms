import { generateHomeMetadata } from '@/lib/metadata';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import FAQSection from '@/components/home/FAQSection';
import BlogSection from '@/components/home/BlogSection';

export async function generateMetadata() {
  return await generateHomeMetadata();
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <FAQSection />
      <BlogSection />
    </main>
  );
}