
import { Database } from './database'
import { Json } from './shared'

export type Profile = {
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
  social_links: Json | null
  approval_status: 'pending' | 'approved' | 'rejected' | null
}

export type AppRole = Database['public']['Enums']['app_role']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type UserLevel = 'Literary Tamil Writers' | 'Talented Experts' | 'NATAWO Volunteers' | 'NATAWO Students Writers' | 'Subscriber' | 'Technical'
