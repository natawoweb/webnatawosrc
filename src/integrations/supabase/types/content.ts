import { Database } from './database'

export type Blog = Database['public']['Tables']['blogs']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Rating = Database['public']['Tables']['ratings']['Row']