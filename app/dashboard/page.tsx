'use client';

import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkForm } from '@/components/bookmarks/BookmarkForm';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookmarks, loading, error, deleteBookmark } = useBookmarks(user?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Bookmarks</h2>
        <p className="text-gray-600">
          Manage your bookmarks in one place with real-time updates
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Add Bookmark
            </h3>
            <BookmarkForm userId={user?.id} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <BookmarkList
            bookmarks={bookmarks}
            loading={loading}
            error={error}
            onDelete={deleteBookmark}
          />
        </div>
      </div>
    </div>
  );
}
