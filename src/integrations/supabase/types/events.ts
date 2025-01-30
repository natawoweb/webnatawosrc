import { Json } from './shared'

export interface EventsTable {
  Row: {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    is_upcoming: boolean | null
    max_participants: number | null
    current_participants: number | null
    gallery: Json | null
    created_at: string | null
    created_by: string | null
  }
  Insert: {
    id?: string
    title: string
    description: string
    date: string
    time: string
    location: string
    is_upcoming?: boolean | null
    max_participants?: number | null
    current_participants?: number | null
    gallery?: Json | null
    created_at?: string | null
    created_by?: string | null
  }
  Update: {
    id?: string
    title?: string
    description?: string
    date?: string
    time?: string
    location?: string
    is_upcoming?: boolean | null
    max_participants?: number | null
    current_participants?: number | null
    gallery?: Json | null
    created_at?: string | null
    created_by?: string | null
  }
}