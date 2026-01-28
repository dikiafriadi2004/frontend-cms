import ApiStatusDashboard from '@/components/ApiStatusDashboard';
import { generateMetadata as generateDynamicMetadata } from '@/lib/metadata';

export default function ApiStatusPage() {
  return (
    <div>
      <ApiStatusDashboard />
    </div>
  );
}

export async function generateMetadata() {
  return await generateDynamicMetadata('API Status', 'API integration status and testing dashboard', 'page');
}