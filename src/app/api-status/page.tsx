import ApiStatusDashboard from '@/components/ApiStatusDashboard';
import { generateMetadata as generateDynamicMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';

export default function ApiStatusPage() {
  // Disable API status page in production for security
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <div>
      <ApiStatusDashboard />
    </div>
  );
}

export async function generateMetadata() {
  return await generateDynamicMetadata('API Status', 'API integration status and testing dashboard', 'page');
}