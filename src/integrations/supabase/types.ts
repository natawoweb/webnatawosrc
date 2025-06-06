export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        subscribe: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_comment_reactions: {
        Row: {
          comment_id: string | null;
          created_at: string | null;
          id: string;
          reaction_type: string;
          user_id: string | null;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string | null;
          id?: string;
          reaction_type: string;
          user_id?: string | null;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string | null;
          id?: string;
          reaction_type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_comment_reactions_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'blog_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_comment_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      blog_comments: {
        Row: {
          blog_id: string | null;
          content: string;
          created_at: string | null;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          blog_id?: string | null;
          content: string;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          blog_id?: string | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_comments_blog_id_fkey';
            columns: ['blog_id'];
            isOneToOne: false;
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      blog_ratings: {
        Row: {
          blog_id: string | null;
          created_at: string | null;
          id: string;
          rating: number;
          user_id: string | null;
        };
        Insert: {
          blog_id?: string | null;
          created_at?: string | null;
          id?: string;
          rating: number;
          user_id?: string | null;
        };
        Update: {
          blog_id?: string | null;
          created_at?: string | null;
          id?: string;
          rating?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_ratings_blog_id_fkey';
            columns: ['blog_id'];
            isOneToOne: false;
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_ratings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      blogs: {
        Row: {
          author_id: string | null;
          category_id: string | null;
          content: string;
          content_tamil: Json | null;
          cover_image: string | null;
          created_at: string | null;
          featured: boolean | null;
          featured_month: string | null;
          id: string;
          published_at: string | null;
          rejection_reason: string | null;
          status: Database['public']['Enums']['blog_status'] | null;
          title: string;
          title_tamil: string | null;
          updated_at: string | null;
          views_count: number | null;
        };
        Insert: {
          author_id?: string | null;
          category_id?: string | null;
          content: string;
          content_tamil?: Json | null;
          cover_image?: string | null;
          created_at?: string | null;
          featured?: boolean | null;
          featured_month?: string | null;
          id?: string;
          published_at?: string | null;
          rejection_reason?: string | null;
          status?: Database['public']['Enums']['blog_status'] | null;
          title: string;
          title_tamil?: string | null;
          updated_at?: string | null;
          views_count?: number | null;
        };
        Update: {
          author_id?: string | null;
          category_id?: string | null;
          content?: string;
          content_tamil?: Json | null;
          cover_image?: string | null;
          created_at?: string | null;
          featured?: boolean | null;
          featured_month?: string | null;
          id?: string;
          published_at?: string | null;
          rejection_reason?: string | null;
          status?: Database['public']['Enums']['blog_status'] | null;
          title?: string;
          title_tamil?: string | null;
          updated_at?: string | null;
          views_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blogs_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blogs_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'blog_categories';
            referencedColumns: ['id'];
          }
        ];
      };
      comments: {
        Row: {
          blog_id: string | null;
          content: string;
          created_at: string | null;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          blog_id?: string | null;
          content: string;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          blog_id?: string | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_blog_id_fkey';
            columns: ['blog_id'];
            isOneToOne: false;
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      contact_submissions: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          status: string | null;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          status?: string | null;
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: string | null;
          subject?: string;
        };
        Relationships: [];
      };
      event_categories: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      event_comment_reactions: {
        Row: {
          comment_id: string | null;
          created_at: string | null;
          id: string;
          type: string;
          user_id: string | null;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string | null;
          id?: string;
          type: string;
          user_id?: string | null;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string | null;
          id?: string;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_comment_reactions_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'event_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_comment_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      event_comments: {
        Row: {
          content: string;
          created_at: string | null;
          event_id: string | null;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_comments_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      event_notifications: {
        Row: {
          created_at: string | null;
          event_id: string | null;
          id: string;
          message: string;
          read: boolean | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          message: string;
          read?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          message?: string;
          read?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_notifications_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      event_participants: {
        Row: {
          email: string;
          event_id: string | null;
          full_name: string;
          id: string;
          level: string | null;
          registration_date: string | null;
          user_id: string;
        };
        Insert: {
          email: string;
          event_id?: string | null;
          full_name: string;
          id?: string;
          level?: string | null;
          registration_date?: string | null;
          user_id: string;
        };
        Update: {
          email?: string;
          event_id?: string | null;
          full_name?: string;
          id?: string;
          level?: string | null;
          registration_date?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_participants_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      event_ratings: {
        Row: {
          created_at: string | null;
          event_id: string | null;
          id: string;
          rating: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          rating: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          rating?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_ratings_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_ratings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      event_registrations: {
        Row: {
          created_at: string | null;
          event_id: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'event_registrations_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_event_registrations_profiles';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      events: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          created_by: string | null;
          current_participants: number | null;
          date: string;
          description: string;
          gallery: string[] | null;
          id: string;
          is_upcoming: boolean | null;
          location: string;
          max_participants: number | null;
          tags: string[] | null;
          time: string;
          title: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          current_participants?: number | null;
          date: string;
          description: string;
          gallery?: string[] | null;
          id?: string;
          is_upcoming?: boolean | null;
          location: string;
          max_participants?: number | null;
          tags?: string[] | null;
          time: string;
          title: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          current_participants?: number | null;
          date?: string;
          description?: string;
          gallery?: string[] | null;
          id?: string;
          is_upcoming?: boolean | null;
          location?: string;
          max_participants?: number | null;
          tags?: string[] | null;
          time?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'events_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'event_categories';
            referencedColumns: ['id'];
          }
        ];
      };
      events_registrations: {
        Row: {
          created_at: string | null;
          event_id: string | null;
          id: string;
          status: Database['public']['Enums']['registration_status'] | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          status?: Database['public']['Enums']['registration_status'] | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_id?: string | null;
          id?: string;
          status?: Database['public']['Enums']['registration_status'] | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'events_registrations_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_registrations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          approval_status: Database['public']['Enums']['writer_status'] | null;
          avatar_url: string | null;
          bio: string | null;
          county: string | null;
          created_at: string | null;
          date_of_birth: string | null;
          email: string | null;
          full_name: string | null;
          gender: string | null;
          id: string;
          level: string | null;
          location: string | null;
          pseudonym: string | null;
          social_links: Json | null;
          state: string | null;
          status: string | null;
          updated_at: string | null;
          user_type: string;
        };
        Insert: {
          approval_status?: Database['public']['Enums']['writer_status'] | null;
          avatar_url?: string | null;
          bio?: string | null;
          county?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id: string;
          level?: string | null;
          location?: string | null;
          pseudonym?: string | null;
          social_links?: Json | null;
          state?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_type: string;
        };
        Update: {
          approval_status?: Database['public']['Enums']['writer_status'] | null;
          avatar_url?: string | null;
          bio?: string | null;
          county?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          level?: string | null;
          location?: string | null;
          pseudonym?: string | null;
          social_links?: Json | null;
          state?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_type?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          blog_id: string | null;
          created_at: string | null;
          id: string;
          rating: number;
          user_id: string | null;
        };
        Insert: {
          blog_id?: string | null;
          created_at?: string | null;
          id?: string;
          rating: number;
          user_id?: string | null;
        };
        Update: {
          blog_id?: string | null;
          created_at?: string | null;
          id?: string;
          rating?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ratings_blog_id_fkey';
            columns: ['blog_id'];
            isOneToOne: false;
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ratings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role: Database['public']['Enums']['app_role'];
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string | null;
        };
        Relationships: [];
      };
      writers: {
        Row: {
          accomplishments: Json | null;
          bio: string;
          created_at: string | null;
          featured: boolean | null;
          featured_month: string | null;
          genre: string;
          id: string;
          image_url: string | null;
          name: string;
          published_works: Json | null;
          social_links: Json | null;
        };
        Insert: {
          accomplishments?: Json | null;
          bio: string;
          created_at?: string | null;
          featured?: boolean | null;
          featured_month?: string | null;
          genre: string;
          id?: string;
          image_url?: string | null;
          name: string;
          published_works?: Json | null;
          social_links?: Json | null;
        };
        Update: {
          accomplishments?: Json | null;
          bio?: string;
          created_at?: string | null;
          featured?: boolean | null;
          featured_month?: string | null;
          genre?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          published_works?: Json | null;
          social_links?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'writers_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_user_with_role: {
        Args: {
          user_id: string;
          user_email: string;
          user_role: Database['public']['Enums']['app_role'];
        };
        Returns: undefined;
      };
      get_current_time: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      has_role:
        | {
            Args: {
              required_role: Database['public']['Enums']['app_role'];
            };
            Returns: boolean;
          }
        | {
            Args: {
              user_id: string;
              required_role: Database['public']['Enums']['app_role'];
            };
            Returns: boolean;
          };
      increment_blog_views: {
        Args: {
          blog_id: string;
        };
        Returns: undefined;
      };
      is_admin:
        | {
            Args: Record<PropertyKey, never>;
            Returns: boolean;
          }
        | {
            Args: {
              user_id: string;
            };
            Returns: boolean;
          };
      is_valid_uuid: {
        Args: {
          str: string;
        };
        Returns: boolean;
      };
      register_for_event: {
        Args: {
          p_event_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      set_is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      unregister_from_event: {
        Args: {
          p_event_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      update_all_event_statuses: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      app_role: 'reader' | 'writer' | 'manager' | 'admin';
      blog_status:
        | 'draft'
        | 'pending_approval'
        | 'approved'
        | 'rejected'
        | 'published';
      registration_status: 'pending' | 'approved' | 'rejected';
      user_level:
        | 'Literary Tamil Writers'
        | 'Talented Experts'
        | 'NATAWO Volunteers'
        | 'NATAWO Students Writers'
        | 'Subscriber'
        | 'Technical';
      writer_status: 'pending' | 'approved' | 'rejected';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;
