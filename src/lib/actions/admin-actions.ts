'use server';

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Types
export interface Visa {
  id: string;
  subclass: string;
  name: string;
  category: 'work' | 'student' | 'family' | 'visitor' | 'business' | 'protection';
  short_description: string;
  full_description?: string;
  requirements?: string;
  official_link?: string;
  application_fee: number;
  processing_time_min_days?: number;
  processing_time_max_days?: number;
  is_active: boolean;
  is_premium: boolean;
  premium_price?: number;
  total_purchases?: number;
  average_rating?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
}

export interface LawyerApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  firm_name?: string;
  registration_number: string;
  years_experience?: number;
  bio?: string;
  profile_photo_url?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  average_rating: number;
  total_consultations: number;
  total_reviews: number;
  languages: string[];
  accepts_new_clients: boolean;
  created_at: string;
  updated_at: string;
  verification_documents?: {
    id: string;
    document_type: string;
    document_url: string;
    uploaded_at: string;
  }[];
}

export interface User {
  id: string;
  email: string;
  display_name?: string;
  profile_picture_url?: string;
  role: 'user' | 'lawyer' | 'admin';
  email_verified: boolean;
  is_admin: boolean;
  status: 'active' | 'suspended';
  created_at: string;
  last_sign_in_at?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
  category?: string;
  views?: number;
}

export interface TrackerEntry {
  id: string;
  visa_id: string;
  user_id?: string;
  lodged_date: string;
  decision_date?: string;
  processing_days?: number;
  outcome?: string;
  location?: string;
  stream?: string;
  notes?: string;
  verification_status: 'pending' | 'verified' | 'flagged';
  is_anonymous: boolean;
  is_outlier: boolean;
  created_at: string;
  visa?: {
    name: string;
    subclass: string;
  };
  user?: {
    email: string;
    display_name?: string;
  };
}

export interface PlatformSettings {
  id: string;
  default_visa_price: number;
  platform_fee_percent: number;
  maintenance_mode: boolean;
  support_email: string;
  email_templates: {
    welcome: string;
    lawyer_approved: string;
    lawyer_rejected: string;
    purchase_confirmation: string;
  };
}

// Helper function to create Supabase client
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// ==================== LAWYER VERIFICATION ====================

