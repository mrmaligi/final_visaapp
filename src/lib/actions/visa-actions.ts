import { createClient } from "@/lib/supabase/client";
import { Visa } from "@/types";

export async function getVisas(category?: string): Promise<{ data: Visa[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("visas")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching visas:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Visa[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching visas:", err);
    return { data: null, error: err as Error };
  }
}

export async function getVisaById(id: string): Promise<{ data: Visa | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("visas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching visa:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Visa, error: null };
  } catch (err) {
    console.error("Unexpected error fetching visa:", err);
    return { data: null, error: err as Error };
  }
}

export async function getUserApplications(userId: string): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("visa_purchases")
      .select(`
        *,
        visa:visas(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching applications:", err);
    return { data: null, error: err as Error };
  }
}

export async function getUserConsultations(userId: string): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("consultations")
      .select(`
        *,
        lawyer:lawyers(*)
      `)
      .eq("user_id", userId)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching consultations:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching consultations:", err);
    return { data: null, error: err as Error };
  }
}
