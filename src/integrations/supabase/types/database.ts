import { EventsTable } from './events'
import { WritersTable } from './writers'
import { ProfilesTable, UserRolesTable } from './auth'

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable
      user_roles: UserRolesTable
      blogs: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          created_at: string
          updated_at: string | null
          published_at: string | null
          cover_image: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          created_at?: string
          updated_at?: string | null
          published_at?: string | null
          cover_image?: string | null
        }
        Update: {
          title?: string
          content?: string
          author_id?: string
          status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          updated_at?: string | null
          published_at?: string | null
          cover_image?: string | null
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          name?: string
        }
      }
      blog_category_relations: {
        Row: {
          blog_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          blog_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          blog_id?: string
          category_id?: string
        }
      }
      blog_comments: {
        Row: {
          id: string
          blog_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          blog_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          updated_at?: string | null
        }
      }
      blog_comment_reactions: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          type: 'like' | 'dislike'
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          type: 'like' | 'dislike'
          created_at?: string
        }
        Update: {
          type?: 'like' | 'dislike'
        }
      }
      blog_ratings: {
        Row: {
          id: string
          blog_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          rating?: number
        }
      }
      event_comments: {
        Row: {
          id: string
          event_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          created_by: string
          created_at: string
          updated_at: string | null
          category_id: string
          status: 'draft' | 'published' | 'cancelled'
          images: string[]
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          created_by: string
          created_at?: string
          updated_at?: string | null
          category_id: string
          status?: 'draft' | 'published' | 'cancelled'
          images?: string[]
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          created_by?: string
          created_at?: string
          updated_at?: string | null
          category_id?: string
          status?: 'draft' | 'published' | 'cancelled'
          images?: string[]
        }
      }
      event_categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      event_comment_reactions: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          type: 'like' | 'dislike'
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          type: 'like' | 'dislike'
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          type?: 'like' | 'dislike'
          created_at?: string
        }
      }
      event_ratings: {
        Row: {
          id: string
          event_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          rating?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: HasRoleFunction
      register_for_event: RegisterForEventFunction
      unregister_from_event: UnregisterFromEventFunction
      check_blog_status_transition: {
        Args: {
          old_status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          new_status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          user_role: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "reader" | "writer" | "manager" | "admin"
      blog_status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

interface HasRoleFunction {
  Args: {
    user_id: string
    required_role: Database["public"]["Enums"]["app_role"]
  }
  Returns: boolean
}

interface RegisterForEventFunction {
  Args: {
    p_event_id: string
    p_user_id: string
  }
  Returns: boolean
}

interface UnregisterFromEventFunction {
  Args: {
    p_event_id: string
    p_user_id: string
  }
  Returns: boolean
}
