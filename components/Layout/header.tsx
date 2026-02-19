'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/auth';
import { LogOut, Bookmark } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Smart Bookmarker</h1>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-700 font-medium">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
