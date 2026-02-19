'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Loader } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Bookmarker
          </h1>
          <p className="text-gray-600">
            Save and organize your favorite websites
          </p>
        </div>

        <div className="space-y-6">
          <GoogleAuthButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Sign in to continue
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900 border border-blue-200">
            <p className="font-medium mb-2">Features:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Save bookmarks with title and URL</li>
              <li>Real-time updates across tabs</li>
              <li>Private bookmarks just for you</li>
              <li>Easy bookmark management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
