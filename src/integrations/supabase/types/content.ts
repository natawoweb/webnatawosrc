
import { Database } from './database'
import { Json } from './shared'

export type BlogStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published';

export interface BlogsTable {
  Row: {
    id: string
    title: string
    content: string
    author_id: string
    status: BlogStatus | null
    created_at: string | null
    updated_at: string | null
    views_count: number | null
    title_tamil: string | null
    content_tamil: Json | null
    category_id: string | null
    cover_image: string | null
    published_at: string | null
  }
  Insert: {
    id?: string
    title: string
    content: string
    author_id: string
    status?: BlogStatus | null
    created_at?: string | null
    updated_at?: string | null
    views_count?: number | null
    title_tamil?: string | null
    content_tamil?: Json | null
    category_id?: string | null
    cover_image?: string | null
    published_at?: string | null
  }
  Update: {
    id?: string
    title?: string
    content?: string
    author_id?: string
    status?: BlogStatus | null
    created_at?: string | null
    updated_at?: string | null
    views_count?: number | null
    title_tamil?: string | null
    content_tamil?: Json | null
    category_id?: string | null
    cover_image?: string | null
    published_at?: string | null
  }
}

export interface CommentsTable {
  Row: {
    id: string
    blog_id: string
    user_id: string
    content: string
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    blog_id: string
    user_id: string
    content: string
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    blog_id?: string
    user_id?: string
    content?: string
    created_at?: string | null
    updated_at?: string | null
  }
}

export interface RatingsTable {
  Row: {
    id: string
    blog_id: string
    user_id: string
    rating: number
    created_at: string | null
  }
  Insert: {
    id?: string
    blog_id: string
    user_id: string
    rating: number
    created_at?: string | null
  }
  Update: {
    id?: string
    blog_id?: string
    user_id?: string
    rating?: number
    created_at?: string | null
  }
}
