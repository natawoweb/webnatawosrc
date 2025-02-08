
import { Database } from './database'

export interface ProfilesTable {
  Row: {
    id: string
    full_name: string | null
    bio: string | null
    avatar_url: string | null
    created_at: string | null
    updated_at: string | null
    email: string | null
    level: string | null
    location: string | null
    status: string | null
    user_type: string
    date_of_birth: string | null
    gender: string | null
    pseudonym: string | null
    county: string | null
    state: string | null
  }
  Insert: {
    id: string
    full_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    email?: string | null
    level?: string | null
    location?: string | null
    status?: string | null
    user_type?: string
    date_of_birth?: string | null
    gender?: string | null
    pseudonym?: string | null
    county?: string | null
    state?: string | null
  }
  Update: {
    id?: string
    full_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    email?: string | null
    level?: string | null
    location?: string | null
    status?: string | null
    user_type?: string
    date_of_birth?: string | null
    gender?: string | null
    pseudonym?: string | null
    county?: string | null
    state?: string | null
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
