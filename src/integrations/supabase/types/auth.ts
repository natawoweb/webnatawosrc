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
    level: Database["public"]["Enums"]["user_level"] | null
    county: string | null
    date_of_birth: string | null
    gender: string | null
    location: string | null
    pseudonym: string | null
    state: string | null
    status: string | null
    uesr_id: string | null
    user_type: string
  }
  Insert: {
    id: string
    full_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    email?: string | null
    level?: Database["public"]["Enums"]["user_level"] | null
    county?: string | null
    date_of_birth?: string | null
    gender?: string | null
    location?: string | null
    pseudonym?: string | null
    state?: string | null
    status?: string | null
    uesr_id?: string | null
    user_type?: string
  }
  Update: {
    id?: string
    full_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    email?: string | null
    level?: Database["public"]["Enums"]["user_level"] | null
    county?: string | null
    date_of_birth?: string | null
    gender?: string | null
    location?: string | null
    pseudonym?: string | null
    state?: string | null
    status?: string | null
    uesr_id?: string | null
    user_type?: string
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