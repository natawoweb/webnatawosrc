import { BlogsTable } from './content';
import { ProfilesTable, UserRolesTable } from './auth';

export interface EventParticipantsTable {
  Row: {
    id: string;
    event_id: string;
    user_id: string;
    full_name: string;
    email: string;
    level: string | null;
    registration_date: string;
  };
  Insert: {
    id?: string;
    event_id: string;
    user_id: string;
    full_name: string;
    email: string;
    level?: string | null;
    registration_date?: string;
  };
  Update: {
    id?: string;
    event_id?: string;
    user_id?: string;
    full_name?: string;
    email?: string;
    level?: string | null;
    registration_date?: string;
  };
}

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable;
      user_roles: UserRolesTable;
      blogs: BlogsTable;
      blog_comments: {
        Row: {
          id: string;
          blog_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          blog_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          blog_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      event_comments: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      blog_ratings: {
        Row: {
          id: string;
          blog_id: string;
          user_id: string;
          rating: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          user_id: string;
          rating: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          user_id?: string;
          rating?: number;
          created_at?: string;
        };
      };
      event_ratings: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          rating: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          rating: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          rating?: number;
          created_at?: string;
        };
      };
      blog_comment_reactions: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          reaction_type: 'like' | 'dislike';
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          reaction_type: 'like' | 'dislike';
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          reaction_type?: 'like' | 'dislike';
          created_at?: string;
        };
      };
      event_comment_reactions: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          type: 'like' | 'dislike';
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          type: 'like' | 'dislike';
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          type?: 'like' | 'dislike';
          created_at?: string;
        };
      };
      event_categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      event_participants: EventParticipantsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: HasRoleFunction;
      register_for_event: RegisterForEventFunction;
      unregister_from_event: UnregisterFromEventFunction;
      increment_blog_views: IncrementBlogViewsFunction;
    };
    Enums: {
      app_role: 'reader' | 'writer' | 'manager' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

interface HasRoleFunction {
  Args: {
    user_id: string;
    required_role: Database['public']['Enums']['app_role'];
  };
  Returns: boolean;
}

interface RegisterForEventFunction {
  Args: {
    p_event_id: string;
    p_user_id: string;
  };
  Returns: boolean;
}

interface UnregisterFromEventFunction {
  Args: {
    p_event_id: string;
    p_user_id: string;
  };
  Returns: boolean;
}

interface IncrementBlogViewsFunction {
  Args: {
    blog_id: string;
  };
  Returns: void;
}
