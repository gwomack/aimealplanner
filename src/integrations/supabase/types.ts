export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_meal_plan_ingredients: {
        Row: {
          created_at: string
          daily_meal_plan_id: string
          ingredient_id: string
        }
        Insert: {
          created_at?: string
          daily_meal_plan_id: string
          ingredient_id: string
        }
        Update: {
          created_at?: string
          daily_meal_plan_id?: string
          ingredient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_meal_plan_ingredients_daily_meal_plan_id_fkey"
            columns: ["daily_meal_plan_id"]
            isOneToOne: false
            referencedRelation: "daily_meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_meal_plan_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_meal_plans: {
        Row: {
          breakfast: Json | null
          created_at: string
          daily_calorie_target: number | null
          day_of_week: string
          dinner: Json | null
          id: string
          lunch: Json | null
          nutritional_notes: Json | null
          snacks: Json | null
          weekly_plan_id: string
        }
        Insert: {
          breakfast?: Json | null
          created_at?: string
          daily_calorie_target?: number | null
          day_of_week: string
          dinner?: Json | null
          id?: string
          lunch?: Json | null
          nutritional_notes?: Json | null
          snacks?: Json | null
          weekly_plan_id: string
        }
        Update: {
          breakfast?: Json | null
          created_at?: string
          daily_calorie_target?: number | null
          day_of_week?: string
          dinner?: Json | null
          id?: string
          lunch?: Json | null
          nutritional_notes?: Json | null
          snacks?: Json | null
          weekly_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_meal_plans_weekly_plan_id_fkey"
            columns: ["weekly_plan_id"]
            isOneToOne: false
            referencedRelation: "weekly_meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      dietary_restrictions: {
        Row: {
          created_at: string | null
          id: string
          restriction: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          restriction: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          restriction?: string
          user_id?: string
        }
        Relationships: []
      }
      excluded_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "excluded_ingredients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      ingredients_tags: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      ingredients_to_tags: {
        Row: {
          ingredient_id: string
          tag_id: string
        }
        Insert: {
          ingredient_id: string
          tag_id: string
        }
        Update: {
          ingredient_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_to_tags_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredients_to_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "ingredients_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_preferences: {
        Row: {
          activity_level: string | null
          cooking_skill: string | null
          created_at: string
          diet_type: string | null
          health_goal: string | null
          id: string
          meals_per_day: number | null
          selected_day: string | null
          user_id: string
        }
        Insert: {
          activity_level?: string | null
          cooking_skill?: string | null
          created_at?: string
          diet_type?: string | null
          health_goal?: string | null
          id?: string
          meals_per_day?: number | null
          selected_day?: string | null
          user_id: string
        }
        Update: {
          activity_level?: string | null
          cooking_skill?: string | null
          created_at?: string
          diet_type?: string | null
          health_goal?: string | null
          id?: string
          meals_per_day?: number | null
          selected_day?: string | null
          user_id?: string
        }
        Relationships: []
      }
      personal_information: {
        Row: {
          age: number | null
          created_at: string
          height: number | null
          id: string
          sex: string | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          height?: number | null
          id?: string
          sex?: string | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          height?: number | null
          id?: string
          sex?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      weekly_meal_plan_ingredients: {
        Row: {
          created_at: string
          ingredient_id: string
          weekly_plan_id: string
        }
        Insert: {
          created_at?: string
          ingredient_id: string
          weekly_plan_id: string
        }
        Update: {
          created_at?: string
          ingredient_id?: string
          weekly_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_meal_plan_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_meal_plan_ingredients_weekly_plan_id_fkey"
            columns: ["weekly_plan_id"]
            isOneToOne: false
            referencedRelation: "weekly_meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_meal_plans: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
