import { BlogsTable, CommentsTable, RatingsTable } from './content'
import { EventsTable, EventRegistrationsTable, EventAttendanceTable, EventCommentsTable, EventNotificationsTable, EventCategoriesTable } from './events'
import { WritersTable } from './writers'
import { ProfilesTable, UserRolesTable } from './auth'
import { BlogCategoriesTable } from './content'

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable
      user_roles: UserRolesTable
      blogs: BlogsTable
      blog_comments: CommentsTable
      blog_ratings: RatingsTable
      blog_categories: BlogCategoriesTable
      events: EventsTable
      event_registrations: EventRegistrationsTable
      event_attendance: EventAttendanceTable
      event_comments: EventCommentsTable
      event_notifications: EventNotificationsTable
      event_categories: EventCategoriesTable
      writers: WritersTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: HasRoleFunction
      register_for_event: RegisterForEventFunction
      unregister_from_event: UnregisterFromEventFunction
    }
    Enums: {
      app_role: "reader" | "writer" | "manager" | "admin"
      user_level: "Literary Tamil Writers" | "Talented Experts" | "NATAWO Volunteers" | "NATAWO Students Writers" | "Subscriber" | "Technical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

interface HasRoleFunction {
  Args: {
    user_id: string
    required_role: Database["public"]["Enums"]["app_role"]
  }
  Returns: boolean
}

interface RegisterForEventFunction {
  Args: {
    p_event_id: string
    p_user_id: string
  }
  Returns: boolean
}

interface UnregisterFromEventFunction {
  Args: {
    p_event_id: string
    p_user_id: string
  }
  Returns: boolean
}