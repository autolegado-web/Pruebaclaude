/**
 * Reflejo a mano de supabase/migrations/0001_init.sql.
 *
 * En un proyecto real esto se genera con:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 * Se escribe a mano aquí porque este entorno no tiene acceso a un proyecto
 * Supabase real desde el que generarlo.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      cars: {
        Row: {
          id: string;
          slug: string;
          brand: string;
          model: string;
          version: string;
          year: number;
          price: number;
          previous_price: number | null;
          mileage: number;
          fuel: string;
          transmission: string;
          power: number;
          body_type: string;
          doors: number;
          seats: number;
          drivetrain: string;
          color: string;
          location: string;
          description: string;
          features: string[];
          environmental_label: string;
          verified: boolean;
          warranty_months: number;
          financing_down_payment: number | null;
          financing_months: number;
          financing_apr: number;
          sold: boolean;
          listed_at: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["cars"]["Row"]> & {
          slug: string;
          brand: string;
          model: string;
          version: string;
          year: number;
          price: number;
          mileage: number;
          fuel: string;
          transmission: string;
          power: number;
          body_type: string;
          doors: number;
          seats: number;
          drivetrain: string;
          color: string;
          location: string;
          environmental_label: string;
        };
        Update: Partial<Database["public"]["Tables"]["cars"]["Row"]>;
        Relationships: [];
      };
      car_images: {
        Row: { id: string; car_id: string; url: string; alt: string; position: number };
        Insert: Partial<Database["public"]["Tables"]["car_images"]["Row"]> & { car_id: string; url: string };
        Update: Partial<Database["public"]["Tables"]["car_images"]["Row"]>;
        Relationships: [];
      };
      favorites: {
        Row: { user_id: string; car_id: string; created_at: string };
        Insert: { user_id: string; car_id: string };
        Update: never;
        Relationships: [];
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          filters: Record<string, unknown>;
          notify_email: boolean;
          notify_push: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["saved_searches"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["saved_searches"]["Row"]>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          car_id: string | null;
          user_id: string | null;
          kind: "info" | "comprar" | "reservar" | "general";
          name: string;
          email: string;
          phone: string | null;
          message: string | null;
          status: "nueva" | "en_proceso" | "cerrada";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inquiries"]["Row"]> & {
          kind: "info" | "comprar" | "reservar" | "general";
          name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
        Relationships: [];
      };
      sell_requests: {
        Row: {
          id: string;
          user_id: string | null;
          brand: string;
          model: string;
          version: string | null;
          year: number;
          mileage: number;
          plate: string | null;
          fuel: string;
          transmission: string;
          condition: string;
          notes: string | null;
          contact_name: string;
          contact_email: string;
          contact_phone: string | null;
          status: "recibida" | "valorada" | "aceptada" | "rechazada" | "cerrada";
          valuation_min: number | null;
          valuation_max: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sell_requests"]["Row"]> & {
          brand: string;
          model: string;
          year: number;
          mileage: number;
          fuel: string;
          transmission: string;
          contact_name: string;
          contact_email: string;
        };
        Update: Partial<Database["public"]["Tables"]["sell_requests"]["Row"]>;
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          car_id: string;
          user_id: string | null;
          status: "pendiente" | "confirmada" | "cancelada" | "completada";
          deposit_amount: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reservations"]["Row"]> & { car_id: string };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Row"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          inquiry_id: string | null;
          reservation_id: string | null;
          sender_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["messages"]["Row"]> & { body: string };
        Update: never;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          car_id: string | null;
          rating: number;
          comment: string | null;
          published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & { user_id: string; rating: number };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
