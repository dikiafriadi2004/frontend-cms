'use client';

import { useEffect, useState } from 'react';
import { fetchMenu, fetchBlogPosts, fetchSiteSettings } from '@/lib/api';

interface ApiStatus {
  menu: { loading: boolean; success: boolean; data: any; error?: string };
  blog: { loading: boolean; success: boolean; data: any; error?: string };
  settings: { loading: boolean; success: boolean; data: any; error?: string };
}

const ApiStatusDashboard = () => {
  const [status, setStatus] = useState<ApiStatus>({
    menu: { loading: true, success: false, data: null },
    blog: { loading: true, success: false, data: null },
    settings: { loading: true, success: false, data: null }
  });

  useEffect(() => {
    const testApis = async () => {
      // Test Menu API
      try {
        const menuResponse = await fetchMenu();
        setStatus(prev => ({
          ...prev,
          menu: {
            loading: false,
            success: menuResponse.success,
            data: menuResponse.data,
            error: menuResponse.success ? undefined : 'Failed to load menu'
          }
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          menu: {
            loading: false,
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }));
      }

      // Test Blog API
      try {
        const blogResponse = await fetchBlogPosts(1, 3);
        setStatus(prev => ({
          ...prev,
          blog: {
            loading: false,
            success: blogResponse.success,
            data: blogResponse.data,
            error: blogResponse.success ? undefined : 'Failed to load blog posts'
          }
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          blog: {
            loading: false,
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }));
      }

      // Test Settings API
      try {
        const settingsResponse = await fetchSiteSettings();
        setStatus(prev => ({
          ...prev,
          settings: {
            loading: false,
            success: settingsResponse.success,
            data: settingsResponse.data,
            error: settingsResponse.success ? undefined : 'Failed to load settings'
          }
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          settings: {
            loading: false,
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }));
      }
    };

    testApis();
  }, []);

  const StatusCard = ({ title, status: itemStatus }: { title: string; status: any }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${
          itemStatus.loading ? 'bg-yellow-500 animate-pulse' :
          itemStatus.success ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </div>
      
      {itemStatus.loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : itemStatus.success ? (
        <div>
          <p className="text-green-600 font-medium mb-2">✅ Success</p>
          <div className="text-sm text-gray-600">
            {Array.isArray(itemStatus.data) ? (
              <p>Loaded {itemStatus.data.length} items</p>
            ) : itemStatus.data ? (
              <p>Data loaded successfully</p>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-red-600 font-medium mb-2">❌ Failed</p>
          <p className="text-sm text-red-600">{itemStatus.error}</p>
        </div>
      )}
      
      {itemStatus.data && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
            View Data
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(itemStatus.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Integration Status
          </h1>
          <p className="text-lg text-gray-600">
            Real-time status of API connections and data loading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatusCard title="Menu API" status={status.menu} />
          <StatusCard title="Blog API" status={status.blog} />
          <StatusCard title="Settings API" status={status.settings} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Base URL:</span>
              <span className="ml-2 text-gray-600">{process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Fallback Data:</span>
              <span className="ml-2 text-gray-600">{process.env.ENABLE_FALLBACK_DATA === 'true' ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Debug Mode:</span>
              <span className="ml-2 text-gray-600">{process.env.DEBUG_API_CALLS === 'true' ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Environment:</span>
              <span className="ml-2 text-gray-600">{process.env.NODE_ENV || 'development'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusDashboard;