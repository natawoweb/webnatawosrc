export interface BlogCategoriesTable {
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

export interface BlogsTable {
  Row: {
    id: string
    title: string
    content: string
    author_id: string
    status: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    title: string
    content: string
    author_id: string
    status?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    title?: string
    content?: string
    author_id?: string
    status?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}

export interface CommentsTable {
  Row: {
    id: string
    blog_id: string
    user_id: string
    content: string
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    blog_id: string
    user_id: string
    content: string
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    blog_id?: string
    user_id?: string
    content?: string
    created_at?: string | null
    updated_at?: string | null
  }
}

export interface RatingsTable {
  Row: {
    id: string
    blog_id: string
    user_id: string
    rating: number
    created_at: string | null
  }
  Insert: {
    id?: string
    blog_id: string
    user_id: string
    rating: number
    created_at?: string | null
  }
  Update: {
    id?: string
    blog_id?: string
    user_id?: string
    rating?: number
    created_at?: string | null
  }
}
