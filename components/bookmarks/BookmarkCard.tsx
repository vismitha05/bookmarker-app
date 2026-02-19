'use client';

import React, { useState } from 'react';
import { Bookmark } from '@/lib/supabase/types';
import { ExternalLink, Trash2, Loader } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (bookmarkId: string) => Promise<void>;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await onDelete(bookmark.id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete bookmark';
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
          {bookmark.title}
        </h3>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Delete bookmark"
        >
          {deleting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 truncate mb-2"
      >
        <span className="truncate">{new URL(bookmark.url).hostname}</span>
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
      </a>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <p className="text-xs text-gray-500 mt-3">
        {new Date(bookmark.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default BookmarkCard;
