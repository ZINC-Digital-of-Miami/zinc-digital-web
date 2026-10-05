export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_cache: {
        Row: {
          fetched_at: string
          key: string
          value: Json
        }
        Insert: {
          fetched_at?: string
          key: string
          value: Json
        }
        Update: {
          fetched_at?: string
          key?: string
          value?: Json
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          archived_at: string | null
          budget: string | null
          client_hash: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          next_step: string | null
          notes: string | null
          notified_at: string | null
          notify_attempts: number
          notify_error: string | null
          notify_status: string
          services: string[] | null
          source_path: string | null
          stage: string
          timeline: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          archived_at?: string | null
          budget?: string | null
          client_hash?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          next_step?: string | null
          notes?: string | null
          notified_at?: string | null
          notify_attempts?: number
          notify_error?: string | null
          notify_status?: string
          services?: string[] | null
          source_path?: string | null
          stage?: string
          timeline?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          archived_at?: string | null
          budget?: string | null
          client_hash?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          next_step?: string | null
          notes?: string | null
          notified_at?: string | null
          notify_attempts?: number
          notify_error?: string | null
          notify_status?: string
          services?: string[] | null
          source_path?: string | null
          stage?: string
          timeline?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      inquiry_events: {
        Row: {
          actor: string | null
          created_at: string
          id: number
          inquiry_id: string
          kind: string
          payload: Json
        }
        Insert: {
          actor?: string | null
          created_at?: string
          id?: never
          inquiry_id: string
          kind: string
          payload?: Json
        }
        Update: {
          actor?: string | null
          created_at?: string
          id?: never
          inquiry_id?: string
          kind?: string
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_events_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiry_events_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiry_board"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          canonical: string | null
          content: Json
          created_at: string
          focus_keyword: string | null
          id: string
          live: Json | null
          live_at: string | null
          meta_description: string | null
          meta_title: string | null
          noindex: boolean
          path: string
          status: string
          template: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical?: string | null
          content?: Json
          created_at?: string
          focus_keyword?: string | null
          id?: string
          live?: Json | null
          live_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          path: string
          status?: string
          template: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical?: string | null
          content?: Json
          created_at?: string
          focus_keyword?: string | null
          id?: string
          live?: Json | null
          live_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          path?: string
          status?: string
          template?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string | null
          body: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          focus_keyword: string | null
          id: string
          layer: string | null
          live: Json | null
          live_at: string | null
          meta_description: string | null
          meta_title: string | null
          noindex: boolean
          origin: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author?: string | null
          body?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          focus_keyword?: string | null
          id?: string
          layer?: string | null
          live?: Json | null
          live_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          origin?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author?: string | null
          body?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          focus_keyword?: string | null
          id?: string
          layer?: string | null
          live?: Json | null
          live_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          origin?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      seo_audits: {
        Row: {
          created_at: string
          id: string
          issues: Json
          score: number | null
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          issues?: Json
          score?: number | null
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          issues?: Json
          score?: number | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string
          name: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          name?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          name?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      stats_daily: {
        Row: {
          clicks: number | null
          conversions: number | null
          ctr: number | null
          day: string
          impressions: number | null
          path: string
          position: number | null
          sessions: number | null
          source: string
          users: number | null
        }
        Insert: {
          clicks?: number | null
          conversions?: number | null
          ctr?: number | null
          day: string
          impressions?: number | null
          path?: string
          position?: number | null
          sessions?: number | null
          source: string
          users?: number | null
        }
        Update: {
          clicks?: number | null
          conversions?: number | null
          ctr?: number | null
          day?: string
          impressions?: number | null
          path?: string
          position?: number | null
          sessions?: number | null
          source?: string
          users?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      inquiry_board: {
        Row: {
          archived_at: string | null
          budget: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string | null
          message: string | null
          name: string | null
          next_step: string | null
          notes: string | null
          notify_status: string | null
          services: string[] | null
          source_path: string | null
          stage: string | null
          timeline: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          archived_at?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
          next_step?: string | null
          notes?: string | null
          notify_status?: string | null
          services?: string[] | null
          source_path?: string | null
          stage?: string | null
          timeline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          archived_at?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
          next_step?: string | null
          notes?: string | null
          notify_status?: string | null
          services?: string[] | null
          source_path?: string | null
          stage?: string | null
          timeline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      publish_all: { Args: { p_actor: string }; Returns: number }
      staff_role: { Args: never; Returns: string }
      submit_inquiry: {
        Args: {
          p_client_hash: string
          p_day: number
          p_day_secs: number
          p_inquiry: Json
          p_short: number
          p_short_secs: number
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  research: {
    Tables: {
      chats: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          model: string | null
          project_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          model?: string | null
          project_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          model?: string | null
          project_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chunks: {
        Row: {
          content: string
          document_id: string
          embedding: string | null
          id: number
          idx: number
        }
        Insert: {
          content: string
          document_id: string
          embedding?: string | null
          id?: never
          idx: number
        }
        Update: {
          content?: string
          document_id?: string
          embedding?: string | null
          id?: never
          idx?: number
        }
        Relationships: [
          {
            foreignKeyName: "chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          kind: string
          meta: Json
          project_id: string | null
          source_url: string | null
          status: string
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          meta?: Json
          project_id?: string | null
          source_url?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          meta?: Json
          project_id?: string | null
          source_url?: string | null
          status?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: number
          model: string | null
          role: string
          sources: Json
          status: string
          tokens_in: number | null
          tokens_out: number | null
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: never
          model?: string | null
          role: string
          sources?: Json
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: never
          model?: string | null
          role?: string
          sources?: Json
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          notes: string | null
        }
        Insert: {
          client?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          notes?: string | null
        }
        Update: {
          client?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_chunks: {
        Args: {
          match_count?: number
          p_project?: string
          query_embedding: string
        }
        Returns: {
          content: string
          document_id: string
          id: number
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
  research: {
    Enums: {},
  },
} as const
