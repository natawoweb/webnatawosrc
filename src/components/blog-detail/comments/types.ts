
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  profiles?: {
    full_name: string | null;
  };
  likes_count?: number;
  dislikes_count?: number;
  user_reaction?: 'like' | 'dislike' | null;
}
