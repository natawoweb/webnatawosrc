export interface EventsTable {
  Row: {
    id: string
    title: string
    description: string | null
    date: string
    time: string
    location: string
    is_upcoming: boolean
    max_participants: number | null
    current_participants: number
    gallery: any | null
    created_at: string
    created_by: string | null
  }
  Insert: {
    id?: string
    title: string
    description?: string | null
    date: string
    time: string
    location: string
    is_upcoming?: boolean
    max_participants?: number | null
    current_participants?: number
    gallery?: any | null
    created_at?: string
    created_by?: string | null
  }
  Update: {
    id?: string
    title?: string
    description?: string | null
    date?: string
    time?: string
    location?: string
    is_upcoming?: boolean
    max_participants?: number | null
    current_participants?: number
    gallery?: any | null
    created_at?: string
    created_by?: string | null
  }
}

export interface EventRegistrationsTable {
  Row: {
    id: string
    event_id: string
    user_id: string
    created_at: string
  }
  Insert: {
    id?: string
    event_id: string
    user_id: string
    created_at?: string
  }
  Update: {
    id?: string
    event_id?: string
    user_id?: string
    created_at?: string
  }
}

export interface EventAttendanceTable {
  Row: {
    id: string
    event_id: string
    user_id: string
    created_at: string
  }
  Insert: {
    id?: string
    event_id: string
    user_id: string
    created_at?: string
  }
  Update: {
    id?: string
    event_id?: string
    user_id?: string
    created_at?: string
  }
}

export interface EventCommentsTable {
  Row: {
    id: string
    event_id: string
    user_id: string
    content: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    event_id: string
    user_id: string
    content: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    event_id?: string
    user_id?: string
    content?: string
    created_at?: string
    updated_at?: string
  }
}

export interface EventNotificationsTable {
  Row: {
    id: string
    user_id: string
    message: string
    is_read: boolean
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    message: string
    is_read?: boolean
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    message?: string
    is_read?: boolean
    created_at?: string
  }
}

export interface EventCategoriesTable {
  Row: {
    id: string
    name: string
    created_at: string
  }
  Insert: {
    id?: string
    name: string
    created_at?: string
  }
  Update: {
    id?: string
    name?: string
    created_at?: string
  }
}