import { createClient } from "@/lib/supabase/client";
import { Lawyer } from "@/types";

export async function getLawyers(filters?: {
  verifiedOnly?: boolean;
  acceptingNewClients?: boolean;
  language?: string;
}): Promise<{ data: Lawyer[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("lawyers")
      .select("*")
      .order("average_rating", { ascending: false });

    if (filters?.verifiedOnly) {
      query = query.eq("verification_status", "approved");
    }

    if (filters?.acceptingNewClients) {
      query = query.eq("accepts_new_clients", true);
    }

    if (filters?.language) {
      query = query.contains("languages", [filters.language]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching lawyers:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Lawyer[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching lawyers:", err);
    return { data: null, error: err as Error };
  }
}

export async function getLawyerById(id: string): Promise<{ data: Lawyer | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lawyer:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Lawyer, error: null };
  } catch (err) {
    console.error("Unexpected error fetching lawyer:", err);
    return { data: null, error: err as Error };
  }
}

export async function getLawyerReviews(lawyerId: string): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        user:users(display_name, profile_picture_url)
      `)
      .eq("lawyer_id", lawyerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching reviews:", err);
    return { data: null, error: err as Error };
  }
}
