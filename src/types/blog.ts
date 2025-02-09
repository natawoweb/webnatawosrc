
export interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published' | null;
  created_at: string | null;
  updated_at: string | null;
  views_count: number | null;
  published_at: string | null;
  blog_comments?: Array<{ count: number }>;
  blog_categories?: Array<{ name: string }>;
}
