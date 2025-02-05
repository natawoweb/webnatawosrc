import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Writer = Database['public']['Tables']['writers']['Row']
export type AppRole = Database['public']['Enums']['app_role']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type UserLevel = Database['public']['Enums']['user_level']
export type Event = Database['public']['Tables']['events']['Row']
export type EventRegistration = Database['public']['Tables']['event_registrations']['Row']
export type EventAttendance = Database['public']['Tables']['event_attendance']['Row']
export type EventComment = Database['public']['Tables']['event_comments']['Row']
export type EventNotification = Database['public']['Tables']['event_notifications']['Row']
export type EventCategory = Database['public']['Tables']['event_categories']['Row']
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row']