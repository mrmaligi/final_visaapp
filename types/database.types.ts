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
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      visa_types: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          processing_time: string | null
          validity: string | null
          fee: number | null
          country: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          processing_time?: string | null
          validity?: string | null
          fee?: number | null
          country: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          processing_time?: string | null
          validity?: string | null
          fee?: number | null
          country?: string
        }
        Relationships: []
      }
      visa_applications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          visa_type_id: string
          status: string
          intended_date: string | null
          purpose: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          visa_type_id: string
          status?: string
          intended_date?: string | null
          purpose?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          visa_type_id?: string
          status?: string
          intended_date?: string | null
          purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_applications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visa_applications_visa_type_id_fkey"
            columns: ["visa_type_id"]
            referencedRelation: "visa_types"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          created_at: string
          application_id: string
          user_id: string
          name: string
          file_url: string
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          application_id: string
          user_id: string
          name: string
          file_url: string
          type: string
        }
        Update: {
          id?: string
          created_at?: string
          application_id?: string
          user_id?: string
          name?: string
          file_url?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          message: string
          read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          message: string
          read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          message?: string
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
