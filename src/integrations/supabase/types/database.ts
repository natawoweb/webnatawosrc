export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          blog_id: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          date: string
          description: string
          gallery: Json | null
          id: string
          is_upcoming: boolean | null
          location: string
          max_participants: number | null
          time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          date: string
          description: string
          gallery?: Json | null
          id?: string
          is_upcoming?: boolean | null
          location: string
          max_participants?: number | null
          time: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          date?: string
          description?: string
          gallery?: Json | null
          id?: string
          is_upcoming?: boolean | null
          location?: string
          max_participants?: number | null
          time?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          blog_id: string
          created_at: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      writers: {
        Row: {
          accomplishments: Json | null
          bio: string
          created_at: string
          featured: boolean | null
          featured_month: string | null
          genre: string
          id: string
          image_url: string | null
          name: string
          published_works: Json | null
          social_links: Json | null
        }
        Insert: {
          accomplishments?: Json | null
          bio: string
          created_at?: string
          featured?: boolean | null
          featured_month?: string | null
          genre: string
          id?: string
          image_url?: string | null
          name: string
          published_works?: Json | null
          social_links?: Json | null
        }
        Update: {
          accomplishments?: Json | null
          bio?: string
          created_at?: string
          featured?: boolean | null
          featured_month?: string | null
          genre?: string
          id?: string
          image_url?: string | null
          name?: string
          published_works?: Json | null
          social_links?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "reader" | "writer" | "manager" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
