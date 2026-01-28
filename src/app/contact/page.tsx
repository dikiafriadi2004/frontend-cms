import { generateContactMetadata } from '@/lib/metadata';
import ContactPageClient from './ContactPageClient';

export async function generateMetadata() {
  return await generateContactMetadata();
}

export default function ContactPage() {
  return <ContactPageClient />;
}