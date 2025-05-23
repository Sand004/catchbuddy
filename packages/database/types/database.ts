export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_code: string | null
          clicked_at: string | null
          commission: number | null
          conversion_amount: number | null
          converted: boolean | null
          equipment_id: string | null
          id: string
          ip_address: unknown | null
          product_url: string
          shop: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_code?: string | null
          clicked_at?: string | null
          commission?: number | null
          conversion_amount?: number | null
          converted?: boolean | null
          equipment_id?: string | null
          id?: string
          ip_address?: unknown | null
          product_url: string
          shop: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_code?: string | null
          clicked_at?: string | null
          commission?: number | null
          conversion_amount?: number | null
          converted?: boolean | null
          equipment_id?: string | null
          id?: string
          ip_address?: unknown | null
          product_url?: string
          shop?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      catches: {
        Row: {
          bait_used: string | null
          caught_at: string
          created_at: string | null
          depth: number | null
          equipment_used: string[] | null
          id: string
          is_released: boolean | null
          length: number | null
          location: unknown | null
          notes: string | null
          photo_urls: string[] | null
          rating: number | null
          species: string
          success_factors: Json | null
          technique: string | null
          trip_id: string
          updated_at: string | null
          user_id: string
          weather_conditions: Json | null
          weight: number | null
        }
        Insert: {
          bait_used?: string | null
          caught_at: string
          created_at?: string | null
          depth?: number | null
          equipment_used?: string[] | null
          id?: string
          is_released?: boolean | null
          length?: number | null
          location?: unknown | null
          notes?: string | null
          photo_urls?: string[] | null
          rating?: number | null
          species: string
          success_factors?: Json | null
          technique?: string | null
          trip_id: string
          updated_at?: string | null
          user_id: string
          weather_conditions?: Json | null
          weight?: number | null
        }
        Update: {
          bait_used?: string | null
          caught_at?: string
          created_at?: string | null
          depth?: number | null
          equipment_used?: string[] | null
          id?: string
          is_released?: boolean | null
          length?: number | null
          location?: unknown | null
          notes?: string | null
          photo_urls?: string[] | null
          rating?: number | null
          species?: string
          success_factors?: Json | null
          technique?: string | null
          trip_id?: string
          updated_at?: string | null
          user_id?: string
          weather_conditions?: Json | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catches_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "fishing_trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_items: {
        Row: {
          attributes: Json | null
          brand: string | null
          color: string | null
          condition: string | null
          created_at: string | null
          embedding: string | null
          id: string
          image_url: string | null
          is_favorite: boolean | null
          model: string | null
          name: string
          notes: string | null
          purchase_info: Json | null
          size: string | null
          tags: string[] | null
          type: string
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          attributes?: Json | null
          brand?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          model?: string | null
          name: string
          notes?: string | null
          purchase_info?: Json | null
          size?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          attributes?: Json | null
          brand?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          model?: string | null
          name?: string
          notes?: string | null
          purchase_info?: Json | null
          size?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fishing_trips: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          is_public: boolean | null
          location: unknown
          location_name: string
          notes: string | null
          started_at: string
          target_species: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          water_conditions: Json | null
          water_type: string | null
          weather_data: Json | null
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_public?: boolean | null
          location: unknown
          location_name: string
          notes?: string | null
          started_at: string
          target_species?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          water_conditions?: Json | null
          water_type?: string | null
          weather_data?: Json | null
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_public?: boolean | null
          location?: unknown
          location_name?: string
          notes?: string | null
          started_at?: string
          target_species?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          water_conditions?: Json | null
          water_type?: string | null
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fishing_trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          onboarding_completed: boolean | null
          subscription_tier: string | null
          updated_at: string | null
          usage_limits: Json | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          onboarding_completed?: boolean | null
          subscription_tier?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          onboarding_completed?: boolean | null
          subscription_tier?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          confidence_score: number | null
          context: Json
          created_at: string | null
          id: string
          llm_response: Json | null
          reasoning: string
          recommended_items: string[] | null
          success_outcome: boolean | null
          user_feedback: number | null
          user_id: string
          was_used: boolean | null
        }
        Insert: {
          confidence_score?: number | null
          context: Json
          created_at?: string | null
          id?: string
          llm_response?: Json | null
          reasoning: string
          recommended_items?: string[] | null
          success_outcome?: boolean | null
          user_feedback?: number | null
          user_id: string
          was_used?: boolean | null
        }
        Update: {
          confidence_score?: number | null
          context?: Json
          created_at?: string | null
          id?: string
          llm_response?: Json | null
          reasoning?: string
          recommended_items?: string[] | null
          success_outcome?: boolean | null
          user_feedback?: number | null
          user_id?: string
          was_used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          device_info: Json | null
          features_used: string[] | null
          id: string
          pages_visited: number | null
          session_end: string | null
          session_start: string | null
          user_id: string | null
        }
        Insert: {
          device_info?: Json | null
          features_used?: string[] | null
          id?: string
          pages_visited?: number | null
          session_end?: string | null
          session_start?: string | null
          user_id?: string | null
        }
        Update: {
          device_info?: Json | null
          features_used?: string[] | null
          id?: string
          pages_visited?: number | null
          session_end?: string | null
          session_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      search_similar_equipment: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
          user_filter?: string
        }
        Returns: {
          id: string
          name: string
          type: string
          brand: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
