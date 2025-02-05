export interface WritersTable {
  Row: {
    id: string
    name: string
    bio: string | null
    genre: string | null
    image_url: string | null
    social_links: any | null
    featured: boolean
    featured_month: string | null
    created_at: string
    accomplishments: any | null
    published_works: any | null
  }
  Insert: {
    id?: string
    name: string
    bio?: string | null
    genre?: string | null
    image_url?: string | null
    social_links?: any | null
    featured?: boolean
    featured_month?: string | null
    created_at?: string
    accomplishments?: any | null
    published_works?: any | null
  }
  Update: {
    id?: string
    name?: string
    bio?: string | null
    genre?: string | null
    image_url?: string | null
    social_links?: any | null
    featured?: boolean
    featured_month?: string | null
    created_at?: string
    accomplishments?: any | null
    published_works?: any | null
  }
}