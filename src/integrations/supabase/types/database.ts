import { BlogsTable, CommentsTable, RatingsTable } from './content'
import { EventsTable } from './events'
import { WritersTable } from './writers'
import { ProfilesTable, UserRolesTable } from './auth'

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable
      user_roles: UserRolesTable
      blogs: BlogsTable
      comments: CommentsTable
      events: EventsTable
      ratings: RatingsTable
      writers: WritersTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: HasRoleFunction
    }
    Enums: {
      app_role: "reader" | "writer" | "manager" | "admin"
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