import { createClient } from "@/lib/supabase/client";

export async function getNewsArticles(limit = 10): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching news:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching news:", err);
    return { data: null, error: err as Error };
  }
}

export async function getNewsById(id: string): Promise<{ data: any | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching news article:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching news article:", err);
    return { data: null, error: err as Error };
  }
}

export async function getTrackerData(): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracker_entries")
      .select(`
        *,
        visa:visas(name, subclass)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching tracker data:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching tracker data:", err);
    return { data: null, error: err as Error };
  }
}
