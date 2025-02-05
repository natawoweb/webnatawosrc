
import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Writer = Database['public']['Tables']['writers']['Row']
export type AppRole = Database['public']['Enums']['app_role']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type UserLevel = 'Literary Tamil Writers' | 'Talented Experts' | 'NATAWO Volunteers' | 'NATAWO Students Writers' | 'Subscriber' | 'Technical'
