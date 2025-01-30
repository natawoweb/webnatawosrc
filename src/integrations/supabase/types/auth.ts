import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type AppRole = Database['public']['Enums']['app_role']
export type UserRole = Database['public']['Tables']['user_roles']['Row']

export interface AuthUser {
  id: string
  email: string
  role: AppRole
  profile?: Profile
}

export interface AuthError {
  message: string
  details?: unknown
}