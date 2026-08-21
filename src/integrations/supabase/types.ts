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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      clinical_records: {
        Row: {
          created_at: string
          extraction_model: string | null
          id: string
          interview_id: string
          missing_information: Json
          patient_id: string
          standardized: Json
          structured: Json
          summary: string | null
          uncertainties: Json
        }
        Insert: {
          created_at?: string
          extraction_model?: string | null
          id?: string
          interview_id: string
          missing_information?: Json
          patient_id: string
          standardized?: Json
          structured?: Json
          summary?: string | null
          uncertainties?: Json
        }
        Update: {
          created_at?: string
          extraction_model?: string | null
          id?: string
          interview_id?: string
          missing_information?: Json
          patient_id?: string
          standardized?: Json
          structured?: Json
          summary?: string | null
          uncertainties?: Json
        }
        Relationships: [
          {
            foreignKeyName: "clinical_records_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: true
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_reviews: {
        Row: {
          ai_priority: Database["public"]["Enums"]["triage_priority"] | null
          created_at: string
          decision: Database["public"]["Enums"]["doctor_decision"]
          doctor_id: string
          doctor_priority: Database["public"]["Enums"]["triage_priority"] | null
          id: string
          interview_id: string
          reason: string | null
          requested_information: string | null
        }
        Insert: {
          ai_priority?: Database["public"]["Enums"]["triage_priority"] | null
          created_at?: string
          decision: Database["public"]["Enums"]["doctor_decision"]
          doctor_id: string
          doctor_priority?:
            | Database["public"]["Enums"]["triage_priority"]
            | null
          id?: string
          interview_id: string
          reason?: string | null
          requested_information?: string | null
        }
        Update: {
          ai_priority?: Database["public"]["Enums"]["triage_priority"] | null
          created_at?: string
          decision?: Database["public"]["Enums"]["doctor_decision"]
          doctor_id?: string
          doctor_priority?:
            | Database["public"]["Enums"]["triage_priority"]
            | null
          id?: string
          interview_id?: string
          reason?: string | null
          requested_information?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_reviews_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          audio_duration_seconds: number | null
          audio_path: string | null
          created_at: string
          id: string
          input_mode: string
          is_demo: boolean
          language: string
          patient_id: string
          status: Database["public"]["Enums"]["interview_status"]
          transcript: string | null
          transcript_provider: string | null
          updated_at: string
        }
        Insert: {
          audio_duration_seconds?: number | null
          audio_path?: string | null
          created_at?: string
          id?: string
          input_mode?: string
          is_demo?: boolean
          language: string
          patient_id: string
          status?: Database["public"]["Enums"]["interview_status"]
          transcript?: string | null
          transcript_provider?: string | null
          updated_at?: string
        }
        Update: {
          audio_duration_seconds?: number | null
          audio_path?: string | null
          created_at?: string
          id?: string
          input_mode?: string
          is_demo?: boolean
          language?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["interview_status"]
          transcript?: string | null
          transcript_provider?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_responses: {
        Row: {
          created_at: string
          id: string
          input_type: string
          interview_id: string
          raw_text: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_type: string
          interview_id: string
          raw_text?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_type?: string
          interview_id?: string
          raw_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_responses_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          id: string
          patient_code: string
          profile_id: string
          sex: string | null
          year_of_birth: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          patient_code?: string
          profile_id: string
          sex?: string | null
          year_of_birth?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          patient_code?: string
          profile_id?: string
          sex?: string | null
          year_of_birth?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      triage_assessments: {
        Row: {
          clinical_record_id: string | null
          created_at: string
          evidence: Json
          id: string
          interview_id: string
          model_available: boolean
          model_name: string | null
          model_version: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["triage_priority"] | null
          red_flags: Json
        }
        Insert: {
          clinical_record_id?: string | null
          created_at?: string
          evidence?: Json
          id?: string
          interview_id: string
          model_available?: boolean
          model_name?: string | null
          model_version?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["triage_priority"] | null
          red_flags?: Json
        }
        Update: {
          clinical_record_id?: string | null
          created_at?: string
          evidence?: Json
          id?: string
          interview_id?: string
          model_available?: boolean
          model_name?: string | null
          model_version?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["triage_priority"] | null
          red_flags?: Json
        }
        Relationships: [
          {
            foreignKeyName: "triage_assessments_clinical_record_id_fkey"
            columns: ["clinical_record_id"]
            isOneToOne: false
            referencedRelation: "clinical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "triage_assessments_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: true
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_patient_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
      doctor_decision: "ACCEPT" | "OVERRIDE" | "REQUEST_INFO"
      interview_status:
        | "DRAFT"
        | "TRANSCRIBED"
        | "EXTRACTED"
        | "TRIAGED"
        | "SUBMITTED"
        | "REVIEWED"
        | "INFO_REQUESTED"
      triage_priority: "RED" | "AMBER" | "GREEN"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "doctor", "admin"],
      doctor_decision: ["ACCEPT", "OVERRIDE", "REQUEST_INFO"],
      interview_status: [
        "DRAFT",
        "TRANSCRIBED",
        "EXTRACTED",
        "TRIAGED",
        "SUBMITTED",
        "REVIEWED",
        "INFO_REQUESTED",
      ],
      triage_priority: ["RED", "AMBER", "GREEN"],
    },
  },
} as const
