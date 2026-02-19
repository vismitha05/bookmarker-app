export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};
