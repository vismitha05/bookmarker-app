'use client';

import { supabase } from '@/lib/supabase/client';
import { Bookmark } from '@/lib/supabase/types';
import { useCallback, useEffect, useState } from 'react';

export const useBookmarks = (userId: string | undefined) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookmarks(data || []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch bookmarks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add bookmark
  const addBookmark = useCallback(
    async (title: string, url: string) => {
      if (!userId) return;

      try {
        const { data, error: addError } = await supabase
          .from('bookmarks')
          .insert({
            user_id: userId,
            title,
            url,
          })
          .select();

        if (addError) throw addError;
        setError(null);
        return data?.[0];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add bookmark';
        setError(errorMessage);
        throw err;
      }
    },
    [userId]
  );

  // Delete bookmark
  const deleteBookmark = useCallback(
    async (bookmarkId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', bookmarkId)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete bookmark';
        setError(errorMessage);
        throw err;
      }
    },
    [userId]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    fetchBookmarks();

    const subscription = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    refetch: fetchBookmarks,
  };
};
