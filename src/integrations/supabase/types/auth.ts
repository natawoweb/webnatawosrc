
import { Database } from './database'

export interface ProfilesTable {
  Row: {
    id: string
    full_name: string | null
    email: string | null
    user_type: string
    created_at: string | null
  }
  Insert: {
    id: string
    full_name?: string | null
    email?: string | null
    user_type?: string
    created_at?: string | null
  }
  Update: {
    id?: string
    full_name?: string | null
    email?: string | null
    user_type?: string
    created_at?: string | null
  }
}

export interface UserRolesTable {
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
