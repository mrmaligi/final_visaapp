import { createClient } from "@supabase/supabase-js";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface TrackerEntry {
  id: string;
  visa_id: string;
  lodged_date: string;
  decision_date: string | null;
  processing_days: number;
  outcome: string;
  location: string;
  notes: string;
  is_anonymous: boolean;
  created_at: string;
  visa: {
    name: string;
    subclass: string;
  } | null;
}

export async function getNewsArticles(limit = 10): Promise<{ data: NewsArticle[] | null; error: Error | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
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

    return { data: data as unknown as NewsArticle[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching news:", err);
    return { data: null, error: err as Error };
  }
}

export async function getNewsById(id: string): Promise<{ data: NewsArticle | null; error: Error | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching news article:", error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as unknown as NewsArticle, error: null };
  } catch (err) {
    console.error("Unexpected error fetching news article:", err);
    return { data: null, error: err as Error };
  }
}

export async function getTrackerData(): Promise<{ data: TrackerEntry[] | null; error: Error | null }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
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

    return { data: data as unknown as TrackerEntry[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching tracker data:", err);
    return { data: null, error: err as Error };
  }
}