export async function getLawyers(status?: 'pending' | 'approved' | 'rejected'): Promise<{ data: LawyerApplication[] | null; error: string | null; count: number }> {
  try {
    const supabase = getSupabase();
    
    let query = supabase
      .from("lawyers")
      .select("*, verification_documents(*)", { count: 'exact' })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("verification_status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching lawyers:", error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data: data as LawyerApplication[], error: null, count: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching lawyers:", err);
    return { data: null, error: (err as Error).message, count: 0 };
  }
}

export async function getLawyerById(id: string): Promise<{ data: LawyerApplication | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("lawyers")
      .select("*, verification_documents(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lawyer:", error);
      return { data: null, error: error.message };
    }

    return { data: data as LawyerApplication, error: null };
  } catch (err) {
    console.error("Unexpected error fetching lawyer:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function updateLawyerStatus(
  id: string, 
  status: 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("lawyers")
      .update({ 
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating lawyer status:", error);
      return { success: false, error: error.message };
    }

    // Log the action
    await supabase.from("admin_actions").insert({
      action_type: `lawyer_${status}`,
      target_id: id,
      target_type: 'lawyer',
      notes: notes || null,
      created_at: new Date().toISOString()
    });

    revalidatePath('/admin/lawyers');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating lawyer:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function bulkUpdateLawyerStatus(
  ids: string[],
  status: 'approved' | 'rejected'
): Promise<{ success: boolean; error: string | null; updatedCount: number }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("lawyers")
      .update({ 
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .in("id", ids);

    if (error) {
      console.error("Error bulk updating lawyers:", error);
      return { success: false, error: error.message, updatedCount: 0 };
    }

    revalidatePath('/admin/lawyers');
    return { success: true, error: null, updatedCount: ids.length };
  } catch (err) {
    console.error("Unexpected error bulk updating lawyers:", err);
    return { success: false, error: (err as Error).message, updatedCount: 0 };
  }
}

// ==================== USER MANAGEMENT ====================

export async function getUsers(status?: 'active' | 'suspended', role?: 'user' | 'admin'): Promise<{ data: User[] | null; error: string | null; count: number }> {
  try {
    const supabase = getSupabase();
    
    let query = supabase
      .from("users")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data: data as User[], error: null, count: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching users:", err);
    return { data: null, error: (err as Error).message, count: 0 };
  }
}

export async function getUserById(id: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return { data: null, error: error.message };
    }

    return { data: data as User, error: null };
  } catch (err) {
    console.error("Unexpected error fetching user:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function updateUserStatus(
  id: string,
  status: 'active' | 'suspended'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("users")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating user status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating user:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error deleting user:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function exportUsers(format: 'csv' | 'json'): Promise<{ data: string | null; error: string | null; filename: string }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error exporting users:", error);
      return { data: null, error: error.message, filename: '' };
    }

    if (format === 'csv') {
      const headers = ['ID', 'Email', 'Display Name', 'Role', 'Status', 'Email Verified', 'Created At'];
      const rows = data.map((u: User) => [
        u.id,
        u.email,
        u.display_name || '',
        u.role,
        u.status,
        u.email_verified,
        u.created_at
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      return { data: csv, error: null, filename: `users_export_${new Date().toISOString().split('T')[0]}.csv` };
    }

    return { data: JSON.stringify(data, null, 2), error: null, filename: `users_export_${new Date().toISOString().split('T')[0]}.json` };
  } catch (err) {
    console.error("Unexpected error exporting users:", err);
    return { data: null, error: (err as Error).message, filename: '' };
  }
}

// ==================== NEWS CMS ====================

export async function getNewsArticles(status?: 'published' | 'draft'): Promise<{ data: NewsArticle[] | null; error: string | null; count: number }> {
  try {
    const supabase = getSupabase();
    
    let query = supabase
      .from("news_articles")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false });

    if (status === 'published') {
      query = query.eq("is_published", true);
    } else if (status === 'draft') {
      query = query.eq("is_published", false);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching news:", error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data: data as NewsArticle[], error: null, count: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching news:", err);
    return { data: null, error: (err as Error).message, count: 0 };
  }
}

export async function getNewsArticleById(id: string): Promise<{ data: NewsArticle | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching news article:", error);
      return { data: null, error: error.message };
    }

    return { data: data as NewsArticle, error: null };
  } catch (err) {
    console.error("Unexpected error fetching news article:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function createNewsArticle(article: Partial<NewsArticle>): Promise<{ data: NewsArticle | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("news_articles")
      .insert({
        ...article,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating news article:", error);
      return { data: null, error: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { data: data as NewsArticle, error: null };
  } catch (err) {
    console.error("Unexpected error creating news article:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function updateNewsArticle(id: string, article: Partial<NewsArticle>): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("news_articles")
      .update({
        ...article,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating news article:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath(`/news/${article.slug}`);
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating news article:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function publishNewsArticle(id: string, publish: boolean): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("news_articles")
      .update({
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error publishing news article:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error publishing news article:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteNewsArticle(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("news_articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting news article:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error deleting news article:", err);
    return { success: false, error: (err as Error).message };
  }
}

// ==================== VISA CONTENT MANAGEMENT ====================

export async function getVisas(category?: string): Promise<{ data: any[] | null; error: string | null; count: number }> {
  try {
    const supabase = getSupabase();
    
    let query = supabase
      .from("visas")
      .select("*, visa_purchases(count)", { count: 'exact' })
      .order("name");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching visas:", error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching visas:", err);
    return { data: null, error: (err as Error).message, count: 0 };
  }
}

export async function getVisaById(id: string): Promise<{ data: any | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("visas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching visa:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching visa:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function createVisa(visa: any): Promise<{ data: any | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("visas")
      .insert({
        ...visa,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating visa:", error);
      return { data: null, error: error.message };
    }

    revalidatePath('/admin/visas');
    revalidatePath('/visas');
    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error creating visa:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function updateVisa(id: string, visa: any): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("visas")
      .update({
        ...visa,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating visa:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/visas');
    revalidatePath('/visas');
    revalidatePath(`/visas/${id}`);
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating visa:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleVisaStatus(id: string, isActive: boolean): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("visas")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error toggling visa status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/visas');
    revalidatePath('/visas');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error toggling visa status:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteVisa(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("visas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting visa:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/visas');
    revalidatePath('/visas');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error deleting visa:", err);
    return { success: false, error: (err as Error).message };
  }
}

// ==================== TRACKER MODERATION ====================

export async function getTrackerEntries(status?: 'pending' | 'verified' | 'flagged'): Promise<{ data: TrackerEntry[] | null; error: string | null; count: number }> {
  try {
    const supabase = getSupabase();
    
    let query = supabase
      .from("tracker_entries")
      .select("*, visa:visas(name, subclass), user:users(email, display_name)", { count: 'exact' })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("verification_status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching tracker entries:", error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data: data as TrackerEntry[], error: null, count: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching tracker entries:", err);
    return { data: null, error: (err as Error).message, count: 0 };
  }
}

export async function updateTrackerEntryStatus(
  id: string,
  status: 'verified' | 'flagged',
  notes?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("tracker_entries")
      .update({
        verification_status: status,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating tracker entry:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/tracker');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating tracker entry:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteTrackerEntry(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("tracker_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting tracker entry:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/tracker');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error deleting tracker entry:", err);
    return { success: false, error: (err as Error).message };
  }
}

// ==================== PLATFORM SETTINGS ====================

export async function getPlatformSettings(): Promise<{ data: PlatformSettings | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching platform settings:", error);
      return { data: null, error: error.message };
    }

    return { data: data as PlatformSettings, error: null };
  } catch (err) {
    console.error("Unexpected error fetching platform settings:", err);
    return { data: null, error: (err as Error).message };
  }
}

export async function updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    // Check if settings exist
    const { data: existing } = await supabase
      .from("platform_settings")
      .select("id")
      .single();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("platform_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("platform_settings")
        .insert({
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
    }

    if (error) {
      console.error("Error updating platform settings:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/settings');
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating platform settings:", err);
    return { success: false, error: (err as Error).message };
  }
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats(): Promise<{ 
  data: {
    totalUsers: number;
    totalLawyers: number;
    pendingLawyers: number;
    totalPurchases: number;
    totalConsultations: number;
    totalRevenue: number;
    activeIssues: number;
  } | null; 
  error: string | null 
}> {
  try {
    const supabase = getSupabase();
    
    // Get counts in parallel
    const [
      { count: totalUsers },
      { count: totalLawyers },
      { count: pendingLawyers },
      { count: totalPurchases },
      { count: totalConsultations },
      { data: purchases }
    ] = await Promise.all([
      supabase.from("users").select("*", { count: 'exact', head: true }),
      supabase.from("lawyers").select("*", { count: 'exact', head: true }),
      supabase.from("lawyers").select("*", { count: 'exact', head: true }).eq("verification_status", "pending"),
      supabase.from("visa_purchases").select("*", { count: 'exact', head: true }),
      supabase.from("consultations").select("*", { count: 'exact', head: true }),
      supabase.from("visa_purchases").select("amount")
    ]);

    const totalRevenue = purchases?.reduce((sum, p: any) => sum + (p.amount || 0), 0) || 0;

    return {
      data: {
        totalUsers: totalUsers || 0,
        totalLawyers: totalLawyers || 0,
        pendingLawyers: pendingLawyers || 0,
        totalPurchases: totalPurchases || 0,
        totalConsultations: totalConsultations || 0,
        totalRevenue,
        activeIssues: (pendingLawyers || 0) + 0 // Could add flagged reviews etc.
      },
      error: null
    };
  } catch (err) {
    console.error("Unexpected error fetching dashboard stats:", err);
    return { data: null, error: (err as Error).message };
  }
}

// ==================== RECENT ACTIVITY ====================

export async function getRecentActivity(limit = 10): Promise<{ data: any[] | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    
    // Get recent user signups
    const { data: recentUsers, error: usersError } = await supabase
      .from("users")
      .select("id, email, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (usersError) {
      console.error("Error fetching recent activity:", usersError);
      return { data: null, error: usersError.message };
    }

    const activity = recentUsers?.map((u: any) => ({
      type: 'user_signup',
      description: `New user registration: ${u.email}`,
      timestamp: u.created_at
    })) || [];

    return { data: activity, error: null };
  } catch (err) {
    console.error("Unexpected error fetching recent activity:", err);
    return { data: null, error: (err as Error).message };
  }
}
