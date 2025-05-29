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
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          muscle_group: string
          difficulty: string
          type: string | null
          equipment: string | null
          thumbnail_url: string | null
          video_url: string | null
          proper_form: string | null
          common_mistakes: string | null
          tips: string | null
          title: string | null
          instructions: string[] | null
          duration: string | null
          primary_muscles: string[] | null
          secondary_muscles: string[] | null
          created_at: string | null
          equipment_id: string | null
        }
        Insert: {
          id?: string
          name: string
          muscle_group: string
          difficulty: string
          type?: string | null
          equipment?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
          proper_form?: string | null
          common_mistakes?: string | null
          tips?: string | null
          title?: string | null
          instructions?: string[] | null
          duration?: string | null
          primary_muscles?: string[] | null
          secondary_muscles?: string[] | null
          created_at?: string | null
          equipment_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          muscle_group?: string
          difficulty?: string
          type?: string | null
          equipment?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
          proper_form?: string | null
          common_mistakes?: string | null
          tips?: string | null
          title?: string | null
          instructions?: string[] | null
          duration?: string | null
          primary_muscles?: string[] | null
          secondary_muscles?: string[] | null
          created_at?: string | null
          equipment_id?: string | null
        }
      }
      workouts: {
        Row: {
          id: string
          name: string
          duration: number
          completed_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          duration: number
          completed_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          duration?: number
          completed_at?: string | null
          user_id?: string | null
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string | null
          exercise_id: string | null
          sets: number | null
          reps: number | null
          duration: number | null
        }
        Insert: {
          id?: string
          workout_id?: string | null
          exercise_id?: string | null
          sets?: number | null
          reps?: number | null
          duration?: number | null
        }
        Update: {
          id?: string
          workout_id?: string | null
          exercise_id?: string | null
          sets?: number | null
          reps?: number | null
          duration?: number | null
        }
      }
      equipment: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          category: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          category: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          category?: string
          created_at?: string | null
          updated_at?: string | null
        }
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
  }
}