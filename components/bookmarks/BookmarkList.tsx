'use client';

import React from 'react';
import { Bookmark } from '@/lib/supabase/types';
import BookmarkCard from './BookmarkCard';
import { Loader, AlertCircle } from 'lucide-react';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  onDelete: (bookmarkId: string) => Promise<void>;
}

export const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  loading,
  error,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500 mb-2">No bookmarks yet</p>
        <p className="text-gray-400 text-sm">
          Add your first bookmark to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
