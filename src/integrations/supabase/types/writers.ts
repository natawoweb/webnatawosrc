
import { Json } from './shared'

export interface WritersTable {
  Row: {
    id: string
    name: string
    bio: string
    genre: string
    image_url: string | null
    social_links: Json | null
    featured: boolean | null
    featured_month: string | null
    created_at: string
    accomplishments: Json | null
    published_works: Json | null
  }
  Insert: {
    id?: string
    name: string
    bio: string
    genre: string
    image_url?: string | null
    social_links?: Json | null
    featured?: boolean | null
    featured_month?: string | null
    created_at?: string
    accomplishments?: Json | null
    published_works?: Json | null
  }
  Update: {
    id?: string
    name?: string
    bio?: string
    genre?: string
    image_url?: string | null
    social_links?: Json | null
    featured?: boolean | null
    featured_month?: string | null
    created_at?: string
    accomplishments?: Json | null
    published_works?: Json | null
  }
}
