export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: HasRoleFunction
    }
    Enums: {
      app_role: "reader" | "writer" | "manager" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

interface ProfilesTable {
  Row: {
    id: string
    full_name: string | null
    bio: string | null
    avatar_url: string | null
    created_at: string | null
    updated_at: string | null
    email: string | null
  }
  Insert: {
    id: string
    full_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    email?: string | null
  }
  Update: {
    id?: string
    full_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    email?: string | null
  }
}

interface UserRolesTable {
  Row: {
    id: string
    user_id: string
    role: Database["public"]["Enums"]["app_role"]
    created_at: string | null
  }
  Insert: {
    id?: string
    user_id: string
    role?: Database["public"]["Enums"]["app_role"]
    created_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string
    role?: Database["public"]["Enums"]["app_role"]
    created_at?: string | null
  }
}

interface HasRoleFunction {
  Args: {
    user_id: string
    required_role: Database["public"]["Enums"]["app_role"]
  }
  Returns: boolean
}
