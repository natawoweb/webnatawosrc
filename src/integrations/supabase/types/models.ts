import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Writer = Database['public']['Tables']['writers']['Row']
export type AppRole = Database['public']['Enums']['app_role']