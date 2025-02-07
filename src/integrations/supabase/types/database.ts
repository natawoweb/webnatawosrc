
import { BlogsTable, CommentsTable, RatingsTable } from './content'
import { EventsTable } from './events'
import { WritersTable } from './writers'
import { ProfilesTable, UserRolesTable } from './auth'

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable
      user_roles: UserRolesTable
      blogs: BlogsTable
      comments: CommentsTable
      events: EventsTable
      ratings: RatingsTable
      writers: WritersTable
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
          id?: string
          name?: string
          created_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          created_at?: string
          status?: string
        }
      }
      event_comments: {
        Row: {
          id: string
          event_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
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
    }
    Enums: {
      app_role: "reader" | "writer" | "manager" | "admin"
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
